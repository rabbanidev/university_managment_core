import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/create-semester',
  validateRequestHandler(
    AcademicSemesterValidation.createAcademicSemesterZodSchema
  ),
  AcademicSemesterController.createAcademicSemester
);

router.get('/', AcademicSemesterController.getAllSemesters);
router.get('/:id', AcademicSemesterController.getAcademicSemester);

export const AcademicSemesterRoutes = router;
