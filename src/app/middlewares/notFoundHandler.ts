import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { INotFound } from '../../interfaces/common';

const notFoundHandler: RequestHandler = (req, res, next) => {
  const notFoundResponse: INotFound = {
    success: false,
    message: 'Not Found!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'API Not Found!',
      },
    ],
  };

  res.status(httpStatus.NOT_FOUND).json(notFoundResponse);

  next();
};

export default notFoundHandler;
