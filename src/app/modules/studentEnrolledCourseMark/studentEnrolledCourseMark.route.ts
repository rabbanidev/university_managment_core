import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import { ENUMS_USER_ROLE } from '../../../enum/enum';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/',
  auth(ENUMS_USER_ROLE.ADMIN, ENUMS_USER_ROLE.FACULTY),
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMarks
);

router.patch(
  '/update-marks',
  StudentEnrolledCourseMarkController.updateStudentMarks
);

router.patch(
  '/update-final-marks',
  StudentEnrolledCourseMarkController.updateStudentFinalMarks
);

export const StudentEnrolledCourseMarkRoutes = router;
