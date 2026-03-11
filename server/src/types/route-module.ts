import type { FastifyPluginAsync } from "fastify";

export interface RouteModule {
  key: "health" | "channels" | "videos" | "events";
  plugin: FastifyPluginAsync;
}
