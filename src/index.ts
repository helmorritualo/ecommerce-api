import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import type { JwtVariables } from "hono/jwt";
import { secureHeaders } from "hono/secure-headers";

import { routes } from "./controllers/routes";
import { PORT } from "./config/env";
import { databaseConnection } from "./config/database";
import cleanExpiredToken from "./jobs/clean-expired-tokens";
import { errorHandlerMiddleware } from "./middlewares/error-handler";

const app = new Hono<{ Variables: JwtVariables }>();

// Middlewares
app.use(secureHeaders());
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["*"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    credentials: true,
    maxAge: 600,
  })
);
app.onError(errorHandlerMiddleware); // Custom error handler

// Routes
routes.forEach((route) => {
  app.route("/api/v1/", route);
});

databaseConnection().then(() => {
  serve({ fetch: app.fetch, port: Number(PORT) || 3000 }, async (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);

    // Start the job to clean expired tokens
    await cleanExpiredToken();
  });
});
