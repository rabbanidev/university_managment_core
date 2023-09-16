export type IFacultyFilters = {
  searchTerm?: string;
  academicFacultyId?: string;
  academicDepartmentId?: string;
  facultyId?: string;
  email?: string;
  contactNo?: string;
  designation?: string;
  gender?: string;
  bloodGroup?: string;
};

export type IMyCoursesPayload = {
  academicSemesterId?: string | undefined | null;
  courseId?: string | undefined | null;
};
