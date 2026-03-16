import Fastify from "fastify";
import { afterEach, describe, expect, it, vi } from "vitest";

import { eventRoutes } from "./events.js";

function createMockPrisma() {
  const user = { id: "usr_1", username: "test-user" };

  return {
    user: {
      upsert: vi.fn(async () => user)
    },
    userEvent: {
      create: vi.fn(async ({ data }: { data: any }) => ({
        id: "evt_1",
        userId: data.userId,
        videoId: data.videoId,
        eventType: data.eventType,
        value: data.value,
        clientTs: data.clientTs,
        createdAt: new Date("2026-03-11T12:00:00.000Z")
      }))
    }
  };
}

describe("eventRoutes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes a single event", async () => {
    const app = Fastify();
    const prisma = createMockPrisma();

    app.decorate("prisma", prisma as any);
    app.decorate("youtubeIngestionService", null);
    await app.register(eventRoutes, { prefix: "/api/v1" });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/events",
      headers: {
        "content-type": "application/json",
        "x-user-id": "test-user"
      },
      payload: {
        videoId: "vid_1",
        eventType: "WATCH_PROGRESS",
        value: 0.5,
        clientTs: "2026-03-11T12:01:25.100Z"
      }
    });

    expect(response.statusCode).toBe(201);
    expect(prisma.user.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.userEvent.create).toHaveBeenCalledTimes(1);

    await app.close();
  });

  it("validates bad event payload", async () => {
    const app = Fastify();
    const prisma = createMockPrisma();

    app.decorate("prisma", prisma as any);
    app.decorate("youtubeIngestionService", null);
    await app.register(eventRoutes, { prefix: "/api/v1" });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/events",
      headers: {
        "content-type": "application/json"
      },
      payload: {
        videoId: "vid_1",
        eventType: "WATCH_PROGRESS",
        value: 2,
        clientTs: "2026-03-11T12:01:25.100Z"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(prisma.userEvent.create).not.toHaveBeenCalled();

    await app.close();
  });

  it("writes batch events and reports invalid rows", async () => {
    const app = Fastify();
    const prisma = createMockPrisma();

    app.decorate("prisma", prisma as any);
    app.decorate("youtubeIngestionService", null);
    await app.register(eventRoutes, { prefix: "/api/v1" });

    const response = await app.inject({
      method: "POST",
      url: "/api/v1/events/batch",
      headers: {
        "content-type": "application/json"
      },
      payload: {
        events: [
          {
            videoId: "vid_1",
            eventType: "WATCH_START",
            value: 1,
            clientTs: "2026-03-11T12:01:20.000Z"
          },
          {
            videoId: "vid_2",
            eventType: "WATCH_PROGRESS",
            value: 1.2,
            clientTs: "2026-03-11T12:01:30.000Z"
          }
        ]
      }
    });

    expect(response.statusCode).toBe(202);

    const body = response.json();
    expect(body.accepted).toBe(1);
    expect(body.rejected).toBe(1);
    expect(body.errors).toHaveLength(1);
    expect(prisma.userEvent.create).toHaveBeenCalledTimes(1);

    await app.close();
  });
});
