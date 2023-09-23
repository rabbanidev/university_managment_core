import { ENUMS_USER_ROLE } from './../../../enum/enum';
import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import auth from '../../middlewares/auth';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { StudentEnrolledCourseMarkValidation } from './studentEnrolledCourseMark.validation';

const router = express.Router();

router.get(
  '/',
  auth(
    ENUMS_USER_ROLE.FACULTY,
    ENUMS_USER_ROLE.ADMIN,
    ENUMS_USER_ROLE.SUPER_ADMIN
  ),
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMarks
);

router.get(
  '/my-marks',
  auth(ENUMS_USER_ROLE.STUDENT),
  StudentEnrolledCourseMarkController.getMyCourseMarks
);

router.post(
  '/update-marks',
  auth(ENUMS_USER_ROLE.FACULTY),
  validateRequestHandler(
    StudentEnrolledCourseMarkValidation.updateStudentMarks
  ),
  StudentEnrolledCourseMarkController.updateStudentMarks
);

router.post(
  '/update-final-marks',
  auth(ENUMS_USER_ROLE.FACULTY),
  validateRequestHandler(
    StudentEnrolledCourseMarkValidation.updateStudentCourseFinalMarks
  ),
  StudentEnrolledCourseMarkController.updateStudentFinalMarks
);

export const StudentEnrolledCourseMarkRoutes = router;
