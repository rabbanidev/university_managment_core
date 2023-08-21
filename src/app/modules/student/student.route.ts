import express from 'express';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import validateRequestHandler from '../../middlewares/validateRequestHandler';

const router = express.Router();

router.post(
  '/create-student',
  validateRequestHandler(StudentValidation.createStudentZodSchema),
  StudentController.createStudent
);

router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getStudent);

export const StudentRoutes = router;
