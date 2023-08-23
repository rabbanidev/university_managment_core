import prisma from '../../../shared/prisma';

const createCourse = async (payload: any): Promise<any> => {
  const result = await prisma.course.create({
    data: payload,
  });

  return result;
};

export const CourseService = {
  createCourse,
};
