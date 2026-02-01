import express from 'express';
import { ProjectThesisController } from './projectThesis.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma/enums';

const router = express.Router();

router.post('/', auth(UserRole.STUDENT), ProjectThesisController.createProjectThesisIntoDB)
// router.get('/', ProjectThesisController.getAllProjectThesesFromDB)
router.get('/student', auth(UserRole.STUDENT), ProjectThesisController.getSingleStudentProjectThesisFromDB)
router.get('/supervisor', auth(UserRole.TEACHER), ProjectThesisController.getSingleSupervisorProjectThesisFromDB)
router.get('/:id', auth(UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT), ProjectThesisController.getSingleProjectThesisFromDB)
router.patch('/approve-project-thesis/:id', auth(UserRole.TEACHER), ProjectThesisController.approveProjectThesis)
router.patch('/reject-project-thesis/:id', auth(UserRole.TEACHER), ProjectThesisController.rejectProjectThesis)
router.patch('/start-project-thesis/:id', auth(UserRole.STUDENT), ProjectThesisController.startProjectThesisInDB)
router.patch('/complete-project-thesis/:id', auth(UserRole.TEACHER), ProjectThesisController.completeProjectThesisInDB)
router.patch('/:id', ProjectThesisController.updateProjectThesisInDB)

export const ProjectThesisRoutes = router;