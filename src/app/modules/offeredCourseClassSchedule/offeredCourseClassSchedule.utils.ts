import { OfferedCourseClassSchedule } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const hasTimeConflict = (
  exitClassSchedules: {
    startTime: string;
    endTime: string;
  }[],
  newClassSchedule: {
    startTime: string;
    endTime: string;
  }
) => {
  for (const schedule of exitClassSchedules) {
    const exitingStart = new Date(`1970-01-01T${schedule.startTime}:00`);
    const exitingEnd = new Date(`1970-01-01T${schedule.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newClassSchedule.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newClassSchedule.endTime}:00`);

    if (newStart < exitingEnd && newEnd > exitingStart) {
      return true;
    }
  }

  return false;
};

const hasRoomAvailable = async (payload: OfferedCourseClassSchedule) => {
  const exitClassSchedules = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: payload.dayOfWeek,
      room: {
        id: payload.roomId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  if (hasTimeConflict(exitClassSchedules, payload)) {
    throw new ApiError(httpStatus.CONFLICT, 'Already room booked!');
  }
};

const hasFacultyAvailable = async (payload: OfferedCourseClassSchedule) => {
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

  if (hasTimeConflict(exitClassSchedules, payload)) {
    throw new ApiError(httpStatus.CONFLICT, 'Already faculty booked!');
  }
};

export const OferedCourseClassScheduleUtils = {
  hasRoomAvailable,
  hasFacultyAvailable,
};
