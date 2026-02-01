import { Request, Response } from "express";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/responser";
import { AdminService } from "./admin.service";

const getAllAdminFromDB = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await AdminService.getAllAdminFromDB(query);
    sendResponse(res, 200, "Admins retrieved successfully", result);
})

const getSingleAdminFromDB = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id!;
    const result = await AdminService.getSingleAdminFromDB(id);
    sendResponse(res, 200, "Admin retrieved successfully", result);
})

const updateAdminIntoDB = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id!;
    const updateData = req.body;
    const result = await AdminService.updateAdminIntoDB(adminId, updateData);
    sendResponse(res, 200, "Admin updated successfully", result);
})

const deleteAdminFromDB = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.params.id!;
    const result = await AdminService.deleteAdminFromDB(adminId);
    sendResponse(res, 200, "Admin deleted successfully", result);
})

export const AdminController = {
    getAllAdminFromDB,
    updateAdminIntoDB,
    getSingleAdminFromDB,
    deleteAdminFromDB
}