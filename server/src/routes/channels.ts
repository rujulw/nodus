import type { FastifyPluginAsync } from "fastify";

import { getActorUsername } from "../auth/actor.js";

interface FollowChannelBody {
  youtubeChannelId?: string;
}

interface FollowedChannelsQuery {
  limit?: string;
}

interface UnfollowParams {
  channelId: string;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function toChannelDto(channel: {
  id: string;
  youtubeChannelId: string;
  name: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: channel.id,
    youtubeChannelId: channel.youtubeChannelId,
    name: channel.name,
    avatarUrl: channel.avatarUrl,
    followed: true,
    createdAt: channel.createdAt.toISOString(),
    updatedAt: channel.updatedAt.toISOString()
  };
}

export const channelRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: FollowChannelBody }>("/channels/follow", async (request, reply) => {
    const youtubeChannelId = request.body?.youtubeChannelId?.trim();
    if (!youtubeChannelId) {
      return reply.code(400).send({
        error: {
          code: "INVALID_REQUEST",
          message: "youtubeChannelId is required"
        }
      });
    }

    if (!app.youtubeIngestionService) {
      return reply.code(503).send({
        error: {
          code: "INGESTION_UNAVAILABLE",
          message: "YouTube ingestion service is not configured"
        }
      });
    }

    const actorUsername = getActorUsername(request);
    const actor = await app.prisma.user.upsert({
      where: { username: actorUsername },
      update: {},
      create: { username: actorUsername }
    });

    const ingestionResult = await app.youtubeIngestionService.ingestChannelUploads(
      youtubeChannelId,
      20
    );

    const channel = await app.prisma.channel.upsert({
      where: { youtubeChannelId: ingestionResult.channel.youtubeChannelId },
      update: {
        name: ingestionResult.channel.name,
        avatarUrl: ingestionResult.channel.avatarUrl
      },
      create: {
        youtubeChannelId: ingestionResult.channel.youtubeChannelId,
        name: ingestionResult.channel.name,
        avatarUrl: ingestionResult.channel.avatarUrl
      }
    });

    await Promise.all(
      ingestionResult.videos.map(async (video) => {
        await app.prisma.video.upsert({
          where: { youtubeVideoId: video.youtubeVideoId },
          update: {
            channelId: channel.id,
            title: video.title,
            description: video.description,
            publishedAt: new Date(video.publishedAt),
            durationSeconds: video.durationSeconds,
            thumbnailUrl: video.thumbnailUrl ?? ""
          },
          create: {
            youtubeVideoId: video.youtubeVideoId,
            channelId: channel.id,
            title: video.title,
            description: video.description,
            publishedAt: new Date(video.publishedAt),
            durationSeconds: video.durationSeconds,
            thumbnailUrl: video.thumbnailUrl ?? ""
          }
        });
      })
    );

    await app.prisma.followedChannel.upsert({
      where: {
        userId_channelId: {
          userId: actor.id,
          channelId: channel.id
        }
      },
      update: {},
      create: {
        userId: actor.id,
        channelId: channel.id
      }
    });

    return reply.code(201).send({
      channel: toChannelDto(channel),
      ingestionQueued: ingestionResult.videos.length > 0
    });
  });

  app.get<{ Querystring: FollowedChannelsQuery }>("/channels/followed", async (request) => {
    const actorUsername = getActorUsername(request);
    const actor = await app.prisma.user.upsert({
      where: { username: actorUsername },
      update: {},
      create: { username: actorUsername }
    });

    const parsedLimit = Number(request.query?.limit ?? DEFAULT_LIMIT);
    const limit = Number.isFinite(parsedLimit)
      ? Math.max(1, Math.min(parsedLimit, MAX_LIMIT))
      : DEFAULT_LIMIT;

    const followedChannels = await app.prisma.followedChannel.findMany({
      where: { userId: actor.id },
      include: { channel: true },
      orderBy: { createdAt: "desc" },
      take: limit
    });

    return {
      channels: followedChannels.map((item) => toChannelDto(item.channel)),
      nextCursor: null
    };
  });

  app.delete<{ Params: UnfollowParams }>("/channels/followed/:channelId", async (request, reply) => {
    const actorUsername = getActorUsername(request);
    const actor = await app.prisma.user.upsert({
      where: { username: actorUsername },
      update: {},
      create: { username: actorUsername }
    });

    const deleted = await app.prisma.followedChannel.deleteMany({
      where: {
        userId: actor.id,
        channelId: request.params.channelId
      }
    });

    if (deleted.count === 0) {
      return reply.code(404).send({
        error: {
          code: "NOT_FOUND",
          message: "Followed channel not found"
        }
      });
    }

    return reply.code(204).send();
  });
};
