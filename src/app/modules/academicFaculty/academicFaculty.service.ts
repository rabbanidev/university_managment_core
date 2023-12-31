import { AcademicFaculty, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IAcademicFacultyFilters } from './academicFaculty.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import {
  EVENT_ACADEMIC_FACULTY_CREATED,
  EVENT_ACADEMIC_FACULTY_DELETED,
  EVENT_ACADEMIC_FACULTY_UPDATED,
  academicFacultySearchableFields,
} from './academicFaculty.constant';
import { RedisClient } from '../../../shared/redis';

const createAcademicFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });

  if (result) {
    RedisClient.publish(EVENT_ACADEMIC_FACULTY_CREATED, JSON.stringify(result));
  }

  return result;
};

const getAllAcademicFaculties = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  // Searching (Partial search)
  if (searchTerm) {
    andConditions.push({
      OR: academicFacultySearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  // Filtering (Exact match)
  if (Object.keys(filterData).length) {
    andConditions.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: { equals: value },
      })),
    });
  }

  const whereCondition: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.academicFaculty.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.academicFaculty.count({
    where: whereCondition,
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

const getAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.update({
    where: {
      id,
    },
    data: payload,
  });

  if (result) {
    RedisClient.publish(EVENT_ACADEMIC_FACULTY_UPDATED, JSON.stringify(result));
  }

  return result;
};

const deleteAcademicFaculty = async (id: string): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.delete({
    where: {
      id,
    },
  });

  if (result) {
    RedisClient.publish(EVENT_ACADEMIC_FACULTY_DELETED, JSON.stringify(result));
  }

  return result;
};

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getAcademicFaculty,
  updateAcademicFaculty,
  deleteAcademicFaculty,
};
