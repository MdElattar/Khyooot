import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { validateEnvironment } from "./config/env.js";
import { logError, logInfo } from "./utils/logger.js";

const port = process.env.PORT || 4000;

const start = async () => {
  validateEnvironment();
  await connectDB();
  await connectCloudinary();

  app.listen(port, () => logInfo("server_started", { port: Number(port) }));
};

process.on("unhandledRejection", (error) => {
  logError("unhandled_rejection", { name: error?.name, code: error?.code });
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  logError("uncaught_exception", { name: error?.name, code: error?.code });
  process.exit(1);
});

start().catch((error) => {
  logError("startup_failed", { name: error?.name, code: error?.code });
  process.exit(1);
});
