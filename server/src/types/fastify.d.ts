import "fastify";

import type { YoutubeMetadataIngestionService } from "../youtube/metadata-ingestion-service.js";

declare module "fastify" {
  interface FastifyInstance {
    youtubeIngestionService: YoutubeMetadataIngestionService | null;
  }
}
