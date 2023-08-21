import prisma from '../../../shared/prisma';
import { Student, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';

const createStudent = async (payload: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: payload,
  });
  return result;
};

export const StudentService = {
  createStudent,
};
