export const studentFilterableFields: string[] = [
  'searchTerm',
  'studentId',
  'email',
  'contactNo',
  'gender',
  'bloodGroup',
  'gender',
  'academicFacultyId',
  'academicDepartmentId',
  'academicSemesterId',
];

export const studentSearchableFields: string[] = [
  'studentId',
  'email',
  'contactNo',
  'firstName',
  'lastName',
  'middleName',
];

export const studentRelationalFields: string[] = [
  'academicFacultyId',
  'academicDepartmentId',
  'academicSemesterId',
];
export const studentRelationalFieldsMapper: { [key: string]: string } = {
  academicFacultyId: 'academicFaculty',
  academicDepartmentId: 'academicDepartment',
  academicSemesterId: 'academicSemester',
};
