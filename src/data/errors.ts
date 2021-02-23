import HttpStatus from 'http-status-codes';

export abstract class ControllerError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends ControllerError {
  statusCode = HttpStatus.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenError extends ControllerError {
  statusCode = HttpStatus.FORBIDDEN;
  constructor(message: string) {
    super(message);
  }
}

export class ConstraintValidationError extends ControllerError {
  statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
  readonly data: any;

  constructor(message: string, data: any) {
    super(message);
    this.data = data;
  }
}

export class ConflictError extends ControllerError {
  statusCode = HttpStatus.CONFLICT;
  constructor(message) {
    super(message);
  }
}

export class NotFoundError extends ControllerError {
  statusCode = HttpStatus.NOT_FOUND;
  constructor(message) {
    super(message);
  }
}