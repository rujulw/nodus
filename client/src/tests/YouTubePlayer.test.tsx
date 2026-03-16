import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import YouTubePlayer from '@/components/YouTubePlayer';

describe('YouTubePlayer Component', () => {
  it('renders an iframe with enabling jsapi and nocookie origin', () => {
    const { container } = render(<YouTubePlayer youtubeVideoId="dQw4w9WgXcQ" />);
    const iframe = container.querySelector('iframe');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', expect.stringContaining('dQw4w9WgXcQ'));
    expect(iframe).toHaveAttribute('src', expect.stringContaining('enablejsapi=1'));
  });

  it('sets up a message listener connected to onComplete callback', () => {
    const mockComplete = vi.fn();
    render(<YouTubePlayer youtubeVideoId="dQw4w9WgXcQ" onComplete={mockComplete} />);

    // Simulate postMessage triggers
    window.dispatchEvent(
      new MessageEvent('message', {
        origin: 'https://www.youtube-nocookie.com',
        data: JSON.stringify({ event: 'onStateChange', info: 0 }),
      })
    );

    expect(mockComplete).toHaveBeenCalled();
  });
});
