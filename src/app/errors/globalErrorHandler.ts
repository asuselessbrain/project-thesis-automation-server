import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../../generated/prisma/client";

class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export const globalErrorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessage = error.message;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "Duplicate Entry";
      let fieldName = "Unknown field";

      if (error.meta?.target) {
        if (Array.isArray(error.meta.target)) {
          fieldName = error.meta.target[0];
        } else {
          fieldName = String(error.meta.target);
        }
      } else {
        const match = error.message.match(/fields:\s*\(`?([^`)]+)`?\)/);
        if (match && match[1]) {
          fieldName = match[1];
        }
      }
      errorMessage = `${fieldName} already exists. Please use a different one.`;
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
      errorMessage =
        "The record you are trying to update or delete does not exist.";
    }
  }
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errorMessage = "Invalid data format or missing required fields.";

    const missingFieldMatch = error.message.match(
      /Argument `(\w+)` is missing/,
    );

    if (missingFieldMatch) {
      errorMessage = `Missing required field: ${missingFieldMatch[1]}`;
    }
  }
  else if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessage = error.message;
  }
  console.log(error);
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    errorMessage: errorMessage,
    error: error,
  });
};
