import { Prisma } from "../../../../generated/prisma/client";
import { TaskStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { filtering } from "../../../shared/filtering";
import sendEmail from "../../../shared/mailSender";
import { pagination } from "../../../shared/pagination";
import { searching } from "../../../shared/searching";
import { taskCompletionTemplate } from "../../../utils/emailTemplates/taskCompletionTemplete";
import { taskFailedTemplate } from "../../../utils/emailTemplates/taskRejectTemplate";
import { taskResubmissionTemplate } from "../../../utils/emailTemplates/taskResubmissionTemplate";
import AppError from "../../errors/appErrors";

const createTaskIntoDB = async (taskInfo: any) => {
  const result = await prisma.task.create({
    data: taskInfo,
  });

  return result;
};

const updateTaskInDB = async (id: string, taskInfo: any) => {
  const isTaskExist = await prisma.task.findUniqueOrThrow({ where: { id } });

  if (!isTaskExist) {
    throw new Error("Task not found");
  }

  const result = await prisma.task.update({
    where: { id: isTaskExist.id },
    data: taskInfo,
  });

  return result;
};

const updateStatusToInProgressInDB = async (id: string) => {
  const isTaskExist = await prisma.task.findUniqueOrThrow({ where: { id } });

  if (!isTaskExist) {
    throw new Error("Task not found");
  }

  if (isTaskExist.status !== TaskStatus.TODO) {
    throw new Error("Only todo task can be set to in-progress");
  }

  const result = await prisma.task.update({
    where: { id: isTaskExist.id },
    data: { status: TaskStatus.IN_PROGRESS },
  });

  return result;
};

const updateStatusToReviewInDB = async (id: string, updateData: any) => {
  const isTaskExist = await prisma.task.findUniqueOrThrow({ where: { id } });
  if (!isTaskExist) {
    throw new Error("Task not found");
  }
  if (isTaskExist.status !== TaskStatus.IN_PROGRESS) {
    throw new Error("Only in-progress task can be set to review");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.task.update({
      where: { id: isTaskExist.id },
      data: { status: TaskStatus.REVIEW },
    });
    const logData = await transactionClient.projectThesisUpdateLog.create({
      data: {
        projectThesisId: isTaskExist.projectThesisId,
        taskId: isTaskExist.id,
        liveLink: updateData.liveLink,
        fileUrl: updateData.fileUrl,
      },
    });
    return logData;
  });

  return result;
};

const updateStatusToDoneInDB = async (
  id: string,
  updateData: { rating: number; note?: string; updateLogId: string },
) => {
  const isTaskExist = await prisma.task.findUnique({
    where: { id },
    include: { projectThesis: { include: { student: true } } },
  });

  if (!isTaskExist) {
    throw new AppError(404, "Task not found");
  }

  if (isTaskExist.status !== TaskStatus.REVIEW) {
    throw new AppError(400, "Only review task can be set to done");
  }

  const calculatedProgress = Number(updateData.rating) * 20;

  const data = {
    status: TaskStatus.DONE,
    ratting: updateData.rating,
    progressPercentage: calculatedProgress,
    feedback: updateData.note !== undefined ? updateData.note : null,
  };

  const result = prisma.$transaction(async (transactionClient) => {
    await transactionClient.task.update({
      where: { id: isTaskExist.id },
      data: data,
    });

    const updateLog = await transactionClient.projectThesisUpdateLog.update({
      where: { id: updateData.updateLogId },
      data: {
        supervisorFeedback:
          updateData.note !== undefined ? updateData.note : null,
      },
    });
    return updateLog
  });

  await sendEmail({
    to: isTaskExist.projectThesis.student.email,
    subject: "✅ Task Completed Successfully",
    html: taskCompletionTemplate(isTaskExist),
  });

  return result;
};

const allowResubmit = async (id: string, note: string) => {
  const isTaskExist = await prisma.task.findUnique({
    where: { id },
    include: { projectThesis: { include: { student: true } } },
  });

  if (!isTaskExist) {
    throw new AppError(404, "Task not found");
  }

  if (isTaskExist.status !== TaskStatus.REVIEW) {
    throw new AppError(400, "Only review task can be resubmitted");
  }

  const data = {
    ratting: 0,
    progressPercentage: 0,
    feedback: note,
    status: TaskStatus.IN_PROGRESS,
  };

  const result = await prisma.task.update({
    where: { id: isTaskExist.id },
    data: data,
  });

  await sendEmail({
    to: isTaskExist.projectThesis.student.email,
    subject: "🔁 Task Resubmission Allowed",
    html: taskResubmissionTemplate(isTaskExist, note),
  });

  return result;
};

