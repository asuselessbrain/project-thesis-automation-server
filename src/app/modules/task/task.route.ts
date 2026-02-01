import express from "express";
import { TaskController } from "./task.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../../../../generated/prisma/enums";

const router = express.Router();

router.get(
  "/student-tasks",
  auth(UserRole.STUDENT),
  TaskController.getAllTasksForStudent,
);
router.get(
  "/teacher-review-tasks",
  auth(UserRole.TEACHER),
  TaskController.getTaskForTeacherReview,
);
router.get(
  "/:id",
  auth(UserRole.STUDENT, UserRole.TEACHER),
  TaskController.getSingleTaskById,
);
router.post("/", TaskController.createTaskIntoDB);
router.patch("/in-progress/:id", TaskController.updateStatusToInProgressInDB);
router.patch("/submit-task/:id", TaskController.updateStatusToReviewInDB);
router.patch("/done/:id", TaskController.updateStatusToDoneInDB);
router.patch("/resubmit/:id", TaskController.allowResubmit);
router.patch("/reject/:id", TaskController.rejectTask);
router.patch("/:id", TaskController.updateTaskInDB);

export const TaskRoutes = router;
