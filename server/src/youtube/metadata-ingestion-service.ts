import { YoutubeMetadataCache } from "./metadata-cache.js";
import type {
  IngestChannelUploadsResult,
  IngestVideoResult,
  YoutubeVideoMetadata
} from "./types.js";
import { YoutubeClient } from "./youtube-client.js";

interface YoutubeMetadataIngestionServiceOptions {
  apiKey: string;
  cacheTtlSeconds?: number;
}

const DEFAULT_CACHE_TTL_SECONDS = 900;
const DEFAULT_MAX_UPLOADS = 20;

export class YoutubeMetadataIngestionService {
  private readonly client: YoutubeClient;
  private readonly cache: YoutubeMetadataCache;

  constructor(options: YoutubeMetadataIngestionServiceOptions) {
    if (!options.apiKey) {
      throw new Error("YOUTUBE_API_KEY is required for metadata ingestion");
    }

    const cacheTtlSeconds = options.cacheTtlSeconds ?? DEFAULT_CACHE_TTL_SECONDS;

    this.client = new YoutubeClient({ apiKey: options.apiKey });
    this.cache = new YoutubeMetadataCache(cacheTtlSeconds * 1000);
  }

  async ingestChannelUploads(
    youtubeChannelId: string,
    maxResults = DEFAULT_MAX_UPLOADS
  ): Promise<IngestChannelUploadsResult> {
    let channelCacheHit = false;
    let uploadListCacheHit = false;

    const channelFromCache = this.cache.getChannel(youtubeChannelId);
    const channel =
      channelFromCache ?? (await this.client.fetchChannel(youtubeChannelId));

    if (channelFromCache) {
      channelCacheHit = true;
    } else {
      this.cache.setChannel(channel);
    }

    const uploadIdsFromCache = this.cache.getUploadList(youtubeChannelId, maxResults);
    const uploadIds =
      uploadIdsFromCache ??
      (await this.client.fetchLatestUploadIds(youtubeChannelId, maxResults));

    if (uploadIdsFromCache) {
      uploadListCacheHit = true;
    } else {
      this.cache.setUploadList(youtubeChannelId, maxResults, uploadIds);
    }

    const cachedVideos: YoutubeVideoMetadata[] = [];
    const missingVideoIds: string[] = [];

    for (const videoId of uploadIds) {
      const cachedVideo = this.cache.getVideo(videoId);
      if (cachedVideo) {
        cachedVideos.push(cachedVideo);
        continue;
      }

      missingVideoIds.push(videoId);
    }

    const fetchedVideos = await this.client.fetchVideos(missingVideoIds);
    for (const video of fetchedVideos) {
      this.cache.setVideo(video);
    }

    const orderedVideos = uploadIds
      .map((videoId) => this.cache.getVideo(videoId))
      .filter((video): video is YoutubeVideoMetadata => Boolean(video));

    return {
      channel,
      videos: orderedVideos,
      stats: {
        channelCacheHit,
        uploadListCacheHit,
        videoCacheHits: cachedVideos.length,
        fetchedVideos: fetchedVideos.length
      }
    };
  }

  async ingestVideo(youtubeVideoId: string): Promise<IngestVideoResult> {
    const cached = this.cache.getVideo(youtubeVideoId);
    if (cached) {
      return {
        video: cached,
        fromCache: true
      };
    }

    const fetched = await this.client.fetchVideos([youtubeVideoId]);
    const video = fetched[0];

    if (!video) {
      throw new Error(`Video not found for youtube video id: ${youtubeVideoId}`);
    }

    this.cache.setVideo(video);

    return {
      video,
      fromCache: false
    };
  }
}
