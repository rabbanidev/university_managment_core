import prisma from '../../../shared/prisma';
import { OfferedCourse } from '@prisma/client';

export const getOfferedCourse = async (
  offeredCourseId: string
): Promise<OfferedCourse | null> => {
  const offeredCourse = await prisma.offeredCourse.findUnique({
    where: {
      id: offeredCourseId,
    },
  });

  return offeredCourse;
};
