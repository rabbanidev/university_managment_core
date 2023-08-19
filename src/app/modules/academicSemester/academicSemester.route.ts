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

export const AcademicSemesterRoutes = router;
