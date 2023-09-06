import { SemeterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const createSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string({
      required_error: 'End date is required',
    }),
    minCredit: z.number({
      required_error: 'Min credit is required',
    }),
    maxCredit: z.number({
      required_error: 'Max credit is required',
    }),
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required',
    }),
    status: z
      .enum(
        [...Object.values(SemeterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
  }),
});

const updateSemesterRegistrationZodSchema = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
    status: z
      .enum(
        [...Object.values(SemeterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
  }),
});

const enrollOrWithdrawZodSchema = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: 'Offered course id is required!',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered course section id is required!',
    }),
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
  updateSemesterRegistrationZodSchema,
  enrollOrWithdrawZodSchema,
};
