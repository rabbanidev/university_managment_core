/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  OfferedCourse,
  OfferedCourseSection,
  SemesterRegistration,
  SemeterRegistrationStatus,
  Student,
  StudentEnrolledCourse,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
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
    throw new ApiError(httpStatus.NOT_FOUND, 'Student info not found!');
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
        httpStatus.NOT_FOUND,
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

const getSemesterRegistration = async (): Promise<SemesterRegistration> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemeterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!'
    );
  }

  return semesterRegistration;
};

const getOfferedCourse = async (offeredCourseId: string) => {
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }
  return offeredCourse;
};

const getOfferedCourseSection = async (
  offeredCourseSectionId: string
): Promise<OfferedCourseSection> => {
  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: offeredCourseSectionId,
    },
  });

  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Offered course section not found!'
    );
  }
  return offeredCourseSection;
};

const exitStudentEnrollment = async (
  semesterRegistrationId: string,
  studentId: string,
  offeredCourseId: string,
  offeredCourseSectionId: string
): Promise<void> => {
  const exitEnrollment =
    await prisma.studentSemesterRegistrationCourse.findFirst({
      where: {
        semesterRegistrationId,
        studentId,
        offeredCourseId,
        offeredCourseSectionId,
      },
    });

  if (exitEnrollment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Already enrollment done!');
  }
};

const studentSemesterRegistration = async (
  authUserId: string,
  semesterRegistration: SemesterRegistration
): Promise<StudentSemesterRegistration> => {
  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semetsterRegistration: {
          id: semesterRegistration.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your are not recoginized for semester!'
    );
  }

  return studentSemesterRegistration;
};

const getAvailableCourses = (
  offeredCourses: OfferedCourse[],
  studentCompletedCourses: StudentEnrolledCourse[],
  studentCurrentlyTakanCourses: StudentSemesterRegistrationCourse[]
) => {
  const completedCoursesId = studentCompletedCourses.map(
    (course: any) => course.courseId
  );

  const availableCoursesList = offeredCourses
    .filter(
      (offeredCourse: any) =>
        !completedCoursesId.includes(offeredCourse.courseId)
    )
    .filter((course: any) => {
      const preRequisites = course.course.preRequisite;
      if (preRequisites.length === 0) {
        return true;
      } else {
        const preRequisiteIds = preRequisites.map(
          (preRequisite: any) => preRequisite.preRequisiteId
        );
        return preRequisiteIds.every((id: string) =>
          completedCoursesId.includes(id)
        );
      }
    })
    .map((course: any) => {
      const isAlreadyTakenCourse = studentCurrentlyTakanCourses.find(
        (c: any) => c.offeredCourseId === course.id
      );

      if (isAlreadyTakenCourse) {
        course.offeredCourseSections.map((section: any) => {
          if (section.id === isAlreadyTakenCourse.offeredCourseSectionId) {
            section.isTaken = true;
          } else {
            section.isTaken = false;
          }
        });
        return {
          ...course,
          isTaken: true,
        };
      } else {
        course.offeredCourseSections.map((section: any) => {
          section.isTaken = false;
        });
        return {
          ...course,
          isTaken: false,
        };
      }
    });

  return availableCoursesList;
};

export const SemesterRegistrationUtils = {
  getStudentInfo,
  getSemesterRegistratioInfo,
  getSemesterRegistration,
  getOfferedCourse,
  getOfferedCourseSection,
  exitStudentEnrollment,
  studentSemesterRegistration,
  getAvailableCourses,
};
