import prisma from '../../../shared/prisma';
import { AcademicSemester, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IAcademicSemesterFilters } from './academicSemester.interface';
import {
  EVENT_ACADEMIC_SEMESTER_CREATED,
  EVENT_ACADEMIC_SEMESTER_DELETED,
  EVENT_ACADEMIC_SEMESTER_UPDATED,
  academicSemesterSearchableFields,
  academicSemesterTitleCodeMapper,
  academicSemesterTitlesEndMonth,
  academicSemesterTitlesStartMonth,
} from './academicSemester.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { RedisClient } from '../../../shared/redis';

const createAcademicSemester = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {
  // Check academic semester wise code
  if (academicSemesterTitleCodeMapper[payload.title] !== payload.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid semester code!');
  }
  // Check academic semester start month
  if (academicSemesterTitlesStartMonth[payload.title] !== payload.startMonth) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid start month!');
  }
  // Check academic semester end month
  if (academicSemesterTitlesEndMonth[payload.title] !== payload.endMonth) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid end month!');
  }

  const result = await prisma.academicSemester.create({
    data: payload,
  });

  if (result) {
    RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_CREATED,
      JSON.stringify(result)
    );
  }

  return result;
};

const getAllSemesters = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Searching (partial search)
  if (searchTerm) {
    andConditions.push({
      OR: academicSemesterSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  //Filtering (exact match)
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: { equals: value },
      })),
    });
  }

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.academicSemester.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: result,
  };
};

const getAcademicSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAcademicSemester = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester> => {
  // Check academic semester wise code
  if (
    payload.title &&
    academicSemesterTitleCodeMapper[payload.title] !== payload.code
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid semester code!');
  }

  // Check academic semester start month
  if (
    payload.title &&
    academicSemesterTitlesStartMonth[payload.title] !== payload.startMonth
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid start month!');
  }

  // Check academic semester end month
  if (
    payload.title &&
    academicSemesterTitlesEndMonth[payload.title] !== payload.endMonth
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid end month!');
  }

  const result = await prisma.academicSemester.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_UPDATED,
      JSON.stringify(result)
    );
  }

  return result;
};

const deleteAcademicSemester = async (
  id: string
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
    where: {
      id,
    },
  });

  if (result) {
    RedisClient.publish(
      EVENT_ACADEMIC_SEMESTER_DELETED,
      JSON.stringify(result)
    );
  }

  return result;
};

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllSemesters,
  getAcademicSemester,
  updateAcademicSemester,
  deleteAcademicSemester,
};
