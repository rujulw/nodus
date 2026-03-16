export type FeedMode = "for_you" | "explore" | "imported_profile";

export type EventType =
  | "watch_start"
  | "watch_progress"
  | "complete"
  | "like"
  | "skip"
  | "save";

export interface TopicWeight {
  slug: string;
  weight: number;
}

export interface ChannelDto {
  id: string;
  youtubeChannelId: string;
  name: string;
  avatarUrl: string;
  followed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoDto {
  id: string;
  youtubeVideoId: string;
  channelId: string;
  title: string;
  description: string;
  publishedAt: string;
  durationSeconds: number;
  thumbnailUrl: string;
  topics: TopicWeight[];
  explanation: string[];
}

export interface UserEventDto {
  id: string;
  userId: string;
  videoId: string;
  eventType: EventType;
  value: number;
  clientTs: string;
  createdAt: string;
}

export interface FollowChannelRequest {
  youtubeChannelId: string;
}

export interface FollowChannelResponse {
  channel: ChannelDto;
  ingestionQueued: boolean;
}

export interface ListFollowedChannelsResponse {
  channels: ChannelDto[];
  nextCursor: string | null;
}

export interface SaveVideoRequest {
  youtubeVideoId: string;
}

export interface SaveVideoResponse {
  video: VideoDto;
}

export interface FeedResponse {
  items: VideoDto[];
  nextCursor: string | null;
}

export interface RecordEventRequest {
  videoId: string;
  eventType: EventType;
  value: number;
  clientTs: string;
}

export interface RecordEventResponse {
  event: UserEventDto;
}

export interface RecordEventsBatchRequest {
  events: RecordEventRequest[];
}

export interface RecordEventsBatchResponse {
  accepted: number;
  rejected: number;
  errors: Array<{ index: number; code: string; message: string }>;
}
