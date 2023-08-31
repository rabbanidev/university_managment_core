import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const hasRoomAvailable = async (payload: OfferedCourseClassSchedule) => {
  const exitClassSchedules = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: payload.dayOfWeek,
      faculty: {
        id: payload.facultyId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  //   Check time format
  for (const schedule of exitClassSchedules) {
    const exitingStart = new Date(`1970-01-01T${schedule.startTime}:00`);
    const exitingEnd = new Date(`1970-01-01T${schedule.endTime}:00`);
    const newStart = new Date(`1970-01-01T${payload.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${payload.endTime}:00`);

    if (newStart < exitingEnd && newEnd > exitingStart) {
      throw new ApiError(httpStatus.CONFLICT, 'Already room booked!');
    }
  }
};

export const OferedCourseClassScheduleUtils = {
  hasRoomAvailable,
};
