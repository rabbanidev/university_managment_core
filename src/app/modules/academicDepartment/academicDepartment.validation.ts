import { z } from 'zod';

const createAcademicDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required!',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic Faculty is required!',
    }),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentZodSchema,
};
