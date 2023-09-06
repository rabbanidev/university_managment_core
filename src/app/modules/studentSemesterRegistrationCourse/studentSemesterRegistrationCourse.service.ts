import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IEnrollIntoCourse } from '../semesterRegistration/semesterRegistration.interface';
import { SemesterRegistrationUtils } from '../semesterRegistration/semesterRegistration.utils';
import prisma from '../../../shared/prisma';

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollIntoCourse
): Promise<{ message: string }> => {
  const student = await SemesterRegistrationUtils.getStudentInfo(authUserId);
  const semesterRegistraction =
    await SemesterRegistrationUtils.getSemesterRegistration();

  const offeredCourse = await SemesterRegistrationUtils.getOfferedCourse(
    payload.offeredCourseId
  );

  const offeredCourseSection =
    await SemesterRegistrationUtils.getOfferedCourseSection(
      payload.offeredCourseSectionId
    );

  if (
    offeredCourseSection?.currentlyEnrolledStudent >=
    offeredCourseSection?.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student capacity is full!');
  }

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistraction?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semetsterRegistration: {
          id: semesterRegistraction.id,
        },
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.credits,
        },
      },
    });
  });

  return {
    message: 'Student enrollment successfully!',
  };
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollIntoCourse
): Promise<{ message: string }> => {
  const student = await SemesterRegistrationUtils.getStudentInfo(authUserId);
  const semesterRegistraction =
    await SemesterRegistrationUtils.getSemesterRegistration();

  const offeredCourse = await SemesterRegistrationUtils.getOfferedCourse(
    payload.offeredCourseId
  );

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          studentId: student?.id,
          semesterRegistrationId: semesterRegistraction?.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    await transactionClient.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    await transactionClient.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semetsterRegistration: {
          id: semesterRegistraction.id,
        },
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.credits,
        },
      },
    });
  });

  return {
    message: 'Successfully withdraw from course!',
  };
};

export const StudentSemesterRegistrationCourseService = {
  enrollIntoCourse,
  withdrawFromCourse,
};
