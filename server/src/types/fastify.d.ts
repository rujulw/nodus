import "fastify";

import type { PrismaClient } from "@prisma/client";
import type { YoutubeMetadataIngestionService } from "../youtube/metadata-ingestion-service.js";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
    youtubeIngestionService: YoutubeMetadataIngestionService | null;
  }
}
