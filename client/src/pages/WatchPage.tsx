/**
 * WatchPage — stub for task 1 (IA/route boundaries).
 *
 * Responsibility boundary:
 *   - Owns embedded YouTube playback for a single video
 *   - Dispatches: watch_start (mount), watch_progress (10% steps), complete (end/unmount)
 *   - Accepts: like, skip, save actions via PlayerControls sidebar
 *   - Fetches GET /api/v1/videos/:videoId
 *   - Reads: /watch/:videoId param
 *
 * Implemented in: feat/client-shell task 3 (FeedCard + WatchPage)
 */
export default function WatchPage() {
  return (
    <main aria-label="Watch">
      <h1>Watch</h1>
      <p>Video player</p>
    </main>
  );
}
