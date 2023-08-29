import { OfferedCourse } from '@prisma/client';
import { IOfferedCourse } from './offeredCourse.interface';
import { GlobalUtils } from '../../../shared/utils';
import prisma from '../../../shared/prisma';

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

export const OfferedCourseService = {
  createOfferedCourse,
};
