import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import {
  ICourseCreateData,
  ICourseFilters,
  IPreRequisiteCourse,
} from './course.interface';
import { courseSearchableFields } from './course.constant';
import { Course, Prisma } from '@prisma/client';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { GlobalUtils } from '../../../shared/utils';

const createCourse = async (
  payload: ICourseCreateData
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;

  const createdCourse = await prisma.$transaction(async (tx) => {
    // create a new course
    const result = await tx.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course!');
    }

    // created are pre requisities courses
    // if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    //   for (let i = 0; i < preRequisiteCourses.length; i++) {
    //     await tx.courseToPrerequisite.create({
    //       data: {
    //         courseId: result.id,
    //         prerequisiteId: preRequisiteCourses[i].courseId,
    //       },
    //     });
    //   }
    // }

    // created are pre requisities courses (another way)
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await GlobalUtils.asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPreRequisiteCourse) => {
          await tx.courseToPrerequisite.create({
            data: {
              courseId: result.id,
              prerequisiteId: preRequisiteCourse.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  if (createdCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: createdCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course!');
};

const getCourses = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: courseSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          equals: value,
        },
      })),
    });
  }

  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.course.findMany({
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  // Total documents
  const total = await prisma.course.count({
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

const getCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return result;
};

const updateCourse = async (
  id: string,
  payload: ICourseCreateData
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;

  const updatedCourse = await prisma.$transaction(async (tx) => {
    const result = await tx.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course!');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrereqisiteCourses = preRequisiteCourses.filter(
        (preRequisiteCourse) =>
          preRequisiteCourse.courseId && preRequisiteCourse.isDeleted
      );

      const newPrereqisiteCourses = preRequisiteCourses.filter(
        (preRequisiteCourse) =>
          preRequisiteCourse.courseId && !preRequisiteCourse.isDeleted
      );

      // Delete prerequisites courses
      // for (let i = 0; i < deletePrereqisiteCourses.length; i++) {
      //   await tx.courseToPrerequisite.deleteMany({
      //     where: {
      //       AND: [
      //         {
      //           courseId: id,
      //         },
      //         {
      //           prerequisiteId: deletePrereqisiteCourses[i].courseId,
      //         },
      //       ],
      //     },
      //   });
      // }

      // Delete prerequisites courses (Another way)
      await GlobalUtils.asyncForEach(
        deletePrereqisiteCourses,
        async (deletePrereqisiteCourse: IPreRequisiteCourse) => {
          await tx.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  prerequisiteId: deletePrereqisiteCourse.courseId,
                },
              ],
            },
          });
        }
      );

      // Add new prerequisite courses
      // for (let i = 0; i < newPrereqisiteCourses.length; i++) {
      //   await tx.courseToPrerequisite.create({
      //     data: {
      //       courseId: id,
      //       prerequisiteId: newPrereqisiteCourses[i].courseId,
      //     },
      //   });
      // }

      // Another way
      await GlobalUtils.asyncForEach(
        newPrereqisiteCourses,
        async (newPrereqisiteCourse: IPreRequisiteCourse) => {
          await tx.courseToPrerequisite.create({
            data: {
              courseId: id,
              prerequisiteId: newPrereqisiteCourse.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  if (updatedCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return responseData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course!');
};

const deleteCourse = async (id: string): Promise<Course> => {
  await prisma.courseToPrerequisite.deleteMany({
    where: {
      OR: [
        {
          courseId: id,
        },
        {
          prerequisiteId: id,
        },
      ],
    },
  });

  const result = await prisma.course.delete({
    where: {
      id,
    },
  });
  return result;
};

export const CourseService = {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
};
