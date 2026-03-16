import type { FastifyInstance } from "fastify";

import { channelRoutes } from "./channels.js";
import { eventRoutes } from "./events.js";
import { healthRoutes } from "./health.js";
import type { RouteModule } from "../types/route-module.js";
import { videoRoutes } from "./videos.js";

export const routeRegistry = [
  {
    key: "health",
    plugin: healthRoutes
  },
  {
    key: "channels",
    plugin: channelRoutes
  },
  {
    key: "videos",
    plugin: videoRoutes
  },
  {
    key: "events",
    plugin: eventRoutes
  }
] as const satisfies readonly RouteModule[];

export async function registerRoutes(app: FastifyInstance, apiPrefix: string): Promise<void> {
  for (const route of routeRegistry) {
    if (route.key === "health") {
      await app.register(route.plugin);
      continue;
    }

    await app.register(route.plugin, { prefix: apiPrefix });
  }
}
