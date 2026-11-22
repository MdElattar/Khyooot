import mongoose from "mongoose";
import "./mongoose.js";
import { logError, logInfo } from "../utils/logger.js";

const connectDB = async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");

  mongoose.connection.on("connected", () => logInfo("database_connected"));
  mongoose.connection.on("error", (error) => {
    logError("database_error", { name: error?.name, code: error?.code });
  });

  // TLS certificate and hostname verification remain enabled (no bypass flags).
  await mongoose.connect(process.env.MONGODB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000,
  });
};

export default connectDB;
