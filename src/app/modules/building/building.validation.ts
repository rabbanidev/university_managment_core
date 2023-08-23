import { z } from 'zod';

const createBuildingZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required!',
    }),
  }),
});

export const BuildingValidation = {
  createBuildingZodSchema,
};
