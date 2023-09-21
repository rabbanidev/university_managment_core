export const academicSemesterSearchableFields = ['title', 'code', 'year'];
export const academicSemesterFilterableFields = [
  'searchTerm',
  'title',
  'code',
  'year',
];

export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterTitlesStartMonth: {
  [key: string]: string;
} = {
  Autumn: 'January',
  Summer: 'May',
  Fall: 'September',
};

export const academicSemesterTitlesEndMonth: {
  [key: string]: string;
} = {
  Autumn: 'April',
  Summer: 'August',
  Fall: 'December',
};

export const EVENT_ACADEMIC_SEMESTER_CREATED = 'academic_semester.created';
export const EVENT_ACADEMIC_SEMESTER_UPDATED = 'academic_semester.updated';
export const EVENT_ACADEMIC_SEMESTER_DELETED = 'academic_semester.deleted';
