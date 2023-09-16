/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import { CourseFaculty, Faculty, Prisma, Student } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import {
  IFacultyFilters,
  IFacultyMyCourseStudentsRequest,
  IMyCoursesPayload,
} from './faculty.interface';
import {
  facultyRelationalFields,
  facultyRelationalFieldsMapper,
  facultySearchableFields,
} from './faculty.constant';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createFaculty = async (payload: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Searching (partial search)
  if (searchTerm) {
    andConditions.push({
      OR: facultySearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  //Filtering (exact match)
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        if (facultyRelationalFields.includes(field)) {
          return {
            [facultyRelationalFieldsMapper[field]]: {
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

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });

  const total = await prisma.faculty.count({
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

const getFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });

  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty> => {
  const result = await prisma.faculty.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });

  return result;
};

const deleteFaculty = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });

  return result;
};

const assignCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  const assignedCourses = payload.map((courseId) => ({
    facultyId: id,
    courseId: courseId,
  }));
  const assignCourses = await prisma.courseFaculty.createMany({
    data: assignedCourses,
  });

  if (assignCourses.count <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to assign courses!');
  }

  const result = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });

  return result;
};

const removeCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  const removeCourses = await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  if (removeCourses.count <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to remove courses!');
  }

  const result = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
      faculty: true,
    },
  });

  return result;
};

const myCourses = async (authUserId: string, filters: IMyCoursesPayload) => {
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filters.academicSemesterId = currentAcademicSemester?.id;
  }

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUserId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filters.academicSemesterId,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedules = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;

      const exitingCourse = acc.find(
        (item: any) => item.course.id === course.id
      );

      if (exitingCourse) {
        exitingCourse.sections.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: obj,
              classSchedules,
            },
          ],
        });
      }

      return acc;
    },
    []
  );

  return courseAndSchedules;
};

const getMyCourseStudents = async (
  filters: IFacultyMyCourseStudentsRequest,
  options: IPaginationOptions,
  authUserId: string
): Promise<IGenericResponse<Student[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (currentAcademicSemester) {
      filters.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const offeredCourseSections =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        offeredCourse: {
          course: {
            id: filters.courseId,
          },
        },
        offeredCourseSection: {
          offeredCourse: {
            semesterRegistration: {
              academicSemester: {
                id: filters.academicSemesterId,
              },
            },
          },
          id: filters.offeredCourseSectionId,
        },
      },
      include: {
        student: true,
      },
      take: limit,
      skip,
    });

  const students = offeredCourseSections.map(
    (offeredCourseSection) => offeredCourseSection.student
  );

  const total = await prisma.studentSemesterRegistrationCourse.count({
    where: {
      offeredCourse: {
        course: {
          id: filters.courseId,
        },
      },
      offeredCourseSection: {
        offeredCourse: {
          semesterRegistration: {
            academicSemester: {
              id: filters.academicSemesterId,
            },
          },
        },
        id: filters.offeredCourseSectionId,
      },
    },
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: students,
  };
};

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  assignCourses,
  removeCourses,
  myCourses,
  getMyCourseStudents,
};
