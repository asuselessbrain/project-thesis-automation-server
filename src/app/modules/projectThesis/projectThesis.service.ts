import {
  Prisma,
  ProjectThesisStatus,
  StudentStatus,
  TaskStatus,
  TeacherStatus,
} from "../../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appErrors";
import { pagination } from "./../../../shared/pagination";

const calculateOverall = (tasks: any) => {
  if (!tasks.length) return 0;
  return Math.round(
    tasks.reduce((sum: number, t: any) => sum + t.progressPercentage, 0) /
      tasks.length,
  );
};

const createProjectThesisIntoDB = async (
  email: string,
  projectThesisInfo: any,
) => {
  const isStudentExist = await prisma.student.findUnique({
    where: { email },
  });

  if (!isStudentExist) {
    throw new AppError(404, "Student not found");
  }

  const result = await prisma.projectThesis.create({
    data: { ...projectThesisInfo, studentId: isStudentExist.id },
  });

  return result;
};
// const getAllProjectThesesFromDB = async (query: any) => {

//     const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query
//     console.log(filterData)

//     let inputFields: Prisma.ProjectThesisWhereInput[] = []

//     if (searchTerm) {
//         inputFields.push({
//             OR: [
//                 { title: { contains: searchTerm, mode: 'insensitive' } },
//                 { description: { contains: searchTerm, mode: 'insensitive' } },
//                 { student: { name: { contains: searchTerm, mode: "insensitive" } } },
//                 { supervisor: { name: { contains: searchTerm, mode: "insensitive" } } },
//                 { student: { studentId: { contains: searchTerm, mode: "insensitive" } } }
//             ]
//         })
//     }
//     if (Object.keys(filterData).length) {
//         Object.entries(filterData).forEach(([field, value]) => {
//             if (field === 'session') {
//                 inputFields.push({
//                     student: {
//                         session: { equals: value as string }
//                     }
//                 })
//             }
//             else {
//                 inputFields.push({
//                     [field]: { equals: value }
//                 })
//             }
//         }
//         )
//     }

//     const whereCondition: Prisma.ProjectThesisWhereInput = { AND: inputFields }

//     const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } = pagination(skip, take, sortBy, sortOrder)

//     const result = await prisma.projectThesis.findMany({
//         where: whereCondition,
//         include: { tasks: true, student: true, supervisor: true },
//         skip: skipValue,
//         take: takeValue,
//         orderBy: { [sortByField]: sortOrderValue }
//     })

//     const total = await prisma.projectThesis.count({ where: whereCondition })
//     return {
//         meta: {
//             currentPage,
//             limit: takeValue,
//             total
//         },
//         data: result
//     }
// }

const getSingleProjectThesisFromDB = async (id: string) => {
  const result = await prisma.projectThesis.findUniqueOrThrow({
    where: { id },
    include: {
      tasks: {
        include: {
          projectThesisUpdateLogs: true,
        },
      },
      student: true,
      supervisor: true,
      course: true,
    },
  });
  const overallProgress =
    result.tasks.length === 0
      ? 0
      : Math.round(
          result.tasks.reduce((acc, t) => acc + t.progressPercentage, 0) /
            result.tasks.length,
        );

  const taskCompleted = result.tasks.filter(
    (t) => t.status === TaskStatus.DONE,
  ).length;
  const totalTasks = result.tasks.length;
  return { ...result, overallProgress, taskCompleted, totalTasks };
};

const updateProjectThesisInDB = async (id: string, updateInfo: any) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
  });

  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }

  const updateData = {
    ...updateInfo,
    status: ProjectThesisStatus.PENDING,
  };

  const result = await prisma.projectThesis.update({
    where: { id },
    data: updateData,
  });

  return result;
};

const approveProjectThesisInDB = async (id: string) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
  });
  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }

  if (isProjectThesisExist.status === ProjectThesisStatus.APPROVED) {
    throw new Error("Project or Thesis is already approved");
  }

  if (isProjectThesisExist.status === ProjectThesisStatus.REJECTED) {
    throw new Error("Project or Thesis is already rejected");
  }

  const approveStatus = ProjectThesisStatus.APPROVED;

  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: approveStatus },
  });
  return result;
};

const rejectProjectThesisInDB = async (id: string) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
  });

  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }

  if (isProjectThesisExist.status === ProjectThesisStatus.REJECTED) {
    throw new Error("Project or Thesis is already rejected");
  }

  if (isProjectThesisExist.status === ProjectThesisStatus.APPROVED) {
    throw new Error("Project or Thesis is already approved");
  }

  const rejectionStatus = ProjectThesisStatus.REJECTED;

  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: rejectionStatus },
  });

  return result;
};

const startProjectThesisInDB = async (id: string) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
  });

  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }

  if (isProjectThesisExist.status !== ProjectThesisStatus.APPROVED) {
    throw new Error("Only approved Project or Thesis can be started");
  }

  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: ProjectThesisStatus.in_PROGRESS },
  });
  return result;
};

