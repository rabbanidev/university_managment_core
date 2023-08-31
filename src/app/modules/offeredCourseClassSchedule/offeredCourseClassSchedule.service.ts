import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { OferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

const createOfferedCourseClassSchedule = async (
  payload: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  await OferedCourseClassScheduleUtils.hasRoomAvailable(payload);

  const result = await prisma.offeredCourseClassSchedule.create({
    data: payload,
    include: {
      faculty: true,
      offeredCourseSection: true,
      room: true,
      semesterRegistration: true,
    },
  });

  return result;
};

export const OfferedCourseClassScheduleService = {
  createOfferedCourseClassSchedule,
};
