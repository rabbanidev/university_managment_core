import { OfferedCourseSection } from '@prisma/client';
import { IOfferedCourseSection } from './offeredCourseSection.interface';
import prisma from '../../../shared/prisma';
import { getOfferedCourse } from './offeredCourseSection.utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createOfferedCourseSection = async (
  payload: IOfferedCourseSection
): Promise<OfferedCourseSection> => {
  const offeredCourse = await getOfferedCourse(payload.offeredCourseId);

  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found!');
  }

  payload.semesterRegistrationId = offeredCourse.semesterRegistrationId;

  const result = await prisma.offeredCourseSection.create({
    data: payload,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });

  return result;
};

const getOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  const result = await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });
  return result;
};

const updateOfferedCourseSection = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  //update
  const result = await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });
  return result;
};

const deleteOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection> => {
  const result = await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      semesterRegistration: true,
    },
  });
  return result;
};

export const OfferedCoursesectionService = {
  createOfferedCourseSection,
  getOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
