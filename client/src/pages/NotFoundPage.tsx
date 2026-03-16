import { Link } from 'react-router-dom';

/** NotFoundPage — catch-all 404 boundary. */
export default function NotFoundPage() {
  return (
    <main aria-label="Page not found">
      <h1>404 — Page not found</h1>
      <Link to="/">Back to Feed</Link>
    </main>
  );
}
