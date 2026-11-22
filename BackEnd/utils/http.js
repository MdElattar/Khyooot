import { ValidationError } from "./validation.js";
import { logError } from "./logger.js";

export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof ValidationError) {
    return fail(res, error.status, error.publicMessage);
  }

  if (error?.name === "MulterError") {
    return fail(res, 400, error.code === "LIMIT_FILE_SIZE" ? "File is too large" : "Invalid upload");
  }

  if (error instanceof SyntaxError && "body" in error) {
    return fail(res, 400, "Invalid JSON body");
  }

  if (error?.message === "Origin not allowed") {
    return fail(res, 403, "Origin not allowed");
  }

  // Internal details are logged server-side only; clients get a generic message.
  logError("unhandled_request_error", { name: error?.name, code: error?.code, path: req.path });
  return fail(res, 500, "Something went wrong");
};

export const notFoundHandler = (req, res) => fail(res, 404, "Not found");
