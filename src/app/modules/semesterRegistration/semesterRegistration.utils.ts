import {
  SemesterRegistration,
  SemeterRegistrationStatus,
  Student,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const getStudentInfo = async (studentId: string): Promise<Student> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: studentId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student info not found!');
  }
  return studentInfo;
};

const getSemesterRegistratioInfo =
  async (): Promise<SemesterRegistration | null> => {
    const semesterRegistrationInfo =
      await prisma.semesterRegistration.findFirst({
        where: {
          status: {
            in: [
              SemeterRegistrationStatus.ONGOING,
              SemeterRegistrationStatus.UPCOMING,
            ],
          },
        },
      });

    if (!semesterRegistrationInfo) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Semester registration is not found!'
      );
    }

    if (
      semesterRegistrationInfo?.status === SemeterRegistrationStatus.UPCOMING
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Semester registration is not yet!'
      );
    }
    return semesterRegistrationInfo;
  };

export const SemesterRegistrationUtils = {
  getStudentInfo,
  getSemesterRegistratioInfo,
};
