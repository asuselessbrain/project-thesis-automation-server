import express from "express";
import { CourseController } from "./course.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(UserRole.ADMIN), CourseController.createCourseIntoDB);
router.get("/", CourseController.getAllCoursesFromDB);
router.get("/active-courses", CourseController.getAllCourseForProjectThesis);
router.get(
  "/my-courses",
  auth(UserRole.TEACHER),
  CourseController.getMyAssignedCourses,
);
router.get("/:id", CourseController.getSingleCourseFromDB);
router.patch(
  "/:id",
  auth(UserRole.ADMIN),
  CourseController.updateCoursesIntoDB,
);
router.patch(
  "/trash/:id",
  auth(UserRole.ADMIN),
  CourseController.courseSetInTrashInDB,
);
router.patch(
  "/reactivate/:id",
  auth(UserRole.ADMIN),
  CourseController.reActivateCourseInDB,
);

export const CourseRoutes = router;