const completeProjectThesisInDB = async (id: string) => {
  const isProjectThesisExist = await prisma.projectThesis.findUnique({
    where: { id },
  });
  if (!isProjectThesisExist) {
    throw new Error("Project or Thesis not found");
  }

  if (isProjectThesisExist.status !== ProjectThesisStatus.in_PROGRESS) {
    throw new Error("Only in-progress Project or Thesis can be completed");
  }

  const isTasksIncomplete = await prisma.task.findFirst({
    where: {
      projectThesisId: id,
      status: { not: TaskStatus.DONE },
    },
  });

  if (isTasksIncomplete) {
    throw new Error("Cannot complete Project or Thesis with incomplete tasks");
  }

  const result = await prisma.projectThesis.update({
    where: { id },
    data: { status: ProjectThesisStatus.COMPLETED },
  });
  return result;
};

const getSingleStudentProjectThesisFromDB = async (
  email: string,
  query: any,
) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  let inputFields: Prisma.ProjectThesisWhereInput[] = [];

  if (searchTerm) {
    inputFields.push({
      OR: [
        { projectTitle: { contains: searchTerm, mode: "insensitive" } },
        { student: { name: { contains: searchTerm, mode: "insensitive" } } },
        { supervisor: { name: { contains: searchTerm, mode: "insensitive" } } },
        {
          student: { studentId: { contains: searchTerm, mode: "insensitive" } },
        },
      ],
    });
  }
  if (Object.keys(filterData).length) {
    Object.entries(filterData).forEach(([field, value]) => {
      if (field === "session") {
        inputFields.push({
          student: {
            session: { equals: value as string },
          },
        });
      } else {
        inputFields.push({
          [field]: { equals: value },
        });
      }
    });
  }

  const whereCondition: Prisma.ProjectThesisWhereInput = { AND: inputFields };

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(skip, take, sortBy, sortOrder);

  const student = await prisma.student.findUnique({
    where: {
      email,
      status: StudentStatus.ACTIVE,
    },
  });

  if (!student) {
    throw new AppError(404, "Student not found");
  }

  const result = await prisma.projectThesis.findMany({
    where: { studentId: student.id, ...whereCondition },
    include: { tasks: true, student: true, supervisor: true, course: true },
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
  });

  const total = await prisma.projectThesis.count({
    where: { studentId: student.id, ...whereCondition },
  });

  const totalPages = Math.ceil(total / takeValue);

  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);

    return {
      ...proposal,
      overallProgress: progress,
    };
  });

  console.log(proposalsWithProgress)
  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages,
    },
    data: proposalsWithProgress,
  };
};

const getSingleSupervisorProjectThesisFromDB = async (
  email: string,
  query?: any,
) => {
  const { searchTerm, skip, take, sortBy, sortOrder, ...filterData } = query;

  let inputFields: Prisma.ProjectThesisWhereInput[] = [];

  if (searchTerm) {
    inputFields.push({
      OR: [
        { projectTitle: { contains: searchTerm, mode: "insensitive" } },
        { student: { name: { contains: searchTerm, mode: "insensitive" } } },
        { supervisor: { name: { contains: searchTerm, mode: "insensitive" } } },
        {
          student: { studentId: { contains: searchTerm, mode: "insensitive" } },
        },
      ],
    });
  }
  if (Object.keys(filterData).length) {
    Object.entries(filterData).forEach(([field, value]) => {
      if (field === "session") {
        inputFields.push({
          student: {
            session: { equals: value as string },
          },
        });
      } else {
        inputFields.push({
          [field]: { equals: value },
        });
      }
    });
  }

  const whereCondition: Prisma.ProjectThesisWhereInput = { AND: inputFields };

  const { currentPage, skipValue, takeValue, sortByField, sortOrderValue } =
    pagination(skip, take, sortBy, sortOrder);

  const teacher = await prisma.teacher.findUnique({
    where: {
      email,
      status: TeacherStatus.ACTIVE,
    },
  });

  if (!teacher) {
    throw new AppError(404, "teacher not found");
  }

  const result = await prisma.projectThesis.findMany({
    where: { supervisorId: teacher.id, ...whereCondition },
    include: { tasks: true, student: true, supervisor: true },
    skip: skipValue,
    take: takeValue,
    orderBy: { [sortByField]: sortOrderValue },
  });

  const total = await prisma.projectThesis.count({
    where: { supervisorId: teacher.id, ...whereCondition },
  });

  const totalPages = Math.ceil(total / takeValue);

  const proposalsWithProgress = result.map((proposal) => {
    const progress = calculateOverall(proposal.tasks);

    return {
      ...proposal,
      overallProgress: progress,
    };
  });

  return {
    meta: {
      currentPage,
      total,
      limit: takeValue,
      totalPages,
    },
    data: proposalsWithProgress,
  };
};

export const ProjectThesisService = {
  createProjectThesisIntoDB,
  // getAllProjectThesesFromDB,
  getSingleProjectThesisFromDB,
  getSingleStudentProjectThesisFromDB,
  getSingleSupervisorProjectThesisFromDB,
  updateProjectThesisInDB,
  approveProjectThesisInDB,
  rejectProjectThesisInDB,
  startProjectThesisInDB,
  completeProjectThesisInDB,
};
