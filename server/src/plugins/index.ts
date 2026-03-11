import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import type { FastifyInstance } from "fastify";

import type { AppEnv } from "../config/env.js";
import { registerYoutubePlugin } from "./youtube.js";

export async function registerPlugins(app: FastifyInstance, env: AppEnv): Promise<void> {
  await app.register(sensible);
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  await registerYoutubePlugin(app, env);
}
