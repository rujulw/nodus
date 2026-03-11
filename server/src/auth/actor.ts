import type { FastifyRequest } from "fastify";

const DEFAULT_USERNAME = "local-dev";

export function getActorUsername(request: FastifyRequest): string {
  const header = request.headers["x-user-id"];

  if (typeof header === "string" && header.trim().length > 0) {
    return header.trim().slice(0, 64);
  }

  return DEFAULT_USERNAME;
}
