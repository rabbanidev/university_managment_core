/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import { Student, Prisma } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IStudentFilters } from './student.interface';
import {
  studentRelationalFields,
  studentRelationalFieldsMapper,
  studentSearchableFields,
} from './student.constant';

const createStudent = async (payload: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Searching (partial search)
  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  //Filtering (exact match)
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        if (studentRelationalFields.includes(field)) {
          return {
            [studentRelationalFieldsMapper[field]]: {
              id: (filtersData as any)[field],
            },
          };
        } else {
          return {
            [field]: { equals: value },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  const total = await prisma.student.count({
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

const getStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  return result;
};

const deleteStudent = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  return result;
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
};
