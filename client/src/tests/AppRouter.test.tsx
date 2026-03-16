import { render, screen } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { router } from '@/routes';

// ── Mock services ──────────────────────────────────────────────────────────

vi.mock('@/services/api', () => ({
  get: vi.fn().mockImplementation((path: string) => {
    if (path === '/videos/feed') {
      return Promise.resolve({ items: [] });
    }
    // Return a single video DTO for /videos/:id
    return Promise.resolve({
      id: 'vid_1',
      title: 'Watch', // Crucial to match screen.findByRole('heading', { name: /Watch/i })
      youtubeVideoId: '123',
    });
  }),
  post: vi.fn().mockResolvedValue({}),
}));

describe('AppRouter', () => {
  it('renders Feed header at root path', async () => {
    // We can use the existing router to test navigation flows if desirable,
    // though navigating inside tests often uses createMemoryRouter for isolation.
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/'],
    });

    render(<RouterProvider router={testRouter} />);
    
    expect(await screen.findByRole('heading', { name: /For You/i })).toBeInTheDocument();
  });

  it('renders Watch header at watch path', async () => {
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/watch/vid_1'],
    });

    render(<RouterProvider router={testRouter} />);
    
    expect(await screen.findByRole('heading', { name: /Watch/i })).toBeInTheDocument();
  });

  it('renders NotFound and navigation at unknown path', async () => {
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/unknown-path'],
    });

    render(<RouterProvider router={testRouter} />);
    
    expect(await screen.findByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Feed/i })).toBeInTheDocument();
  });
});
