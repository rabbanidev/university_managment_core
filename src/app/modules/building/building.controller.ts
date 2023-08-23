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
    message: 'Buildings successfully fetched!',
    meta: result.meta,
    data: result.data,
  });
});

const getBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.getBuilding(req.params.id);

  sendResponse<Building | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building successfully fetched!',
    data: result,
  });
});

const updateBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.updateBuilding(req.params.id, req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building successfully updated!',
    data: result,
  });
});

const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.deleteBuilding(req.params.id);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building successfully deleted!',
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getAllBuildings,
  getBuilding,
  updateBuilding,
  deleteBuilding,
};
