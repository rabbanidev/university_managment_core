import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCoursesectionService } from './offeredCourseSection.service';
import { OfferedCourseSection } from '@prisma/client';

const createOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCoursesectionService.createOfferedCourseSection(
      req.body
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course section successfully created!',
      data: result,
    });
  }
);

const getOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCoursesectionService.getOfferedCourseSection(
      req.params.id
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course section successfully fetched!',
      data: result,
    });
  }
);

const updateOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCoursesectionService.updateOfferedCourseSection(
      req.params.id,
      req.body
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course section successfully updated!',
      data: result,
    });
  }
);

const deleteOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCoursesectionService.deleteOfferedCourseSection(
      req.params.id
    );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course section successfully deleted!',
      data: result,
    });
  }
);

export const OfferedCourseSectionController = {
  createOfferedCourseSection,
  getOfferedCourseSection,
  updateOfferedCourseSection,
  deleteOfferedCourseSection,
};
