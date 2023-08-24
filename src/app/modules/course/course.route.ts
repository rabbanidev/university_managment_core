import express from 'express';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(CourseValidation.createCourseZodSchema),
  CourseController.createCourse
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  CourseController.deleteCourse
);

router.post('/', CourseController.getCourses);

router.post('/:id', CourseController.getCourse);

export const CourseRoutes = router;
