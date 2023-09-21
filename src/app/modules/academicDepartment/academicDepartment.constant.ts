export const academicDepartmentFilterableFields: string[] = [
  'searchTerm',
  'title',
  'id',
  'academicFacultyId',
];

export const academicDepartmentSearchableFields: string[] = ['title'];

export const academicDepartmentRelationalFields: string[] = [
  'academicFacultyId',
];

export const academicDepartmentRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicFacultyId: 'academicFaculty',
};

export const EVENT_ACADEMIC_DEPARTMENT_CREATED = 'academic_department.created';
export const EVENT_ACADEMIC_DEPARTMENT_UPDATED = 'academic_department.updated';
export const EVENT_ACADEMIC_DEPARTMENT_DELETED = 'academic_department.deleted';
