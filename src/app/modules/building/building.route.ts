import express from 'express';
import { BuildingController } from './building.controller';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { BuildingValidation } from './building.validation';
import auth from '../../middlewares/auth';
import { ENUMS_USER_ROLE } from '../../../enum/enum';

const router = express.Router();

router.post(
  '/create-building',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(BuildingValidation.createBuildingZodSchema),
  BuildingController.createBuilding
);

router.patch(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  validateRequestHandler(BuildingValidation.updateBuildingZodSchema),
  BuildingController.updateBuilding
);

router.delete(
  '/:id',
  auth(ENUMS_USER_ROLE.SUPER_ADMIN, ENUMS_USER_ROLE.ADMIN),
  BuildingController.deleteBuilding
);

router.get('/', BuildingController.getAllBuildings);

router.get('/:id', BuildingController.getBuilding);

export const BuildingRoutes = router;
