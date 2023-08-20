import express from 'express';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';

const router = express.Router();

router.post(
  '/create-department',
  validateRequestHandler(
    AcademicDepartmentValidation.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.createAcademicDepartment
);
router.get('/', AcademicDepartmentController.getAllAcademicDepartments);
router.get('/:id', AcademicDepartmentController.getAcademicDepartment);

export const AcademicDepartmentRoutes = router;
