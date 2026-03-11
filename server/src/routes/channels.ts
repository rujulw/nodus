import type { FastifyPluginAsync } from "fastify";

export const channelRoutes: FastifyPluginAsync = async (app) => {
  app.post("/channels/follow", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Follow channel endpoint will be implemented in a later slice"
      }
    });
  });

  app.get("/channels/followed", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "List followed channels endpoint will be implemented in a later slice"
      }
    });
  });

  app.delete("/channels/followed/:channelId", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Unfollow channel endpoint will be implemented in a later slice"
      }
    });
  });
};
