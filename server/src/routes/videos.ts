import type { FastifyPluginAsync } from "fastify";

export const videoRoutes: FastifyPluginAsync = async (app) => {
  app.post("/videos/save", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Save video endpoint will be implemented in a later slice"
      }
    });
  });

  app.get("/videos/feed", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Feed endpoint will be implemented in a later slice"
      }
    });
  });

  app.get("/videos/:videoId", async (_request, reply) => {
    return reply.code(501).send({
      error: {
        code: "NOT_IMPLEMENTED",
        message: "Get video endpoint will be implemented in a later slice"
      }
    });
  });
};
