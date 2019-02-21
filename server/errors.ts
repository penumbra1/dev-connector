/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from "express";

interface ClientErrorPayload {
  [key: string]: string;
}

class ClientError {
  public constructor(errors: ClientErrorPayload, status?: number) {
    this.errors = errors;
    this.status = status || 400;
  }

  public errors: ClientErrorPayload;
  public status: number;
}

class AuthenticationError extends ClientError {
  public status: number = 401;
}

class ValidationError extends ClientError {
  public status: number = 422;
}

function validationErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ValidationError) {
    console.log("Validation error");
    // 422 errors here
  } else {
    next(err);
  }
}

function clientErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof ClientError) {
    console.log("Client error");
    const { status } = err;
    if (status === 401) {
      res.set("WWW-Authenticate", "Bearer");
    }
    res.status(status).json(err.errors);
  } else {
    next(err);
  }
}

// "Catch-all" handler
function serverErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(500).json({
    error:
      "Unexpected error - please try again or reach out to admin@devconnector.io."
  });
}

function logger(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!(err instanceof ClientError)) {
    console.error(err);
  }
  next(err);
}

export {
  AuthenticationError,
  ClientError,
  ValidationError,
  validationErrorHandler,
  clientErrorHandler,
  serverErrorHandler,
  logger
};
