import { IRoute } from '../../interfaces/route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';

const modulesRoutes: IRoute[] = [
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
];

export default modulesRoutes;
