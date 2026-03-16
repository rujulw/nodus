import type { EventType } from "@prisma/client";
import type { FastifyPluginAsync } from "fastify";

import { getActorUsername } from "../auth/actor.js";

interface RecordEventBody {
  videoId?: string;
  eventType?: EventType;
  value?: number;
  clientTs?: string;
}

interface RecordEventsBatchBody {
  events?: RecordEventBody[];
}

const VALID_EVENT_TYPES: EventType[] = [
  "WATCH_START",
  "WATCH_PROGRESS",
  "COMPLETE",
  "LIKE",
  "SKIP",
  "SAVE"
];

function validateEventBody(body: RecordEventBody): string | null {
  if (!body.videoId || body.videoId.trim().length === 0) {
    return "videoId is required";
  }

  if (!body.eventType || !VALID_EVENT_TYPES.includes(body.eventType)) {
    return "eventType is required and must be valid";
  }

  if (typeof body.value !== "number" || Number.isNaN(body.value)) {
    return "value must be a number";
  }

  if (!body.clientTs || Number.isNaN(Date.parse(body.clientTs))) {
    return "clientTs must be an ISO8601 date-time";
  }

  if (body.eventType === "WATCH_PROGRESS") {
    if (body.value < 0 || body.value > 1) {
      return "value must be between 0 and 1 for WATCH_PROGRESS";
    }
    return null;
  }

  if (body.value !== 1) {
    return "value must be 1 for non-progress events";
  }

  return null;
}

export const eventRoutes: FastifyPluginAsync = async (app) => {
  app.post<{ Body: RecordEventBody }>("/events", async (request, reply) => {
    const error = validateEventBody(request.body ?? {});
    if (error) {
      return reply.code(400).send({
        error: {
          code: "INVALID_REQUEST",
          message: error
        }
      });
    }

    const actorUsername = getActorUsername(request);
    const actor = await app.prisma.user.upsert({
      where: { username: actorUsername },
      update: {},
      create: { username: actorUsername }
    });

    const payload = request.body;

    const event = await app.prisma.userEvent.create({
      data: {
        userId: actor.id,
        videoId: payload.videoId!,
        eventType: payload.eventType!,
        value: payload.value!,
        clientTs: new Date(payload.clientTs!)
      }
    });

    return reply.code(201).send({
      event: {
        id: event.id,
        userId: event.userId,
        videoId: event.videoId,
        eventType: event.eventType,
        value: event.value,
        clientTs: event.clientTs.toISOString(),
        createdAt: event.createdAt.toISOString()
      }
    });
  });

  app.post<{ Body: RecordEventsBatchBody }>("/events/batch", async (request, reply) => {
    const events = request.body?.events;

    if (!Array.isArray(events) || events.length === 0 || events.length > 100) {
      return reply.code(400).send({
        error: {
          code: "INVALID_REQUEST",
          message: "events must be an array with 1..100 items"
        }
      });
    }

    const actorUsername = getActorUsername(request);
    const actor = await app.prisma.user.upsert({
      where: { username: actorUsername },
      update: {},
      create: { username: actorUsername }
    });

    let accepted = 0;
    const errors: Array<{ index: number; code: string; message: string }> = [];

    for (let index = 0; index < events.length; index += 1) {
      const item = events[index];
      const error = validateEventBody(item ?? {});

      if (error) {
        errors.push({
          index,
          code: "INVALID_EVENT",
          message: error
        });
        continue;
      }

      await app.prisma.userEvent.create({
        data: {
          userId: actor.id,
          videoId: item.videoId!,
          eventType: item.eventType!,
          value: item.value!,
          clientTs: new Date(item.clientTs!)
        }
      });

      accepted += 1;
    }

    return reply.code(202).send({
      accepted,
      rejected: events.length - accepted,
      errors
    });
  });
};
