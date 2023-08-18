import express from 'express';
import modulesRoutes from './moduleRoutes';
const router = express.Router();

modulesRoutes.forEach((moduleRoute) =>
  router.use(moduleRoute.path, moduleRoute.route)
);

export default router;
