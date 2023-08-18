import { Response } from 'express';

type ISendResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data?: T | null;
};

const sendResponse = <T>(res: Response, payload: ISendResponse<T>): void => {
  const responseData: ISendResponse<T> = {
    statusCode: payload.statusCode,
    success: payload.success,
    message: payload.message || null,
    meta: payload.meta || null || undefined,
    data: payload.data || null,
  };

  res.status(payload.statusCode).json(responseData);
};

export default sendResponse;
