import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/responser";
import { TaskService } from "./task.service";

const createTaskIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.createTaskIntoDB(req.body);
  sendResponse(res, 201, "Task created successfully", result);
});

const updateTaskInDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.updateTaskInDB(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, 200, "Task updated successfully", result);
});

const updateStatusToInProgressInDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TaskService.updateStatusToInProgressInDB(
      req.params.id as string,
    );
    sendResponse(
      res,
      200,
      "Task status updated to in progress successfully",
      result,
    );
  },
);

const updateStatusToReviewInDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TaskService.updateStatusToReviewInDB(
      req.params.id as string,
      req.body,
    );
    sendResponse(
      res,
      200,
      "Task status updated to review successfully",
      result,
    );
  },
);

const updateStatusToDoneInDB = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TaskService.updateStatusToDoneInDB(
      req.params.id as string,
      req.body
    );
    sendResponse(res, 200, "Task marked as done", result);
  },
);

const allowResubmit = catchAsync(
  async (req: Request, res: Response) => {
    const result = await TaskService.allowResubmit(
      req.params.id as string,
      req.body.note,
    );
    sendResponse(
      res,
      200,
      "Student is now allowed to resubmit this task.",
      result,
    );
  },
);

const rejectTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.rejectTask(
    req.params.id as string,
    req.body
  );
  sendResponse(res, 200, "Task rejected successfully", result);
});

const getAllTasksForStudent = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const query = req.query;
    const result = await TaskService.getAllTasksForStudent(
      user.email as string,
      query,
    );
    sendResponse(res, 200, "Tasks retrieved successfully", result);
  },
);

const getTaskForTeacherReview = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const query = req.query;
    const result = await TaskService.getTaskForTeacherReview(
      user.email as string,
      query,
    );
    sendResponse(res, 200, "Tasks for review retrieved successfully", result);
  },
);

const getSingleTaskById = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskService.getSingleTaskById(req.params.id as string);
  sendResponse(res, 200, "Task retrieved successfully", result);
});

export const TaskController = {
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