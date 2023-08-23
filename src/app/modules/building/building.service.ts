import { Building, Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IBuildingFilters } from './building.interface';
import { buildingSearchableFields } from './building.constant';
import { paginationHelpers } from '../../../helper/paginationHelpers';
import { IGenericResponse } from '../../../interfaces/common';

const createBuilding = async (payload: Building): Promise<Building> => {
  const result = await prisma.building.create({
    data: payload,
  });

  return result;
};

const getAllBuildings = async (
  filters: IBuildingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  const { searchTerm } = filters;

  const andConditions = [];

  // Seach implementation
  if (searchTerm) {
    andConditions.push({
      OR: buildingSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  const whereConditions: Prisma.BuildingWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // pagination options
  const { page, limit, skip, sortConditions } =
    paginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.building.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortConditions,
  });

  // total documents
  const total = await prisma.building.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const BuildingService = {
  createBuilding,
  getAllBuildings,
};
