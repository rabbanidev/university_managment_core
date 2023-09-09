import {
  Prisma,
  SemesterRegistration,
  SemeterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { IPaginationOptions } from '../../../interfaces/pagination';
import {
  IEnrollIntoCourse,
  ISemesterRegistrationFilters,
} from './semesterRegistration.interface';
import {
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
  semesterRegistrationSearchableFields,
} from './semesterRegistration.constant';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';

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

const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Searchterm implementation
  if (searchTerm) {
    andConditions.push({
      OR: semesterRegistrationSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Filters implementation
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        if (semesterRegistrationRelationalFields.includes(field)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[field]]: {
              id: (filtersData as any)[field],
            },
          };
        } else {
          return {
            [field]: {
              equals: value,
            },
          };
        }
      }),
    });
  }

  const whereCondition: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.semesterRegistration.findMany({
    where: whereCondition,
    skip,
    take: limit,
    include: {
      academicSemester: true,
    },
    orderBy: sortConditions,
  });

  const total = await prisma.semesterRegistration.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const updateSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  const isExit = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Data not found!');
  }

  // UPCOMING ===> ONGOING ===> ENEDED (One step forward)
  if (
    payload.status &&
    isExit.status === SemeterRegistrationStatus.UPCOMING &&
    payload.status !== SemeterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from UPCOMING TO ONGOING!'
    );
  }

  if (
    payload.status &&
    isExit.status === SemeterRegistrationStatus.ONGOING &&
    payload.status !== SemeterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from ONGOING TO ENDED!'
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  // Get student information
  const studentInfo = await SemesterRegistrationUtils.getStudentInfo(
    authUserId
  );

  // Get semester registration information
  const semesterRegistrationInfo =
    await SemesterRegistrationUtils.getSemesterRegistratioInfo();

  let result = null;

  // Already registered
  result = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semetsterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  // Crreate a new semester registration
  if (!result) {
    result = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semetsterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: result,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollIntoCourse
): Promise<{ message: string }> => {
  return StudentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload
  );
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollIntoCourse
): Promise<{ message: string }> => {
  return StudentSemesterRegistrationCourseService.withdrawFromCourse(
    authUserId,
    payload
  );
};

const confirmMyRegistration = async (
  authUserId: string
): Promise<{ message: string }> => {
  const semesterRegistration =
    await SemesterRegistrationUtils.getSemesterRegistration();

  const studentSemesterRegistration =
    await SemesterRegistrationUtils.studentSemesterRegistration(
      authUserId,
      semesterRegistration
    );

  if (studentSemesterRegistration.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `you are not enroll in any course`
    );
  }

  if (
    (studentSemesterRegistration.totalCreditsTaken &&
      semesterRegistration.minCredit &&
      semesterRegistration.maxCredit &&
      studentSemesterRegistration.totalCreditsTaken <
        semesterRegistration.minCredit) ||
    studentSemesterRegistration.totalCreditsTaken >
      semesterRegistration.maxCredit
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistration.minCredit} to  ${semesterRegistration.maxCredit}credits`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  return {
    message: 'Your registration confirmed successfully!',
  };
};

const getMyRegistration = async (authUserId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemeterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semetsterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });

  return { semesterRegistration, studentSemesterRegistration };
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
};
