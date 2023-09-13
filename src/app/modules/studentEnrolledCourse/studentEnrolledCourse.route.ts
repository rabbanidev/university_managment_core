import express from 'express';
import auth from '../../middlewares/auth';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { StudentEnrolledCourseValidation } from './studentEnrolledCourse.validation';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.get('/', StudentEnrolledCourseController.getAllStudentEnrolledCourses);

router.get('/:id', StudentEnrolledCourseController.getStudentEnrolledCourse);

router.post(
  '/',
  validateRequestHandler(StudentEnrolledCourseValidation.create),
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.createStudentEnrolledCourse
);

router.patch(
  '/:id',
  validateRequestHandler(StudentEnrolledCourseValidation.update),
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.updateStudentEnrolledCourse
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.deleteStudentEnrolledCourse
);

export const StudentEnrolledCourseRoutes = router;
