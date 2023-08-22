import express from 'express';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-department',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.createAcademicDepartment
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(
    AcademicDepartmentValidation.updateAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.updateAcademicDepartment
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  AcademicDepartmentController.deleteAcademicDepartment
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartments);

router.get('/:id', AcademicDepartmentController.getAcademicDepartment);

export const AcademicDepartmentRoutes = router;
