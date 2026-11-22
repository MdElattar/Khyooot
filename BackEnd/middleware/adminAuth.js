import { fail } from "../utils/http.js";
import { logSecurity } from "../utils/logger.js";
import { extractBearerToken, verifyToken } from "../utils/tokens.js";

const adminAuth = (req, res, next) => {
  const raw = req.headers.token || req.headers.authorization;
  const token = extractBearerToken(raw);

  if (!token || token.length > 2048) {
    logSecurity("admin_auth_missing_token", { path: req.path });
    return fail(res, 401, "Authentication required");
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      logSecurity("admin_auth_wrong_role", { path: req.path, expected: "admin" });
      return fail(res, 403, "Not authorized");
    }
    req.admin = { subject: payload.sub };
    return next();
  } catch {
    // The legacy email+password string is deliberately NOT accepted here.
    logSecurity("admin_auth_invalid_token", { path: req.path });
    return fail(res, 401, "Authentication required");
  }
};

export default adminAuth;
