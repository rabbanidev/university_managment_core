/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  offeredCourseRealtionalFields,
  offeredCourseRelationalFieldsMapper,
  offeredCourseSearchableFields,
} from './offeredCourse.constant';
import { OfferedCourse, Prisma } from '@prisma/client';
import {
  IOfferedCourse,
  IOfferedCourseFilters,
} from './offeredCourse.interface';
import { GlobalUtils } from '../../../shared/utils';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helper/paginationHelpers';

const createOfferedCourse = async (
  payload: IOfferedCourse
): Promise<OfferedCourse[]> => {
  const { academicDepartmentId, semesterRegistrationId, courseIds } = payload;

  const result: OfferedCourse[] = [];

  await GlobalUtils.asyncForEach(courseIds, async (courseId: string) => {
    // Check already registered offered course
    const alreadyExit = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });

    if (!alreadyExit) {
      // Create a new offered course
      const createdOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          academicDepartment: true,
          semesterRegistration: true,
          course: true,
        },
      });

      result.push(createdOfferedCourse);
    }
  });

  return result;
};

const getAllOfferedCourses = async (
  filters: IOfferedCourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andCondition = [];

  // Searching implementation
  if (searchTerm) {
    andCondition.push({
      OR: offeredCourseSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length > 0) {
    andCondition.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        if (offeredCourseRealtionalFields.includes(field)) {
          return {
            [offeredCourseRelationalFieldsMapper[field]]: {
              id: (filtersData as any)[field],
            },
          };
        } else {
          return {
            [field]: {
              equals: value,
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.OfferedCourseWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.offeredCourse.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  // Total documents
  const total = await prisma.offeredCourse.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getOfferedCourse = async (id: string): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  return result;
};

const updateOfferedCourse = async (
  id: string,
  payload: Partial<IOfferedCourse>
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  return result;
};

const deleteOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  const result = await prisma.offeredCourse.delete({
    where: {
      id,
    },
    include: {
      academicDepartment: true,
      semesterRegistration: true,
      course: true,
    },
  });

  return result;
};

export const OfferedCourseService = {
  createOfferedCourse,
  getAllOfferedCourses,
  getOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
