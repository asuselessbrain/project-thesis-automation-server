import { Response } from "express";

export const sendResponse = <T>(res: Response, statusCode: number, message :string, result: T) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: result
    });
}