import { LruTtlCache } from "../cache/lru-ttl-cache.js";
import type { YoutubeChannelMetadata, YoutubeVideoMetadata } from "./types.js";

const DEFAULT_CHANNEL_CACHE_SIZE = 500;
const DEFAULT_VIDEO_CACHE_SIZE = 2000;
const DEFAULT_UPLOAD_LIST_CACHE_SIZE = 500;

export class YoutubeMetadataCache {
  private readonly channels: LruTtlCache<YoutubeChannelMetadata>;
  private readonly videos: LruTtlCache<YoutubeVideoMetadata>;
  private readonly uploadLists: LruTtlCache<string[]>;

  constructor(ttlMs: number) {
    this.channels = new LruTtlCache(DEFAULT_CHANNEL_CACHE_SIZE, ttlMs);
    this.videos = new LruTtlCache(DEFAULT_VIDEO_CACHE_SIZE, ttlMs);
    this.uploadLists = new LruTtlCache(DEFAULT_UPLOAD_LIST_CACHE_SIZE, ttlMs);
  }

  getChannel(channelId: string): YoutubeChannelMetadata | null {
    return this.channels.get(channelId);
  }

  setChannel(channel: YoutubeChannelMetadata): void {
    this.channels.set(channel.youtubeChannelId, channel);
  }

  getVideo(videoId: string): YoutubeVideoMetadata | null {
    return this.videos.get(videoId);
  }

  setVideo(video: YoutubeVideoMetadata): void {
    this.videos.set(video.youtubeVideoId, video);
  }

  getUploadList(channelId: string, maxResults: number): string[] | null {
    return this.uploadLists.get(`${channelId}:${maxResults}`);
  }

  setUploadList(channelId: string, maxResults: number, videoIds: string[]): void {
    this.uploadLists.set(`${channelId}:${maxResults}`, videoIds);
  }
}
