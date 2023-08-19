import { PrismaClient, AcademicSemester } from '@prisma/client';

const prisma = new PrismaClient();

const createAcademicSemester = async (
  payload: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({
    data: payload,
  });
  return result;
};

export const AcademicSemesterService = {
  createAcademicSemester,
};
