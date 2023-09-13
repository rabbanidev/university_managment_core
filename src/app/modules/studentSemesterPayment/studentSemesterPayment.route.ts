import express from 'express';
import auth from '../../middlewares/auth';
import { StudentSemesterPaymentController } from './studentSemesterPayment.controller';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.get(
  '/',
  auth(ENUMS_USER_ROLE.ADMIN, ENUMS_USER_ROLE.FACULTY),
  StudentSemesterPaymentController.getAllStudentSemesterPayments
);

export const StudentSemesterPaymentRoutes = router;
