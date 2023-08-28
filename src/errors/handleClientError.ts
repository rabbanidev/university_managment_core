import { Prisma } from '@prisma/client';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (
  error: Prisma.PrismaClientKnownRequestError
): IGenericErrorResponse => {
  const statusCode = 400;
  let errors: IGenericErrorMessage[] = [];
  let message = '';

  if (error.code === 'P2025') {
    message = (error.meta?.cause as string) || 'Record not found!';
    errors = [
      {
        path: '',
        message: message,
      },
    ];
  }

  if (error.code === 'P2003') {
    if (error.message.includes('delete()` invocation:')) {
      message = 'Delete failed!';
      errors = [
        {
          path: '',
          message: message,
        },
      ];
    }
  }

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleCastError;
