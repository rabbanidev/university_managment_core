import express from 'express';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-faculty',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    AcademicFacultyValidation.createAcademicFacultyZodSchema
  ),
  AcademicFacultyController.createAcademicFaculty
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    AcademicFacultyValidation.updateAcademicFacultyZodSchema
  ),
  AcademicFacultyController.updateAcademicFaculty
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  AcademicFacultyController.deleteAcademicFaculty
);

router.get('/', AcademicFacultyController.getAllAcademicFaculties);

router.get('/:id', AcademicFacultyController.getAcademicFaculty);

export const AcademicFacultyRoutes = router;
