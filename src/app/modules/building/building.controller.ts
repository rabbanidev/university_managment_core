import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { Building } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BuildingService } from './building.service';
import { buildingFilterableFields } from './building.constant';
import { paginationFields } from '../../../constants/pagination';

const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.createBuilding(req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building successfully created!',
    data: result,
  });
});

const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingService.getAllBuildings(
    filters,
    paginationOptions
  );

  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building successfully fetched!',
    meta: result.meta,
    data: result.data,
  });
});

export const BuildingController = {
  createBuilding,
  getAllBuildings,
};
