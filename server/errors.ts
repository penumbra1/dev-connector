/* eslint-disable security/detect-object-injection */
// See https://github.com/nodesecurity/eslint-plugin-security/issues/21
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

interface ClientErrorPayload {
  [key: string]: string;
}

class ClientError {
  public constructor(errors: {} | string, status?: number) {
    if (typeof errors === "string") {
      this.errors = { error: errors };
    } else {
      this.errors = errors;
    }

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
  if (err instanceof mongoose.Error.ValidationError) {
    // Extract and clean up error messages for the client
    const errorsForClient: ClientErrorPayload = {};
    for (let key of Object.keys(err.errors)) {
      if (err.errors[key].kind === "required") {
        errorsForClient[key] = `Please provide your ${err.errors[key].path}`;
      } else {
        errorsForClient[key] = err.errors[key].message;
      }
    }
    next(new ValidationError(errorsForClient));
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
