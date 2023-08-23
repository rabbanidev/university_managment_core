import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { Building } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BuildingService } from './building.service';

const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.createBuilding(req.body);

  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building successfully created!',
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
};
