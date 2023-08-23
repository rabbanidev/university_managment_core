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

router.get('/', BuildingController.getAllBuildings);

export const BuildingRoutes = router;
