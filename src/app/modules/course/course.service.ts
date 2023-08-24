import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { ICourseCreateData } from './course.interface';

const createCourse = async (
  payload: ICourseCreateData
): Promise<ICourseCreateData> => {
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
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      for (let i = 0; i < preRequisiteCourses.length; i++) {
        await tx.courseToPrerequisite.create({
          data: {
            courseId: result.id,
            prerequisiteId: preRequisiteCourses[i].courseId,
          },
        });
      }
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

export const CourseService = {
  createCourse,
};
