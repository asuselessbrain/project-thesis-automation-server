import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/responser";
import { CourseTeacherService } from "./courseTeacher.service";

const createCourseTeacherIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseTeacherService.createCourseTeacherIntoDB(req.body);
    sendResponse(res, 201, "Course teacher created successfully", result);
})

const getAllCourseTeachersFromDB = catchAsync(async (req: Request, res: Response) => {
    const result = await CourseTeacherService.getAllCourseTeachersFromDB(req.query);
    sendResponse(res, 200, "Course teachers retrieved successfully", result);
})

const updateCourseTeacherIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await CourseTeacherService.updateCourseTeacherIntoDB(id as string, req.body);
    sendResponse(res, 200, "Course teacher updated successfully", result);
})

const getSpecificCourseTeacher = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params
    const result = await CourseTeacherService.getSpecificCourseTeacher(courseId as string);
    sendResponse(res, 200, "Course teacher retrieved successfully", result);
})

export const CourseTeacherController = {
    createCourseTeacherIntoDB,
    getAllCourseTeachersFromDB,
    updateCourseTeacherIntoDB,
    getSpecificCourseTeacher
}