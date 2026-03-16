import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import FeedCard from '@/components/FeedCard';
import type { VideoDto } from '@/contracts/api-contracts';

// ── Hoisted mocks (declarations must exist before the vi.mock factory execution)

const { mockDispatchEvent, mockLike, mockSkip, mockSave } = vi.hoisted(() => ({
  mockDispatchEvent: vi.fn().mockResolvedValue({}),
  mockLike: vi.fn().mockReturnValue({ eventType: 'like', value: 1, videoId: 'vid_1', clientTs: '' }),
  mockSkip: vi.fn().mockReturnValue({ eventType: 'skip', value: 1, videoId: 'vid_1', clientTs: '' }),
  mockSave: vi.fn().mockReturnValue({ eventType: 'save', value: 1, videoId: 'vid_1', clientTs: '' }),
}));

vi.mock('@/services/events', () => ({
  dispatchEvent: mockDispatchEvent,
  like: mockLike,
  skip: mockSkip,
  save: mockSave,
}));

describe('FeedCard', () => {
  const mockVideo: VideoDto = {
    id: 'vid_1',
    youtubeVideoId: 'dQw4w9WgXcQ',
    channelId: 'chan_1',
    title: 'Never Gonna Give You Up',
    description: 'The description',
    publishedAt: '2026-03-16T12:00:00Z',
    durationSeconds: 212,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    topics: [{ slug: 'music', weight: 1.0 }],
    explanation: ['Hits high-affinity topic: Music'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video details card and explanation chips', () => {
    render(
      <MemoryRouter>
        <FeedCard video={mockVideo} />
      </MemoryRouter>
    );

    expect(screen.getByText('Never Gonna Give You Up')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: "Thumbnail for Never Gonna Give You Up" })).toBeInTheDocument();
    expect(screen.getByText('Hits high-affinity topic: Music')).toBeInTheDocument();
  });

  it('triggers like and dispatchEvent on button click click', async () => {
    const user = userEvent.setup();
    const handleLike = vi.fn();

    render(
      <MemoryRouter>
        <FeedCard video={mockVideo} onLike={handleLike} />
      </MemoryRouter>
    );

    const likeButton = screen.getByRole('button', { name: /Like/i });
    await user.click(likeButton);

    expect(mockLike).toHaveBeenCalledWith('vid_1');
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(handleLike).toHaveBeenCalled();
  });

  it('triggers skip action and hides on button click click', async () => {
    const user = userEvent.setup();
    const handleSkip = vi.fn();

    const { container } = render(
      <MemoryRouter>
        <FeedCard video={mockVideo} onSkip={handleSkip} />
      </MemoryRouter>
    );

    const skipButton = screen.getByRole('button', { name: /Skip/i });
    await user.click(skipButton);

    expect(mockSkip).toHaveBeenCalledWith('vid_1');
    expect(mockDispatchEvent).toHaveBeenCalled();
    expect(handleSkip).toHaveBeenCalled();

    // Verify it is hidden (returns null after hides)
    expect(container.firstChild).toBeNull();
  });
});
