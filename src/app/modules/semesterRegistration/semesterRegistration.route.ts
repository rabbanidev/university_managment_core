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

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    SemesterRegistrationValidation.updateSemesterRegistrationZodSchema
  ),
  SemesterRegistrationController.updateSemesterRegistration
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  SemesterRegistrationController.deleteSemesterRegistration
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.get('/:id', SemesterRegistrationController.getSemesterRegistration);

router.post(
  '/start-registration',
  auth(ENUMS_USER_ROLE.STUDENT),
  SemesterRegistrationController.startMyRegistration
);

export const SemesterRegistrationRoutes = router;
