import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { studentEnrolledCourseMarkFilterableFields } from './studentEnrolledCourseMark.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const getAllStudentEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
    const options = pick(req.query, paginationFields);
    const result =
      await StudentEnrolledCourseMarkService.getAllStudentEnrolledCourseMarks(
        filters,
        options
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student course marks fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseMarkService.updateStudentMarks(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Marks updated!',
    data: result,
  });
});

const updateStudentFinalMarks = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.updateStudentFinalMarks(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Update final marks updated!',
      data: result,
    });
  }
);

const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentEnrolledCourseMarkFilterableFields);
  const options = pick(req.query, paginationFields);

  const result = await StudentEnrolledCourseMarkService.getMyCourseMarks(
    filters,
    options,
    req.user.userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student course marks fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const StudentEnrolledCourseMarkController = {
  getAllStudentEnrolledCourseMarks,
  updateStudentMarks,
  updateStudentFinalMarks,
  getMyCourseMarks,
};
