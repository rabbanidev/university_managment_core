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

router.patch(
  '/:id',
  validateRequestHandler(
    AcademicSemesterValidation.updateAcademicSemesterZodSchema
  ),
  AcademicSemesterController.updateAcademicSemester
);

router.delete('/:id', AcademicSemesterController.deleteAcademicSemester);

router.get('/:id', AcademicSemesterController.getAcademicSemester);

router.get('/', AcademicSemesterController.getAllSemesters);

export const AcademicSemesterRoutes = router;
