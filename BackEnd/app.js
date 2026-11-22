import express from "express";
import cors from "cors";
import helmet from "helmet";
import { getAllowedOrigins } from "./config/env.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoutes.js";
import { errorHandler, fail, notFoundHandler } from "./utils/http.js";
import { globalLimiter } from "./middleware/rateLimit.js";

const app = express();

// Only trust proxy headers when explicitly configured (numeric hop count).
const trustProxy = process.env.TRUST_PROXY;
if (trustProxy === "true") app.set("trust proxy", true);
else if (/^\d+$/.test(trustProxy || "")) app.set("trust proxy", Number(trustProxy));

app.disable("x-powered-by");

// Optional transport enforcement for deployments without a reverse-proxy rule.
// req.secure requires TRUST_PROXY to be configured correctly.
if (process.env.FORCE_HTTPS === "true") {
  app.use((req, res, next) => {
    if (req.secure) return next();
    if (req.method === "GET" && process.env.PUBLIC_HOST) {
      return res.redirect(301, `https://${process.env.PUBLIC_HOST}${req.originalUrl}`);
    }
    return fail(res, 403, "HTTPS required");
  });
}

const allowedOrigins = getAllowedOrigins();
const isProduction = process.env.NODE_ENV === "production";

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    hsts: {
      maxAge: 15552000,
      includeSubDomains: true,
      force: isProduction && Boolean(process.env.TRUST_PROXY),
    },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      // Non-browser clients (curl, server-to-server) send no Origin header.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "authorization", "token"],
    credentials: false,
    maxAge: 600,
  })
);

app.use(express.json({ limit: "256kb", strict: true }));
app.use(express.urlencoded({ extended: false, limit: "256kb" }));
app.use(globalLimiter);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => res.json({ status: "ok" }));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
