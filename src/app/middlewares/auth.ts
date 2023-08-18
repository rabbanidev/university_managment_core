import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helper/jwtHelpers';
import config from '../../config';
import { Secret } from 'jsonwebtoken';

const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Your are not authorized!');
      }

      // verify token
      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.access_secret as Secret
      );

      // Set verified user for next middleware
      req.user = verifiedUser;

      // Check role exit in required roles
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden!');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
export default auth;
