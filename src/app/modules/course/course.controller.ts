import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
// import { Co } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CourseService } from './course.service';
import { ICourseCreateData } from './course.interface';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse<ICourseCreateData>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course successfully created!',
    data: result,
  });
});

export const CourseController = {
  createCourse,
};
