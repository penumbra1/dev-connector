import { Request, Response, NextFunction } from "express";

class ClientError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.status = status;
  }
}

interface ErrorWithStatus extends Error {
  status?: number;
}

function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { stack, status = 500 } = err;
  console.error(stack);
  if (status === 401) {
    res.set("WWW-Authenticate", "Bearer");
  }
  const errorForClient =
    status === 500
      ? "Unexpected error - please try again or reach out to admin@devconnector.io."
      : err.message;
  res.status(status).json({ error: errorForClient });
}

export { ClientError, errorHandler as default };
