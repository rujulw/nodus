import type { FastifyInstance } from "fastify";

import type { AppEnv } from "../config/env.js";
import { YoutubeMetadataIngestionService } from "../youtube/metadata-ingestion-service.js";

export async function registerYoutubePlugin(app: FastifyInstance, env: AppEnv): Promise<void> {
  if (!env.youtubeApiKey) {
    app.log.warn(
      "YOUTUBE_API_KEY is not configured; youtube ingestion service will be disabled"
    );
    app.decorate("youtubeIngestionService", null);
    return;
  }

  const ingestionService = new YoutubeMetadataIngestionService({
    apiKey: env.youtubeApiKey,
    cacheTtlSeconds: env.youtubeCacheTtlSeconds
  });

  app.decorate("youtubeIngestionService", ingestionService);
}
