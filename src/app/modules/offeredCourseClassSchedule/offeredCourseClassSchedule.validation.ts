import { WeekDays } from '@prisma/client';
import { z } from 'zod';

const create = z.object({
  body: z.object({
    startTime: z.string({
      required_error: 'Start time required!',
    }),
    endTime: z.string({
      required_error: 'End time is required!',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered course section Id required!',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester registration Id is required!',
    }),
    roomId: z.string({
      required_error: 'Room Id required!',
    }),
    facultyId: z.string({
      required_error: 'Faculty Id is required!',
    }),
    dayOfWeek: z.enum([...Object.values(WeekDays)] as [string, ...string[]], {
      required_error: 'Day of week is required!',
    }),
  }),
});

const update = z.object({
  body: z.object({
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    offeredCourseSectionId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
    roomId: z.string().optional(),
    facultyId: z.string().optional(),
    dayOfWeek: z
      .enum([...Object.values(WeekDays)] as [string, ...string[]])
      .optional(),
  }),
});

export const OfferedCourseClassScheduleValidation = {
  create,
  update,
};
