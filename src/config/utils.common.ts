import { ValidationError, ObjectSchema } from "joi";
import { ConstraintValidationError, UnauthorizedError, ForbiddenError } from '../data/errors';
import { NextFunction, Request, RequestHandler, Response } from "express";
import dotenv from 'dotenv';
import jwt, { TokenExpiredError } from 'jsonwebtoken';

dotenv.config();

export type ValidationContext = "body" | "query" | "params";

export function parseError(error: ValidationError) {
  return error.details.reduce((acc, curr) => {
    acc[curr.context.key] = curr.message;
    return acc;
  }, {});
}

function innerValidate(data: any, schema: ObjectSchema) {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (!error) return { err: null, value: value };

  return {
    err: parseError(error),
    value: null
  };
}

export function validate(
  schema: ObjectSchema,
  context: ValidationContext = "body"
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const { err, value } = innerValidate(req[context], schema);

    if (!err) {
      req[context] = value;
      return next();
    }

    const message = "One or more validation errors occured";
    throw new ConstraintValidationError(message, err);
  };
}

export const authenticate = (req, _res, next) => {
  console.log("I got here!!!!!!!!!!!!!")
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    next(new UnauthorizedError("No token sent in request"));
  }

  console.log("I got to stage 2!!!!!!!!!!!!!")
  const header = authHeader.split(' ');
  const token = header[1];

  try {
    const decoded = jwt.verify(token, process.env.SECURITY_HASH);
    req.user = decoded;
    console.log("I got to stage 3!!!!!!!!!!!!!")
    next();
  } catch (err) {
    console.error(err)
    if (err instanceof TokenExpiredError) {
      console.log("I got to stage 5!!!!!!!!!!!!!")
      next(new ForbiddenError("Invalid Token"));
    }
    console.log("I got to stage 6!!!!!!!!!!!!!")
    next(err);
  }
}
