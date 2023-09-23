import { OfferedCourseClassSchedule, WeekDays } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const hasTimeConflict = (
  existingSlots: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }[],
  newSlot: {
    startTime: string;
    endTime: string;
    dayOfWeek: WeekDays;
  }
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }
  return false;
};

const checkRoomAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyBookedRoomOnDay =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        room: {
          id: data.roomId,
        },
      },
    });

  const existingSlots = alreadyBookedRoomOnDay.map((schedule) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  const isConflict = hasTimeConflict(existingSlots, newSlot);

  if (isConflict) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Room is already booked!');
    // throw new ApiError(httpStatus.CONFLICT, 'Room is already booked!');
  }
};

const checkFacultyAvailable = async (data: OfferedCourseClassSchedule) => {
  const alreadyFcultyAssigned =
    await prisma.offeredCourseClassSchedule.findMany({
      where: {
        dayOfWeek: data.dayOfWeek,
        faculty: {
          id: data.facultyId,
        },
      },
    });

  const existingSlots = alreadyFcultyAssigned.map((schedule) => ({
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    dayOfWeek: schedule.dayOfWeek,
  }));

  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  const isConflict = hasTimeConflict(existingSlots, newSlot);

  if (isConflict) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Faculty is already booked!');
  }
};
export const OferedCourseClassScheduleUtils = {
  checkRoomAvailable,
  checkFacultyAvailable,
};
