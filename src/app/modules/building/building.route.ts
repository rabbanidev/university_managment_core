import express from 'express';
import { BuildingController } from './building.controller';
import validateRequestHandler from '../../middlewares/validateRequestHandler';
import { BuildingValidation } from './building.validation';

const router = express.Router();

router.post(
  '/create-building',
  validateRequestHandler(BuildingValidation.createBuildingZodSchema),
  BuildingController.createBuilding
);

router.get('/', BuildingController.getAllBuildings);

export const BuildingRoutes = router;
