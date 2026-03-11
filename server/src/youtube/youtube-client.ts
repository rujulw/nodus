import type { YoutubeChannelMetadata, YoutubeVideoMetadata } from "./types.js";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YoutubeClientOptions {
  apiKey: string;
}

interface SearchItem {
  id?: {
    videoId?: string;
  };
}

interface ChannelItem {
  id: string;
  snippet?: {
    title?: string;
    thumbnails?: {
      high?: { url?: string };
      default?: { url?: string };
    };
  };
}

interface VideoItem {
  id: string;
  snippet?: {
    channelId?: string;
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: {
      high?: { url?: string };
      default?: { url?: string };
    };
  };
  contentDetails?: {
    duration?: string;
  };
}

function parseDurationToSeconds(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) {
    return 0;
  }

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
}

export class YoutubeClient {
  constructor(private readonly options: YoutubeClientOptions) {}

  private async request<T>(path: string, params: Record<string, string>): Promise<T> {
    const query = new URLSearchParams({
      ...params,
      key: this.options.apiKey
    });

    const response = await fetch(`${BASE_URL}${path}?${query.toString()}`);

    if (!response.ok) {
      throw new Error(`YouTube API request failed (${response.status}) for ${path}`);
    }

    return (await response.json()) as T;
  }

  async fetchChannel(channelId: string): Promise<YoutubeChannelMetadata> {
    const data = await this.request<{ items?: ChannelItem[] }>("/channels", {
      part: "snippet",
      id: channelId
    });

    const item = data.items?.[0];
    if (!item) {
      throw new Error(`Channel not found for youtube channel id: ${channelId}`);
    }

    return {
      youtubeChannelId: item.id,
      name: item.snippet?.title ?? "Unknown channel",
      avatarUrl:
        item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? null
    };
  }

  async fetchLatestUploadIds(channelId: string, maxResults: number): Promise<string[]> {
    const data = await this.request<{ items?: SearchItem[] }>("/search", {
      part: "id",
      channelId,
      order: "date",
      type: "video",
      maxResults: String(maxResults)
    });

    return (data.items ?? [])
      .map((item) => item.id?.videoId)
      .filter((videoId): videoId is string => Boolean(videoId));
  }

  async fetchVideos(videoIds: string[]): Promise<YoutubeVideoMetadata[]> {
    if (videoIds.length === 0) {
      return [];
    }

    const data = await this.request<{ items?: VideoItem[] }>("/videos", {
      part: "snippet,contentDetails",
      id: videoIds.join(",")
    });

    return (data.items ?? []).map((item) => {
      const durationRaw = item.contentDetails?.duration ?? "PT0S";

      return {
        youtubeVideoId: item.id,
        youtubeChannelId: item.snippet?.channelId ?? "",
        title: item.snippet?.title ?? "Untitled",
        description: item.snippet?.description ?? "",
        publishedAt: item.snippet?.publishedAt ?? new Date(0).toISOString(),
        durationSeconds: parseDurationToSeconds(durationRaw),
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? null
      };
    });
  }
}
