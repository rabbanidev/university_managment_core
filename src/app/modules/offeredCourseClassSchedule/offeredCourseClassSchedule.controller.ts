import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseClassSchedule } from '@prisma/client';
import httpStatus from 'http-status';
import { offeredCourseClassScheduleFilterableFields } from './offeredCourseClassSchedule.constant';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

const createOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await OfferedCourseClassScheduleService.createOfferedCourseClassSchedule(
        req.body
      );

    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedule successfully created!',
      data: result,
    });
  }
);

const getAllOfferedCourseClassSchedules = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseClassScheduleFilterableFields);
    const options = pick(req.query, paginationFields);
    const result =
      await OfferedCourseClassScheduleService.getAllOfferedCourseClassSchedules(
        filters,
        options
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedules fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseClassScheduleService.getOfferedCourseClassSchedule(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedule fetched successfully',
      data: result,
    });
  }
);

const updateOfferedClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseClassScheduleService.updateOfferedClassSchedule(
        id,
        req.body
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedule updated successfully',
      data: result,
    });
  }
);

const deleteOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await OfferedCourseClassScheduleService.deleteOfferedCourseClassSchedule(
        id
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course class schedule deleted successfully',
      data: result,
    });
  }
);

export const OfferedCourseClassScheduleController = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getOfferedCourseClassSchedule,
  updateOfferedClassSchedule,
  deleteOfferedCourseClassSchedule,
};
