import { beforeEach, describe, expect, it, vi } from "vitest";

import { YoutubeMetadataIngestionService } from "./metadata-ingestion-service.js";

const channelId = "UC_x5XG1OV2P6uZZ5FSM9Ttw";

describe("YoutubeMetadataIngestionService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("reuses cache entries between ingestion runs", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/channels?")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: channelId,
                snippet: {
                  title: "Test Channel",
                  thumbnails: {
                    high: { url: "https://img/channel.png" }
                  }
                }
              }
            ]
          }),
          { status: 200 }
        );
      }

      if (url.includes("/search?")) {
        return new Response(
          JSON.stringify({
            items: [
              { id: { videoId: "v1" } },
              { id: { videoId: "v2" } }
            ]
          }),
          { status: 200 }
        );
      }

      if (url.includes("/videos?")) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: "v1",
                snippet: {
                  channelId,
                  title: "Video 1",
                  description: "d1",
                  publishedAt: "2026-03-01T00:00:00.000Z",
                  thumbnails: { high: { url: "https://img/v1.png" } }
                },
                contentDetails: { duration: "PT10M" }
              },
              {
                id: "v2",
                snippet: {
                  channelId,
                  title: "Video 2",
                  description: "d2",
                  publishedAt: "2026-03-02T00:00:00.000Z",
                  thumbnails: { high: { url: "https://img/v2.png" } }
                },
                contentDetails: { duration: "PT5M" }
              }
            ]
          }),
          { status: 200 }
        );
      }

      return new Response(JSON.stringify({ items: [] }), { status: 200 });
    });

    vi.stubGlobal("fetch", fetchMock);

    const service = new YoutubeMetadataIngestionService({
      apiKey: "test-key",
      cacheTtlSeconds: 300
    });

    const first = await service.ingestChannelUploads(channelId, 2);
    expect(first.videos).toHaveLength(2);
    expect(first.stats.channelCacheHit).toBe(false);
    expect(first.stats.uploadListCacheHit).toBe(false);
    expect(first.stats.videoCacheHits).toBe(0);
    expect(first.stats.fetchedVideos).toBe(2);

    const second = await service.ingestChannelUploads(channelId, 2);
    expect(second.videos).toHaveLength(2);
    expect(second.stats.channelCacheHit).toBe(true);
    expect(second.stats.uploadListCacheHit).toBe(true);
    expect(second.stats.videoCacheHits).toBe(2);
    expect(second.stats.fetchedVideos).toBe(0);

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
