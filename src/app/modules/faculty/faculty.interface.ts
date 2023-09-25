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

export type IFacultyMyCourseStudentsRequest = {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
  offeredCourseSectionId?: string | undefined;
};

export type FacultyCreatedEvent = {
  id: string;
  name: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  designation: string;
  email: string;
  contactNo: string;
  profileImage: string;
  academicFaculty: {
    syncId: string;
  };
  academicDepartment: {
    syncId: string;
  };
};
