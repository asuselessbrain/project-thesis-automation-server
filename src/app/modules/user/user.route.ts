import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post("/create-student", UserController.createStudentIntoDB);
router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  UserController.createAdminIntoDB,
);
router.post(
  "/create-teacher",
  auth(UserRole.ADMIN),
  UserController.createTeacherIntoDB,
);
router.post("/verify-email", UserController.verifyEmail);

export const UserRoutes = router;
