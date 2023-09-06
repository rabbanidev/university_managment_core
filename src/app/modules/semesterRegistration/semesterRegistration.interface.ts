export type ISemesterRegistrationFilters = {
  searchTerm?: string;
  id?: string;
  academicSemesterId?: string;
};

export type IEnrollIntoCourse = {
  offeredCourseId: string;
  offeredCourseSectionId: string;
};
