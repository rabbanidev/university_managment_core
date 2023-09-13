import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';

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

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMarks,
};
