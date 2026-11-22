import assert from "node:assert/strict";
import test from "node:test";
import request from "supertest";

// Test-only fixture values. These are not deployment secrets.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-jwt-secret-for-https-tests-0001";
process.env.CORS_ORIGINS = "http://localhost:5173";
process.env.FORCE_HTTPS = "true";
process.env.PUBLIC_HOST = "api.example.test";
process.env.GLOBAL_RATE_LIMIT = "1000";

const { default: app } = await import("../app.js?force-https");

test("FORCE_HTTPS redirects reads and blocks state changes over plain HTTP", async () => {
  const get = await request(app).get("/");
  assert.equal(get.status, 301);
  assert.equal(get.headers.location, "https://api.example.test/");

  const post = await request(app).post("/api/user/login").send({});
  assert.equal(post.status, 403);
  assert.equal(post.body.message, "HTTPS required");
});
