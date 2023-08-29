export const offeredCourseFilterableFields: string[] = [
  'searchTerm',
  'id',
  'academicDepartmentId',
  'semesterRegistrationId',
  'courseId',
];

export const offeredCourseSearchableFields: string[] = [];

export const offeredCourseRealtionalFields: string[] = [
  'academicDepartmentId',
  'semesterRegistrationId',
  'courseId',
];

export const offeredCourseRelationalFieldsMapper: { [key: string]: string } = {
  academicDepartmentId: 'academicDepartment',
  semesterRegistrationId: 'semesterRegistration',
  courseId: 'course',
};
