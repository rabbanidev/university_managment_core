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
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string({
            required_error: 'Course ID is required',
          }),
          isDeleted: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

const updateCourseZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string().optional(),
          isDeleted: z.boolean().optional(),
        })
      )
      .optional(),
  }),
});

export const CourseValidation = {
  createCourseZodSchema,
  updateCourseZodSchema,
};
