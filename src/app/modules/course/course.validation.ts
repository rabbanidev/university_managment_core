import { z } from 'zod';

const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required!',
    }),
    code: z.string({
      required_error: 'Code is required!',
    }),
    credits: z.number().optional(),
  }),
});

export const CourseValidation = {
  createCourseZodSchema,
};