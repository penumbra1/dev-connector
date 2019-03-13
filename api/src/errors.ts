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
      // Errors on the child schema are reported twice: as a ValidatorError
      // on the child key and a ValidationError on the parent key (see NOTES).
      // Normally errors in the err.errors hash are of type ValidatorError.
      // Ignore nested ValidationErrors to ignore duplicates on the parent.
      if (err.errors[key] instanceof mongoose.Error.ValidationError) continue;

      const { path, kind, message } = err.errors[key];
      switch (kind) {
        case "required":
          errorsForClient[key] = `Please provide your ${path}`;
          break;
        case "unique":
          errorsForClient[key] = `This ${path} is already taken.`;
          break;
        default:
          errorsForClient[key] = message;
          break;
      }
    }
    next(new ClientError(errorsForClient));
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
    // A ClientError thrown explicitly
    const { status } = err;
    if (status === 401) {
      res.set("WWW-Authenticate", "Bearer");
    }
    res.status(status).json(err.errors);
  } else if (err instanceof SyntaxError) {
    // Invalid JSON caught by the Express json parser
    res.status(400).json({ json: err.message });
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
    // eslint-disable-next-line no-console
    console.error(err);
  }
  next(err);
}

export {
  AuthenticationError,
  ClientError,
  validationErrorHandler,
  clientErrorHandler,
  serverErrorHandler,
  logger
};
