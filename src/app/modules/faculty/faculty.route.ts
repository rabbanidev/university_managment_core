import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';
import validateRequestHandler from '../../middlewares/validateRequestHandler';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequestHandler(FacultyValidation.createFacultyZodSchema),
  FacultyController.createFaculty
);

router.patch(
  '/:id',
  validateRequestHandler(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateFaculty
);

router.delete('/:id', FacultyController.deleteFaculty);

router.get('/', FacultyController.getAllFaculties);

router.get('/:id', FacultyController.getFaculty);

export const FacultyRoutes = router;
