import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { Course, StudentEnrolledCourse } from '@prisma/client';

const getGradeFromMarks = (marks: number): { grade: string; point: number } => {
  if (marks < 0 || marks > 100) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid marks!');
  }

  let result = {
    grade: '',
    point: 0,
  };
  if (marks >= 0 && marks <= 39) {
    result = {
      grade: 'F',
      point: 0,
    };
  } else if (marks >= 40 && marks <= 49) {
    result = {
      grade: 'D',
      point: 2.0,
    };
  } else if (marks >= 50 && marks <= 59) {
    result = {
      grade: 'C',
      point: 2.5,
    };
  } else if (marks >= 60 && marks <= 69) {
    result = {
      grade: 'B',
      point: 3.0,
    };
  } else if (marks >= 70 && marks <= 79) {
    result = {
      grade: 'A',
      point: 3.5,
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'A+',
      point: 4.0,
    };
  }

  return result;
};

const calcCGPAandGrade = (
  payload: (StudentEnrolledCourse & { course: Course })[]
): { totalCompletedCredit: number; cgpa: number } => {
  if (payload.length === 0) {
    return {
      totalCompletedCredit: 0,
      cgpa: 0,
    };
  }

  let totalCredits = 0;
  let totalCGPA = 0;
  for (const grade of payload) {
    totalCredits += grade.course.credits || 0;
    totalCGPA += grade.point || 0;
  }

  const avgCGPA = Number((totalCGPA / payload.length).toFixed(2));

  return {
    totalCompletedCredit: totalCredits,
    cgpa: avgCGPA,
  };
};

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMarks,
  calcCGPAandGrade,
};
