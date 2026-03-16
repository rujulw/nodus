import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/layouts/AppShell';
import FeedPage from '@/pages/FeedPage';
import WatchPage from '@/pages/WatchPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Route tree — all route boundaries for the nodus client.
 *
 * Path          Page          Notes
 * ─────────────────────────────────────────────────────────
 * /             FeedPage      Ranked video feed (for_you | explore)
 * /watch/:id    WatchPage     Embedded player + event dispatch
 * *             NotFoundPage  Catch-all 404
 *
 * All routes render inside AppShell which provides AppNav + PageLayout.
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true,             element: <FeedPage /> },
      { path: 'watch/:videoId',  element: <WatchPage /> },
      { path: '*',               element: <NotFoundPage /> },
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export default function AppRouter() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
