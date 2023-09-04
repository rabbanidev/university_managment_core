import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';

const router = express.Router();

router.post(
  '/create-offered-course-class-schedule',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(OfferedCourseClassScheduleValidation.create),
  OfferedCourseClassScheduleController.createOfferedCourseClassSchedule
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(OfferedCourseClassScheduleValidation.update),
  OfferedCourseClassScheduleController.updateOfferedClassSchedule
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.deleteOfferedCourseClassSchedule
);

router.get(
  '/',
  OfferedCourseClassScheduleController.getAllOfferedCourseClassSchedules
);

router.get(
  '/:id',
  OfferedCourseClassScheduleController.getOfferedCourseClassSchedule
);

export const OfferedCourseClassScheduleRoutes = router;
