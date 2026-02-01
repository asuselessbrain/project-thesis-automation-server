import express from 'express'
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../../generated/prisma/enums';

const router = express.Router()

router.get('/', auth(UserRole.ADMIN), AdminController.getAllAdminFromDB)
router.get('/:id', auth(UserRole.ADMIN), AdminController.getSingleAdminFromDB)
router.patch('/:id', auth(UserRole.ADMIN), AdminController.updateAdminIntoDB)
router.patch('/delete-admin/:id', auth(UserRole.ADMIN), AdminController.deleteAdminFromDB)

export const adminRouter = router;