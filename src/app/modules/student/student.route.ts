import express from "express";
import { StudentController } from "./student.controller";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.TEACHER, UserRole.ADMIN),
  StudentController.getAllStudentFromDB,
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.STUDENT, UserRole.TEACHER),
  StudentController.getSingleStudentFromDB,
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.STUDENT),
  StudentController.updateStudentIntoDB,
);
router.patch(
  "/delete-student/:id",
  auth(UserRole.ADMIN),
  StudentController.deleteStudentFromDB,
);

router.patch(
  "/approve-student/:id",
  auth(UserRole.ADMIN),
  StudentController.approveStudentInDB,
);

router.patch(
  "/re-activate-student/:id",
  auth(UserRole.ADMIN),
  StudentController.reActivateStudentInDB,
);
export const StudentRoutes = router;
