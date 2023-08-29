import express from 'express';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { OfferedCourseValidation } from './offeredCourse.validation';
import { OfferedCourseController } from './offeredCourse.controller';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(OfferedCourseValidation.createOfferedCourseZodSchema),
  OfferedCourseController.createOfferedCourse
);

export const OfferedCourseRoutes = router;
