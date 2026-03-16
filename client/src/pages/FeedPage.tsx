/**
 * FeedPage — stub for task 1 (IA/route boundaries).
 *
 * Responsibility boundary:
 *   - Owns the ranked video feed UI (for_you | explore modes)
 *   - Accepts user interactions: like, skip, save (dispatched as events)
 *   - Fetches GET /api/v1/videos/feed
 *
 * Implemented in: feat/client-shell task 3 (FeedCard + WatchPage)
 */
export default function FeedPage() {
  return (
    <main aria-label="Feed">
      <h1>Feed</h1>
      <p>Video feed — coming in next task.</p>
    </main>
  );
}
