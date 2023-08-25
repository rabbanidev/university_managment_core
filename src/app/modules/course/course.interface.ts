export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
    isDeleted?: boolean;
  }[];
};

export type ICourseFilters = {
  searchTerm?: string;
};
