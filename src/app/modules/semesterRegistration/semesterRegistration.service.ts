import {
  SemesterRegistration,
  SemeterRegistrationStatus,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createSemesterRegistration = async (
  payload: SemesterRegistration
): Promise<SemesterRegistration> => {
  const runningSemeterterRegistration =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          { status: SemeterRegistrationStatus.UPCOMING },
          { status: SemeterRegistrationStatus.ONGOING },
        ],
      },
    });

  if (runningSemeterterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Already Semeterter registration ${runningSemeterterRegistration.status}`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data: payload,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
};
