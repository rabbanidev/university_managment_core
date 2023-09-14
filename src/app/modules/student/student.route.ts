import express from 'express';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-student',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(StudentValidation.createStudentZodSchema),
  StudentController.createStudent
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  StudentController.deleteStudent
);

router.get('/', StudentController.getAllStudents);
router.get(
  '/my-courses',
  auth(ENUMS_USER_ROLE.STUDENT),
  StudentController.getMyCourses
);
router.get('/:id', StudentController.getStudent);

export const StudentRoutes = router;
