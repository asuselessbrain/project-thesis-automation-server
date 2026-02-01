import express from 'express'
import { TeacherController } from './teacher.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '../../../../generated/prisma/enums'

const router = express.Router()

router.get('/', auth(UserRole.ADMIN), TeacherController.getAllTeacherFromDB)
router.get('/teacher-list', auth(UserRole.ADMIN), TeacherController.getAllTeacherForCourseAssign)
router.get('/:id', auth(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT), TeacherController.getSingleTeacherFromDB)
router.patch('/delete-teacher/:id', auth(UserRole.ADMIN), TeacherController.deleteTeacherFromDB)
router.patch('/re-activate-teacher/:id', auth(UserRole.ADMIN), TeacherController.reActivateTeacherInDB)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.TEACHER), TeacherController.updateTeacherIntoDB)


export const teacherRouter = router;