/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IStudentEnrolledCourseFilterRequest } from './studentEnrolledCourse.interface';
import {
  studentEnrolledCourseRelationalFields,
  studentEnrolledCourseRelationalFieldsMapper,
  studentEnrolledCourseSearchableFields,
} from './studentEnrolledCourse.constant';

const createStudentEnrolledCourse = async (
  data: StudentEnrolledCourse
): Promise<StudentEnrolledCourse> => {
  // Use Prisma to find the first record in the 'studentEnrolledCourse' table that matches certain conditions.
  const isCourseOngoingOrCompleted =
    await prisma.studentEnrolledCourse.findFirst({
      where: {
        OR: [
          // Check if the 'status' property of the record is equal to 'ONGOING'.
          {
            status: StudentEnrolledCourseStatus.ONGOING,
          },
          // Check if the 'status' property of the record is equal to 'COMPLETED'.
          {
            status: StudentEnrolledCourseStatus.COMPLETED,
          },
        ],
      },
    });

  // If there is a course that is ongoing or completed, throw an error with a specific message.
  if (isCourseOngoingOrCompleted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isCourseOngoingOrCompleted.status?.toLowerCase()} registration`
    );
  }

  // Use Prisma to create a new record in the 'studentEnrolledCourse' table with the provided 'data'.
  // Include related data from the 'academicSemester', 'student', and 'course' tables in the result.
  const result = await prisma.studentEnrolledCourse.create({
    data,
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });

  return result;
};

const getAllStudentEnrolledCourses = async (
  filters: IStudentEnrolledCourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourse[]>> => {
  const { limit, page, skip, sortConditions } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  if (!filtersData.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (currentAcademicSemester) {
      filtersData.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: studentEnrolledCourseSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map((key) => {
        if (studentEnrolledCourseRelationalFields.includes(key)) {
          return {
            [studentEnrolledCourseRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.StudentEnrolledCourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.studentEnrolledCourse.findMany({
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  const total = await prisma.studentEnrolledCourse.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse | null> => {
  const result = await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
  return result;
};

const updateStudentEnrolledCourse = async (
  id: string,
  payload: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
  return result;
};

const deleteStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse> => {
  const result = await prisma.studentEnrolledCourse.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
  return result;
};

export const StudentEnrolledCourseService = {
  createStudentEnrolledCourse,
  getAllStudentEnrolledCourses,
  getStudentEnrolledCourse,
  updateStudentEnrolledCourse,
  deleteStudentEnrolledCourse,
};
