export type IStudentFilters = {
  searchTerm?: string;
  academicFacultyId?: string;
  academicDepartmentId?: string;
  academicSemesterId?: string;
  studentId?: string;
  email?: string;
  contactNo?: string;
  gender?: string;
  bloodGroup?: string;
};

export type IStudentCourseFilters = {
  courseId?: string | undefined;
  academicSemesterId?: string | undefined;
};
