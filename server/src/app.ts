import Fastify, { type FastifyInstance } from "fastify";

import { readEnv, type AppEnv } from "./config/env.js";
import { registerPlugins } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";

export async function buildServer(env: AppEnv = readEnv()): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: env.nodeEnv === "production" ? "info" : "debug"
    }
  });

  await registerPlugins(app, env);
  await registerRoutes(app, env.apiPrefix);

  return app;
}
