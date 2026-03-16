export interface YoutubeChannelMetadata {
  youtubeChannelId: string;
  name: string;
  avatarUrl: string | null;
}

export interface YoutubeVideoMetadata {
  youtubeVideoId: string;
  youtubeChannelId: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  thumbnailUrl: string | null;
}

export interface YoutubeIngestionStats {
  channelCacheHit: boolean;
  uploadListCacheHit: boolean;
  videoCacheHits: number;
  fetchedVideos: number;
}

export interface IngestChannelUploadsResult {
  channel: YoutubeChannelMetadata;
  videos: YoutubeVideoMetadata[];
  stats: YoutubeIngestionStats;
}

export interface IngestVideoResult {
  video: YoutubeVideoMetadata;
  fromCache: boolean;
}
