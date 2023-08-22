import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { AcademicSemesterValidation } from './academicSemester.validation';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-semester',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    AcademicSemesterValidation.createAcademicSemesterZodSchema
  ),
  AcademicSemesterController.createAcademicSemester
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    AcademicSemesterValidation.updateAcademicSemesterZodSchema
  ),
  AcademicSemesterController.updateAcademicSemester
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  AcademicSemesterController.deleteAcademicSemester
);

router.get('/:id', AcademicSemesterController.getAcademicSemester);

router.get('/', AcademicSemesterController.getAllSemesters);

export const AcademicSemesterRoutes = router;
