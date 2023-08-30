export type IOfferedCourseSection = {
  title: string;
  maxCapacity: number;
  offeredCourseId: string;
  semesterRegistrationId: string;
  currentlyEnrolledStudent: number;
};

export type IOfferedCourseSectionFilters = {
  searchTerm?: string | undefined;
  offeredCourseId?: string | undefined;
};
