import express from 'express';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-semester-registration',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    SemesterRegistrationValidation.createSemesterRegistrationZodSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);

export const SemesterRegistrationRoutes = router;
