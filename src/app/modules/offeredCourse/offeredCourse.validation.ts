import { z } from 'zod';

const createOfferedCourseZodSchema = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic department Id required!',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester registration Id is required!',
    }),
    courseIds: z.array(z.string({ required_error: 'Course Id is required!' }), {
      required_error: 'Course ids are required!',
    }),
  }),
});

export const OfferedCourseValidation = {
  createOfferedCourseZodSchema,
};
