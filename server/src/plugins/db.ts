import { PrismaClient } from "@prisma/client";
import type { FastifyInstance } from "fastify";

export async function registerDbPlugin(app: FastifyInstance): Promise<void> {
  const prisma = new PrismaClient();

  app.decorate("prisma", prisma);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
}
