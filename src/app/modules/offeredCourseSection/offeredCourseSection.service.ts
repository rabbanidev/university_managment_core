import { OfferedCourseSection, Prisma } from '@prisma/client';
import {
  IClassSchedule,
  IOfferedCourseSectionCreate,
  IOfferedCourseSectionFilters,
} from './offeredCourseSection.interface';
import prisma from '../../../shared/prisma';
import { getOfferedCourse } from './offeredCourseSection.utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import {
  offeredCourseSectionRelationalFields,
  offeredCourseSectionRelationalFieldsMapper,
  offeredCourseSectionSearchableFields,
} from './offeredCourseSection.constant';
import { GlobalUtils } from '../../../shared/utils';
import { OferedCourseClassScheduleUtils } from '../offeredCourseClassSchedule/offeredCourseClassSchedule.utils';

const createOfferedCourseSection = async (
  data: IOfferedCourseSectionCreate
): Promise<OfferedCourseSection | null> => {
  const { classSchedules, ...payload } = data;

  const offeredCourse = await getOfferedCourse(payload.offeredCourseId);

  if (!offeredCourse) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Offered Course not found!');
  }

  // Check existing offered course section
  const exitOfferedCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      offeredCourse: {
        id: payload.offeredCourseId,
      },
      title: payload.title,
    },
  });

  if (exitOfferedCourseSection) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered course section already exists!'
    );
  }

  // Check offered course class schedule
  GlobalUtils.asyncForEach(classSchedules, async (schedule: any) => {
    await OferedCourseClassScheduleUtils.hasFacultyAvailable(schedule);
    await OferedCourseClassScheduleUtils.hasRoomAvailable(schedule);
  });

  const createOfferedSection = await prisma.$transaction(
    async (transactionClient) => {
      // Create offered course section
      const createdOfferedCourseSection =
        await transactionClient.offeredCourseSection.create({
          data: {
            ...payload,
            semesterRegistrationId: offeredCourse.semesterRegistrationId,
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

      // Offered course class schedule make data
      const tempClassSchedules = classSchedules.map(
        (schedule: IClassSchedule) => ({
          ...schedule,
          offeredCourseSectionId: createdOfferedCourseSection.id,
          semesterRegistrationId:
            createdOfferedCourseSection.semesterRegistrationId,
        })
      );

      await transactionClient.offeredCourseClassSchedule.createMany({
        data: tempClassSchedules,
      });

      return createdOfferedCourseSection;
    }
  );

  const result = await prisma.offeredCourseSection.findFirst({
    where: {
      id: createOfferedSection.id,
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
          faculty: true,
        },
      },
    },
  });

  return result;
};

const getAllOfferedCourseSections = async (
  filters: IOfferedCourseSectionFilters,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  const { limit, page, skip, sortConditions } =
    paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseSectionSearchableFields.map((field) => ({
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
        if (offeredCourseSectionRelationalFields.includes(key)) {
          return {
            [offeredCourseSectionRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseSectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseSection.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
  });
  const total = await prisma.offeredCourseSection.count({
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
  getAllOfferedCourseSections,
  getOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
