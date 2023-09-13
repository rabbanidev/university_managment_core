import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentSemesterPaymentService } from './studentSemesterPayment.service';
import { studentSemesterPaymentFilterableFields } from './studentSemesterPayment.constant';
import { paginationFields } from '../../../constants/pagination';

const getAllStudentSemesterPayments = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, studentSemesterPaymentFilterableFields);
    const options = pick(req.query, paginationFields);
    const result =
      await StudentSemesterPaymentService.getAllStudentSemesterPayments(
        filters,
        options
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student semester payment fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const StudentSemesterPaymentController = {
  getAllStudentSemesterPayments,
};
