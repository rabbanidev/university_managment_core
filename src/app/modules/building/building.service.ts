import { Building } from '@prisma/client';
import prisma from '../../../shared/prisma';

const createBuilding = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: payload,
  });

  return result;
};

export const BuildingService = {
  createBuilding,
};
