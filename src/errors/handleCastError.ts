import mongoose from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errors: IGenericErrorMessage[] = [
    { path: error?.path, message: 'Invalid Id' },
  ];

  const statusCode = 400;
  const message = 'Cast Error';
  const errorMessages = errors;

  return {
    statusCode,
    message,
    errorMessages,
  };
};

export default handleCastError;
