import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { Course, CourseFaculty } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './course.service';
import { courseFilterableFields } from './course.constant';
import { paginationFields } from '../../../constants/pagination';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course successfully created!',
    data: result,
  });
});

const getCourses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, courseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CourseService.getCourses(filters, paginationOptions);

  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses successfully fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.getCourse(req.params.id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course successfully fetched!',
    data: result,
  });
});

const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.updateCourse(req.params.id, req.body);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course successfully updated!',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.deleteCourse(req.params.id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course successfully deleted!',
    data: result,
  });
});

const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.assignFaculties(
    req.params.id,
    req.body.faculties
  );

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Faculty assigned successfully!',
    data: result,
  });
});

const removeFaculties = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.removeFaculties(
    req.params.id,
    req.body.faculties
  );

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Faculty removed successfully!',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  assignFaculties,
  removeFaculties,
};
