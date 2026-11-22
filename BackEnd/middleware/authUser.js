import { fail } from "../utils/http.js";
import { logSecurity } from "../utils/logger.js";
import { extractBearerToken, verifyToken } from "../utils/tokens.js";
import { getUserById } from "../utils/userLookup.js";
import { readObjectId } from "../utils/validation.js";

const authUser = async (req, res, next) => {
  const raw = req.headers.authorization || req.headers.token;
  const token = extractBearerToken(raw);

  if (!token || token.length > 2048) {
    logSecurity("auth_missing_token", { path: req.path });
    return fail(res, 401, "Authentication required");
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "user") {
      logSecurity("auth_wrong_role", { path: req.path, expected: "user" });
      return fail(res, 403, "Not authorized");
    }

    const id = readObjectId(payload.id);
    const user = await getUserById(id);
    if (!user || Number(user.tokenVersion || 0) !== Number(payload.ver || 0)) {
      logSecurity("auth_revoked_session", { path: req.path });
      return fail(res, 401, "Authentication required");
    }

    // Identity always comes from the verified token, never from the request body.
    if (!req.body || typeof req.body !== "object") req.body = {};
    req.body.userId = id;
    req.user = { _id: id };
    return next();
  } catch {
    logSecurity("auth_invalid_token", { path: req.path });
    return fail(res, 401, "Authentication required");
  }
};

export default authUser;
