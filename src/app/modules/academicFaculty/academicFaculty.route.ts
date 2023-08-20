import express from 'express';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequestHandler(
    AcademicFacultyValidation.createAcademicFacultyZodSchema
  ),
  AcademicFacultyController.createAcademicFaculty
);

router.get('/', AcademicFacultyController.getAllAcademicFaculties);
router.get('/:id', AcademicFacultyController.getAcademicFaculty);

export const AcademicFacultyRoutes = router;
