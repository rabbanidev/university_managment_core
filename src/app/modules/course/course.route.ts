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

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(CourseValidation.updateCourseZodSchema),
  CourseController.updateCourse
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  CourseController.deleteCourse
);

router.get('/', CourseController.getCourses);

router.get('/:id', CourseController.getCourse);

router.post(
  '/:id/assign-faculties',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(CourseValidation.assignFacultiesZodSchema),
  CourseController.assignFaculties
);

router.delete(
  '/:id/remove-faculties',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(CourseValidation.removeFacultiesZodSchema),
  CourseController.removeFaculties
);

export const CourseRoutes = router;
