import express from 'express';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-faculty',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(FacultyValidation.createFacultyZodSchema),
  FacultyController.createFaculty
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateFaculty
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  FacultyController.deleteFaculty
);

router.get('/', FacultyController.getAllFaculties);

router.get(
  '/my-courses',
  auth(ENUMS_USER_ROLE.FACULTY),
  FacultyController.myCourses
);

router.get('/:id', FacultyController.getFaculty);

router.post(
  '/:id/assign-courses',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(FacultyValidation.assignOrRemoveCoursesZodSchema),
  FacultyController.assignCourses
);

router.delete(
  '/:id/remove-courses',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(FacultyValidation.assignOrRemoveCoursesZodSchema),
  FacultyController.removeCourses
);

export const FacultyRoutes = router;
