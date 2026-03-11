# API Contracts v1

This document defines v1 REST contracts for channels, videos, and user events.

## Conventions

- Base path: `/api/v1`
- Content type: `application/json`
- Auth: `Authorization: Bearer TOKEN` for all endpoints except health
- Error envelope:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Shared Types

### Channel

```json
{
  "id": "ch_01J...",
  "youtubeChannelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
  "name": "Channel Name",
  "avatarUrl": "https://...",
  "followed": true,
  "createdAt": "2026-03-11T00:00:00.000Z",
  "updatedAt": "2026-03-11T00:00:00.000Z"
}
```

### Video

```json
{
  "id": "vid_01J...",
  "youtubeVideoId": "dQw4w9WgXcQ",
  "channelId": "ch_01J...",
  "title": "Video title",
  "description": "Video description",
  "publishedAt": "2026-03-01T10:00:00.000Z",
  "durationSeconds": 812,
  "thumbnailUrl": "https://...",
  "topics": [
    { "slug": "cybersecurity", "weight": 0.86 }
  ],
  "explanation": [
    "Matches your cybersecurity interest"
  ]
}
```

### User Event

```json
{
  "id": "evt_01J...",
  "userId": "usr_01J...",
  "videoId": "vid_01J...",
  "eventType": "watch_progress",
  "value": 0.75,
  "clientTs": "2026-03-11T12:01:25.100Z",
  "createdAt": "2026-03-11T12:01:25.312Z"
}
```

### Event Types

- `watch_start`
- `watch_progress`
- `complete`
- `like`
- `skip`
- `save`

`value` semantics:
- `watch_start`, `complete`, `like`, `skip`, `save`: `1`
- `watch_progress`: decimal in range `0..1`

## Channels Endpoints

### `POST /api/v1/channels/follow`

Follow a channel by YouTube channel ID and trigger ingestion of recent uploads.

Request:

```json
{
  "youtubeChannelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw"
}
```

Response `201`:

```json
{
  "channel": {
    "id": "ch_01J...",
    "youtubeChannelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
    "name": "Google for Developers",
    "avatarUrl": "https://...",
    "followed": true,
    "createdAt": "2026-03-11T00:00:00.000Z",
    "updatedAt": "2026-03-11T00:00:00.000Z"
  },
  "ingestionQueued": true
}
```

Validation:
- `youtubeChannelId` required, 5-64 chars

### `GET /api/v1/channels/followed`

Returns followed channels for the authenticated user.

Response `200`:

```json
{
  "channels": [
    {
      "id": "ch_01J...",
      "youtubeChannelId": "UC_x5XG1OV2P6uZZ5FSM9Ttw",
      "name": "Google for Developers",
      "avatarUrl": "https://...",
      "followed": true,
      "createdAt": "2026-03-11T00:00:00.000Z",
      "updatedAt": "2026-03-11T00:00:00.000Z"
    }
  ],
  "nextCursor": null
}
```

Query params:
- `cursor` optional
- `limit` optional, default `20`, max `100`

### `DELETE /api/v1/channels/followed/:channelId`

Unfollow a channel.

Response `204` (no body)

## Videos Endpoints

### `POST /api/v1/videos/save`

Save a video into the user library by YouTube video ID.

Request:

```json
{
  "youtubeVideoId": "dQw4w9WgXcQ"
}
```

Response `201`:

```json
{
  "video": {
    "id": "vid_01J...",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "channelId": "ch_01J...",
    "title": "Video title",
    "description": "Video description",
    "publishedAt": "2026-03-01T10:00:00.000Z",
    "durationSeconds": 812,
    "thumbnailUrl": "https://...",
    "topics": [
      { "slug": "cybersecurity", "weight": 0.86 }
    ],
    "explanation": []
  }
}
```

Validation:
- `youtubeVideoId` required, 5-32 chars

### `GET /api/v1/videos/feed`

Returns ranked feed results for a feed mode.

Query params:
- `mode`: `for_you` | `explore` | `imported_profile`
- `profileId`: required when `mode=imported_profile`
- `cursor`: optional
- `limit`: optional, default `20`, max `50`

Response `200`:

```json
{
  "items": [
    {
      "id": "vid_01J...",
      "youtubeVideoId": "dQw4w9WgXcQ",
      "channelId": "ch_01J...",
      "title": "Video title",
      "description": "Video description",
      "publishedAt": "2026-03-01T10:00:00.000Z",
      "durationSeconds": 812,
      "thumbnailUrl": "https://...",
      "topics": [
        { "slug": "cybersecurity", "weight": 0.86 }
      ],
      "explanation": [
        "Matches your cybersecurity interest",
        "From a creator you frequently watch"
      ]
    }
  ],
  "nextCursor": null
}
```

### `GET /api/v1/videos/:videoId`

Returns one saved video record.

Response `200`:

```json
{
  "video": {
    "id": "vid_01J...",
    "youtubeVideoId": "dQw4w9WgXcQ",
    "channelId": "ch_01J...",
    "title": "Video title",
    "description": "Video description",
    "publishedAt": "2026-03-01T10:00:00.000Z",
    "durationSeconds": 812,
    "thumbnailUrl": "https://...",
    "topics": [
      { "slug": "cybersecurity", "weight": 0.86 }
    ],
    "explanation": []
  }
}
```

## Events Endpoints

### `POST /api/v1/events`

Write one user event.

Request:

```json
{
  "videoId": "vid_01J...",
  "eventType": "watch_progress",
  "value": 0.5,
  "clientTs": "2026-03-11T12:01:25.100Z"
}
```

Response `201`:

```json
{
  "event": {
    "id": "evt_01J...",
    "userId": "usr_01J...",
    "videoId": "vid_01J...",
    "eventType": "watch_progress",
    "value": 0.5,
    "clientTs": "2026-03-11T12:01:25.100Z",
    "createdAt": "2026-03-11T12:01:25.312Z"
  }
}
```

Validation:
- `videoId` required
- `eventType` required, enum
- `value` required
- `clientTs` required, ISO8601
- if `eventType=watch_progress`, `value` must be in `0..1`
- otherwise `value` must equal `1`

### `POST /api/v1/events/batch`

Write multiple events in a single request.

Request:

```json
{
  "events": [
    {
      "videoId": "vid_01J...",
      "eventType": "watch_start",
      "value": 1,
      "clientTs": "2026-03-11T12:01:20.000Z"
    },
    {
      "videoId": "vid_01J...",
      "eventType": "watch_progress",
      "value": 0.3,
      "clientTs": "2026-03-11T12:01:30.000Z"
    }
  ]
}
```

Response `202`:

```json
{
  "accepted": 2,
  "rejected": 0,
  "errors": []
}
```

Validation:
- `events` length `1..100`

## Status Codes

- `200` success read
- `201` resource/event created
- `202` batch accepted
- `204` delete success
- `400` invalid request body or query
- `401` unauthenticated
- `403` unauthorized
- `404` resource not found
- `409` duplicate follow/save conflict
- `422` semantic validation error
- `429` rate limited
- `500` internal server error
