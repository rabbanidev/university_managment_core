export type IOfferedCourse = {
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseIds: string[];
};

export type IOfferedCourseFilters = {
  searchTerm?: string;
  academicDepartmentId?: string;
  semesterRegistrationId?: string;
  courseId?: string;
};
