const http = require("http");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8000);
const AUTH_TOKEN = process.env.AUTH_TOKEN || "local-dev-token";
const METRICS = new Set(["temperature", "humidity", "motion", "smoke"]);
const UNITS = new Set(["celsius", "percent", "boolean", "ppm"]);

const latestReadings = [
  {
    reading_id: "R-LOCAL-0001",
    device_id: "ESP32-LAB-A01",
    metric: "temperature",
    value: 31.5,
    unit: "celsius",
    timestamp: "2026-05-13T08:30:00+07:00",
  },
];

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": status >= 400 ? "application/problem+json" : "application/json",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function problem(status, title, detail, instance) {
  return {
    type: `https://smart-campus.local/problems/${title.toLowerCase().replace(/\s+/g, "-")}`,
    title,
    status,
    detail,
    instance,
  };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        req.destroy();
        reject(new Error("payload too large"));
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

function hasValidAuth(req) {
  return req.headers.authorization === `Bearer ${AUTH_TOKEN}`;
}

function validateReading(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "request body must be a JSON object";
  }
  if (!body.device_id) return "device_id is required";
  if (typeof body.device_id !== "string" || body.device_id.length < 3) {
    return "device_id must be a string with at least 3 characters";
  }
  if (!METRICS.has(body.metric)) return "metric must be one of temperature, humidity, motion, smoke";
  if (typeof body.value !== "number") return "value must be a number";
  if (body.value < -40 || body.value > 80) return "value must be between -40 and 80";
  if (body.unit !== undefined && !UNITS.has(body.unit)) {
    return "unit must be one of celsius, percent, boolean, ppm";
  }
  if (typeof body.timestamp !== "string" || Number.isNaN(Date.parse(body.timestamp))) {
    return "timestamp must be a valid date-time string";
  }
  return null;
}

function shouldRateLimit(req) {
  const prefer = String(req.headers.prefer || "");
  return req.headers["x-rate-limit-test"] === "true" || prefer.includes("code=429");
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, {
      status: "ok",
      service: "iot-ingestion",
      version: "0.3.0",
    });
  }

  if ((url.pathname === "/readings" || url.pathname === "/readings/latest") && !hasValidAuth(req)) {
    return sendJson(
      res,
      401,
      problem(401, "Unauthorized", "Missing or invalid bearer token", url.pathname)
    );
  }

  if (req.method === "GET" && url.pathname === "/readings/latest") {
    const limit = Number(url.searchParams.get("limit") || "10");
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return sendJson(res, 400, problem(400, "Validation error", "limit must be between 1 and 100", url.pathname));
    }

    const deviceId = url.searchParams.get("device_id");
    const filtered = deviceId
      ? latestReadings.filter((reading) => reading.device_id === deviceId)
      : latestReadings;
    return sendJson(res, 200, { items: filtered.slice(0, limit) });
  }

  if (req.method === "POST" && url.pathname === "/readings") {
    if (shouldRateLimit(req)) {
      return sendJson(
        res,
        429,
        problem(429, "Too Many Requests", "Device exceeded allowed telemetry rate", url.pathname),
        { "Retry-After": "30" }
      );
    }

    let payload;
    try {
      payload = JSON.parse(await readBody(req));
    } catch (error) {
      return sendJson(res, 400, problem(400, "Validation error", "request body must be valid JSON", url.pathname));
    }

    const validationError = validateReading(payload);
    if (validationError) {
      return sendJson(res, 400, problem(400, "Validation error", validationError, url.pathname));
    }

    const readingId = `R-LOCAL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    latestReadings.unshift({ reading_id: readingId, ...payload });
    return sendJson(
      res,
      201,
      {
        reading_id: readingId,
        device_id: payload.device_id,
        metric: payload.metric,
        accepted: true,
        created_at: new Date().toISOString(),
      },
      payload.value === 80 ? { "X-Warning": "temperature at configured maximum" } : {}
    );
  }

  return sendJson(res, 404, problem(404, "Not Found", "endpoint is not defined", url.pathname));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Local IoT service listening on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
