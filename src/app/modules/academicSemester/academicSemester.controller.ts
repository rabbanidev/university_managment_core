import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { AcademicSemester } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicSemesterService.createAcademicSemester(
      req.body
    );

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester successfully created!',
      data: result,
    });
  }
);

export const AcademicSemesterController = {
  createAcademicSemester,
};
