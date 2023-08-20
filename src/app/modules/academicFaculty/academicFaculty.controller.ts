import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AcademicFacultyService } from './academicFaculty.service';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFaculty } from '@prisma/client';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { academicFacultyFilterableFields } from './academicFaculty.constant';

const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicFacultyService.createAcademicFaculty(req.body);

    sendResponse<AcademicFaculty>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic faculty successfully created!',
      data: result,
    });
  }
);

const getAllAcademicFaculties = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicFacultyFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicFacultyService.getAllAcademicFaculties(
      filters,
      paginationOptions
    );

    sendResponse<AcademicFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic faculties retrive successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getAcademicFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.getAcademicFaculty(req.params.id);

  sendResponse<AcademicFaculty | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty retrive successfully!',
    data: result,
  });
});

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getAcademicFaculty,
};
