import { Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/responser";

const createStudentIntoDB = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await UserService.createStudentIntoDB(req.body);
    sendResponse(res, 201, "Account created successfully. Please check your email for email verification.", result)
})

const createAdminIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdminIntoDB(req.body);
    sendResponse(res, 201, "Admin created successfully. Please check your email for email verification.", result)
})

const createTeacherIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createTeacherIntoDB(req.body);
    sendResponse(res, 201, "Teacher created successfully. Please check your email for email verification.", result)
})

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token, email } = req.body;
    const result = await UserService.verifyEmailInDB(token as string, email as string);
    sendResponse(res, 200, "Email verified successfully", result);
})


export const UserController = {
    createStudentIntoDB,
    createAdminIntoDB,
    createTeacherIntoDB,
    verifyEmail
}