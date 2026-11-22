// Structured logging with an explicit allowlist of safe metadata.
// Never pass req.body, req.headers, tokens, passwords, OTPs or full addresses here.
const REDACTED = "[redacted]";

const safeValue = (value) => {
  if (typeof value === "string") return value.slice(0, 120).replace(/[\r\n]/g, " ");
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "boolean") return value;
  return REDACTED;
};

export const log = (level, event, meta = {}) => {
  const safeMeta = {};
  for (const [key, value] of Object.entries(meta)) {
    if (/password|token|secret|otp|authorization|cookie|key/i.test(key)) continue;
    safeMeta[key] = safeValue(value);
  }
  const entry = { time: new Date().toISOString(), level, event, ...safeMeta };
  const line = JSON.stringify(entry);
  if (level === "error") process.stderr.write(`${line}\n`);
  else process.stdout.write(`${line}\n`);
};

export const logSecurity = (event, meta = {}) => log("warn", event, meta);
export const logInfo = (event, meta = {}) => log("info", event, meta);
export const logError = (event, meta = {}) => log("error", event, meta);
