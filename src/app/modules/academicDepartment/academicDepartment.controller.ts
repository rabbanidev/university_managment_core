import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { AcademicDepartment } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../../constants/pagination';
import { AcademicDepartmentService } from './academicDepartment.service';
import { academicDepartmentFilterableFields } from './academicDepartment.constant';

const createAcademicDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicDepartmentService.createAcademicDepartment(
      req.body
    );

    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic department successfully created!',
      data: result,
    });
  }
);

const getAllAcademicDepartments = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, academicDepartmentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await AcademicDepartmentService.getAllAcademicDepartments(
      filters,
      paginationOptions
    );

    sendResponse<AcademicDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic departments retrive successfully!',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartments,
};
