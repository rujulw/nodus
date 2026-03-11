import cors from "@fastify/cors";
import sensible from "@fastify/sensible";
import type { FastifyInstance } from "fastify";

export async function registerPlugins(app: FastifyInstance): Promise<void> {
  await app.register(sensible);
  await app.register(cors, {
    origin: true,
    credentials: true
  });
}
