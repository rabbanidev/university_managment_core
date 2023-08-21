import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { Student } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../../constants/pagination';
import { StudentService } from './student.service';
import { studentFilterableFields } from './student.constant';

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.createStudent(req.body);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student successfully created!',
    data: result,
  });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions
  );

  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrive successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getStudent(req.params.id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student retrive successfully!',
    data: result,
  });
});

const updateStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.updateStudent(req.params.id, req.body);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updated successfully!',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.deleteStudent(req.params.id);

  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully!',
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
