import express from "express";
import { CourseTeacherController } from "./courseTeacher.controller";
import { UserRole } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), CourseTeacherController.createCourseTeacherIntoDB);
router.get("/", CourseTeacherController.getAllCourseTeachersFromDB);
router.get("/:courseId", CourseTeacherController.getSpecificCourseTeacher);
router.patch("/:id", CourseTeacherController.updateCourseTeacherIntoDB);

export const CourseTeacherRoutes = router;