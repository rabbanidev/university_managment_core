/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '../../../shared/prisma';
import { Student, Prisma, StudentEnrolledCourseStatus } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IStudentCourseFilters, IStudentFilters } from './student.interface';
import {
  studentRelationalFields,
  studentRelationalFieldsMapper,
  studentSearchableFields,
} from './student.constant';
import { StudentUtils } from './student.utils';

const createStudent = async (payload: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  // Searching (partial search)
  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  //Filtering (exact match)
  if (Object.keys(filtersData).length) {
    andConditions.push({
      AND: Object.entries(filtersData).map(([field, value]) => {
        if (studentRelationalFields.includes(field)) {
          return {
            [studentRelationalFieldsMapper[field]]: {
              id: (filtersData as any)[field],
            },
          };
        } else {
          return {
            [field]: { equals: value },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // Pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  const total = await prisma.student.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      limit,
      page,
    },
    data: result,
  };
};

const getStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  return result;
};

const updateStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student> => {
  const result = await prisma.student.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  return result;
};

const deleteStudent = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });

  return result;
};

const getMyCourses = async (
  authUserId: string,
  filters: IStudentCourseFilters
) => {
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filters.academicSemesterId = currentAcademicSemester?.id;
  }

  const result = prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      ...filters,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const getMyCourseSchedules = async (
  authUserId: string,
  filters: IStudentCourseFilters
) => {
  if (!filters.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filters.academicSemesterId = currentAcademicSemester?.id;
  }

  const studentEnrolledCourses = await getMyCourses(authUserId, filters);

  const studentEnrolledCourseIds = studentEnrolledCourses.map(
    (course) => course.courseId
  );

  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      semesterRegistration: {
        academicSemester: {
          id: filters.academicSemesterId,
        },
      },
      offeredCourse: {
        course: {
          id: {
            in: studentEnrolledCourseIds,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
              faculty: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const getMyAcademicInfo = async (authUserId: string) => {
  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        studentId: authUserId,
      },
    },
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
      academicSemester: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const groupByAcademicSemesterData =
    StudentUtils.groupByAcademicSemester(enrolledCourses);

  return {
    academicInfo: studentAcademicInfo,
    courses: groupByAcademicSemesterData,
  };
};

const createStudentFromEvent = async (e: any): Promise<void> => {
  const studentData: Partial<Student> = {
    studentId: e.id,
    firstName: e.name.firstName,
    lastName: e.name.lastName,
    middleName: e.name.middleName,
    email: e.email,
    contactNo: e.contactNo,
    gender: e.gender,
    bloodGroup: e.bloodGroup,
    academicSemesterId: e.academicSemester.syncId,
    academicDepartmentId: e.academicDepartment.syncId,
    academicFacultyId: e.academicFaculty.syncId,
  };

  await createStudent(studentData as Student);
};

const updateStudentFromEvent = async (e: any): Promise<void> => {
  const isExist = await prisma.student.findFirst({
    where: {
      studentId: e.id,
    },
  });

  if (!isExist) {
    await createStudentFromEvent(e);
    return;
  } else {
    const student: Partial<Student> = {
      studentId: e.id,
      firstName: e.name.firstName,
      lastName: e.name.lastName,
      middleName: e.name.middleName,
      profileImage: e.profileImage,
      email: e.email,
      contactNo: e.contactNo,
      gender: e.gender,
      bloodGroup: e.bloodGroup,
      academicDepartmentId: e.academicDepartment.syncId,
      academicFacultyId: e.academicFaculty.syncId,
      academicSemesterId: e.academicSemester.syncId,
    };
    await prisma.student.updateMany({
      where: {
        studentId: e.id,
      },
      data: student as Student,
    });
  }
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getMyCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
  createStudentFromEvent,
  updateStudentFromEvent,
};
