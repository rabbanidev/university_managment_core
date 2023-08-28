import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';
import { Prisma } from '@prisma/client';

const handleValidationError = (
  error: Prisma.PrismaClientValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    {
      path: '',
      message: error.message,
    },
  ];

  const statusCode = 400;
  const message = 'Validation Error';
  const errorMessages = errors;

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleValidationError;
