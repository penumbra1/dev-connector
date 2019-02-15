import { Request, Response, NextFunction } from "express";

class ErrorWithStatus extends Error {
  constructor(
    message: string = "Server error - please try again or contact us at admin@devconnector.io",
    status: number = 500
  ) {
    super(message);
    this.status = status;
  }

  status: number;
}

function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { stack, status, message } = err;
  console.error(stack);
  res.status(status).json({ message });
}

export { ErrorWithStatus, errorHandler as default };
