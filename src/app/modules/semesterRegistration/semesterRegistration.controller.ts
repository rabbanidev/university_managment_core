import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { Request, Response } from 'express';
import { SemesterRegistration } from '@prisma/client';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { paginationFields } from '../../../constants/pagination';
import { SemesterRegistrationService } from './semesterRegistration.service';
import { semesterRegistrationFilterableFields } from './semesterRegistration.constant';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.createSemesterRegistration(
      req.body
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration successfully created!',
      data: result,
    });
  }
);

const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, semesterRegistrationFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);

    const result =
      await SemesterRegistrationService.getAllSemesterRegistrations(
        filters,
        paginationOptions
      );

    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registrations successfully fetched!',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.getSemesterRegistration(
      req.params.id
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration successfully fetched!',
      data: result,
    });
  }
);

const updateSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.updateSemesterRegistration(
      req.params.id,
      req.body
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration successfully updated!',
      data: result,
    });
  }
);

const deleteSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.deleteSemesterRegistration(
      req.params.id
    );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration successfully deleted!',
      data: result,
    });
  }
);

const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.startMyRegistration(
    req.user?.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student semester registration successfully created!',
    data: result,
  });
});

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.enrollIntoCourse(
    req.user?.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student enrollment successfully!',
    data: result,
  });
});

const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.withdrawFromCourse(
    req.user?.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully withdraw from course!',
    data: result,
  });
});

const confirmMyRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.confirmMyRegistration(
      req.user?.userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Confirm your registration!',
      data: result,
    });
  }
);

const getMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.getMyRegistration(
    req.user.userId
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My registration data fatched!',
    data: result,
  });
});

const startNewSemester = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.startNewSemester(
    req.params.id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Semester started successfully!',
    data: result,
  });
});

const getMySemesterRegCourses = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.getMySemesterRegCourses(
      req.user.userId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'My semester registration courses data fetched!',
      data: result,
    });
  }
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
  getMySemesterRegCourses,
};
