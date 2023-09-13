import {
  Course,
  ExamType,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import {
  IStudentEnrolledCourseMarkFilterRequest,
  IUpdateStudentCourseFinalMarksPayload,
  IUpdateStudentMarksPayload,
} from './studentEnrolledCourseMark.interface';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import prisma from '../../../shared/prisma';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.utils';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
) => {
  const isExitMidtermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExitMidtermData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERM,
      },
    });
  }

  const isExiFinaltermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  if (!isExiFinaltermData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.FINAL,
      },
    });
  }
};

const getAllStudentEnrolledCourseMarks = async (
  filters: IStudentEnrolledCourseMarkFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } = paginationHelpers.calculatePagination(options);

  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: filters.studentId,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
      student: true,
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

const updateStudentMarks = async (
  payload: IUpdateStudentMarksPayload
): Promise<StudentEnrolledCourseMark> => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const exitStudentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType: examType,
      },
    });

  if (!exitStudentEnrolledCourseMark) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student enrolled course mark not found!'
    );
  }

  const result = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);

  const updatedStudentEnrolledCourseMark =
    await prisma.studentEnrolledCourseMark.update({
      where: {
        id: exitStudentEnrolledCourseMark.id,
      },
      data: {
        marks,
        grade: result.grade,
      },
    });

  return updatedStudentEnrolledCourseMark;
};

const updateStudentFinalMarks = async (
  payload: IUpdateStudentCourseFinalMarksPayload
): Promise<(StudentEnrolledCourse & { course: Course })[]> => {
  const { studentId, academicSemesterId, courseId } = payload;

  // Check exit student enroll course
  const exitStudentEnrolledCourse =
    await prisma.studentEnrolledCourse.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        course: {
          id: courseId,
        },
      },
    });

  if (!exitStudentEnrolledCourse) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student enrolled course data not found!'
    );
  }

  // Get exit student enrolled course wise data or midtern and final term data
  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });

  if (!studentEnrolledCourseMarks.length) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student enrolled course mark not found!'
    );
  }

  // Find only midterm marks
  const midTermMark =
    studentEnrolledCourseMarks.find(
      (item) => item.examType === ExamType.MIDTERM
    )?.marks || 0;

  // Find only final marks
  const finalTermMark =
    studentEnrolledCourseMarks.find((item) => item.examType === ExamType.FINAL)
      ?.marks || 0;

  // Calculate total final marks
  const totalFinalMarks =
    Math.ceil(midTermMark * 0.4) + Math.ceil(finalTermMark * 0.6);

  const result =
    StudentEnrolledCourseMarkUtils.getGradeFromMarks(totalFinalMarks);

  // Update student enrolled course with grade point status and total marks
  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data: {
      grade: result.grade,
      point: result.point,
      totalMarks: totalFinalMarks,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });

  // Get specific student all enrolled completed courses
  const studentEnrolledCompletedCourses =
    await prisma.studentEnrolledCourse.findMany({
      where: {
        student: {
          id: studentId,
        },
        status: StudentEnrolledCourseStatus.COMPLETED,
      },
      include: {
        course: true,
      },
    });

  // Calculate total cgpa and credits
  const studentAcademicInfo = StudentEnrolledCourseMarkUtils.calcCGPAandGrade(
    studentEnrolledCompletedCourses
  );

  const exitStudentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        id: studentId,
      },
    },
  });

  if (exitStudentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: exitStudentAcademicInfo.id,
      },
      data: {
        totalCompletedCredit: studentAcademicInfo.totalCompletedCredit,
        cgpa: studentAcademicInfo.cgpa,
      },
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        totalCompletedCredit: studentAcademicInfo.totalCompletedCredit,
        cgpa: studentAcademicInfo.cgpa,
      },
    });
  }

  return studentEnrolledCompletedCourses;
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  getAllStudentEnrolledCourseMarks,
  updateStudentMarks,
  updateStudentFinalMarks,
};