const rejectTask = async (id: string, updatedData: { note: string; updateLogId: string }) => {
  const isTaskExist = await prisma.task.findUnique({
    where: { id },
    include: { projectThesis: { include: { student: true } } },
  });

  if (!isTaskExist) {
    throw new AppError(404, "Task not found");
  }

  if (isTaskExist.status !== TaskStatus.REVIEW) {
    throw new AppError(400, "Only review task can be rejected");
  }

  const data = {
    ratting: 0,
    progressPercentage: 0,
    feedback: updatedData.note,
    status: TaskStatus.FAILED,
  };

  const result = prisma.$transaction(async (transactionClient) => {
    await transactionClient.task.update({
      where: { id: isTaskExist.id },
      data: data,
    });
    const updateLog = await transactionClient.projectThesisUpdateLog.update({
      where: { id: updatedData.updateLogId },
      data: {
        supervisorFeedback: updatedData.note,
      },
    });
    return updateLog;
  });

  await sendEmail({
    to: isTaskExist.projectThesis.student.email,
    subject: "❌ Task Failed",
    html: taskFailedTemplate(isTaskExist, updatedData.note),
  });

  return result;
};

const getAllTasksForStudent = async (email: string, query: any) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  const isStudentExist = await prisma.student.findUniqueOrThrow({
    where: { email },
  });
  

  const searchFields = [
    "title",
    "projectThesis.projectTitle",
    "projectThesis.course.courseCode",
    "projectThesis.course.courseName",
    "projectThesis.supervisor.name",
  ];

  let inputFilter: Prisma.TaskWhereInput[] = [];

  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }

  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(Number(skip), Number(take), sortBy, sortOrder);

  const whereCondition: Prisma.TaskWhereInput = { AND: inputFilter, projectThesis: { studentId: isStudentExist.id } };

  const tasks = await prisma.task.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
    include: {
      projectThesis: {
        include: {
          course: true,
          supervisor: true,
        },
      },
    },
  });

  const total = await prisma.task.count({ where: whereCondition });

  const totalPages = Math.ceil(total / takeValue);

  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages,
    },
    data: tasks,
  };
};

const getTaskForTeacherReview = async (email: string, query: any) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  const isTeacherExist = await prisma.teacher.findUniqueOrThrow({
    where: { email },
  });

  const searchFields = [
    "title",
    "projectThesis.projectTitle",
    "projectThesis.course.courseCode",
    "projectThesis.course.courseName",
    "projectThesis.student.name",
  ];

  let inputFilter: Prisma.TaskWhereInput[] = [];

  if (searchTerm) {
    searching(inputFilter, searchFields, searchTerm);
  }

  if (Object.keys(filterData).length > 0) {
    filtering(inputFilter, filterData);
  }

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(Number(skip), Number(take), sortBy, sortOrder);

  const whereCondition: Prisma.TaskWhereInput = {
    status: TaskStatus.REVIEW,
    AND: inputFilter,
    projectThesis: { supervisorId: isTeacherExist.id },
  };

  const tasks = await prisma.task.findMany({
    where: whereCondition,
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
    include: {
      projectThesis: {
        include: {
          course: true,
          student: true,
        },
      },
    },
  });

  const total = await prisma.task.count({ where: whereCondition });

  const totalPages = Math.ceil(total / takeValue);

  return {
    meta: {
      currentPage,
      limit: takeValue,
      total,
      totalPages,
    },
    data: tasks,
  };
};

const getSingleTaskById = async (id: string) => {
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      projectThesis: {
        include: {
          course: true,
          supervisor: true,
          student: true,
        },
      },
      projectThesisUpdateLogs: true,
    },
  });

  if (!task) {
    throw new AppError(404, "Task not found");
  }
  return task;
};

export const TaskService = {
  createTaskIntoDB,
  updateTaskInDB,
  updateStatusToInProgressInDB,
  updateStatusToReviewInDB,
  updateStatusToDoneInDB,
  allowResubmit,
  rejectTask,
  getAllTasksForStudent,
  getTaskForTeacherReview,
  getSingleTaskById,
};
