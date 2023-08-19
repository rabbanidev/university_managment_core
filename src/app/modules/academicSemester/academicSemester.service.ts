import { PrismaClient, AcademicSemester } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';

const prisma = new PrismaClient();

const createAcademicSemester = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: payload,
  });
  return result;
};

const getAllSemesters = async (
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.academicSemester.findMany({
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: result,
  };
};

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllSemesters,
};
