import { Error } from 'mongoose';
import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';

const handleValidationError = (
  error: Error.ValidationError
): IGenericErrorResponse => {
  const listOfErrors = Object.values(error.errors);
  const errors: IGenericErrorMessage[] = listOfErrors.map(
    (el: Error.ValidatorError | Error.CastError) => {
      return { path: el?.path, message: el?.message };
    }
  );

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
