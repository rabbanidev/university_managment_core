export type IPreRequisiteCourse = {
  courseId: string;
  isDeleted?: boolean;
};

export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPreRequisiteCourse[];
};

export type ICourseFilters = {
  searchTerm?: string;
};
