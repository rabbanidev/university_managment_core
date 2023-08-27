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

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodSchema,
};