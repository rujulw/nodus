import type { FastifyPluginAsync } from "fastify";

export const eventRoutes: FastifyPluginAsync = async (app) => {
  app.post("/events", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Record event endpoint will be implemented in a later slice"
      }
    });
  });

  app.post("/events/batch", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Batch events endpoint will be implemented in a later slice"
      }
    });
  });
};
