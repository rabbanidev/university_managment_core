import { IGenericErrorMessage } from './../interfaces/error';
import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorResponse } from '../interfaces/common';

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const statusCode = 400;
  const message = 'Validation Error';
  const errorMessages: IGenericErrorMessage[] = error.issues.map(
    (issue: ZodIssue) => {
      const lastPath = issue?.path[issue?.path?.length - 1];
      return {
        path: lastPath,
        message: issue?.message,
      };
    }
  );

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleZodError;
