import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '@/services/api';
import type { VideoDto } from '@/contracts/api-contracts';
import { dispatchEvent, watchStart, watchProgress, complete } from '@/services/events';
import YouTubePlayer from '@/components/YouTubePlayer';
import PlayerControls from '@/components/PlayerControls';
import ExplanationChips from '@/components/ExplanationChips';

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<VideoDto | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!videoId) return;

    // Fetch video details
    get<VideoDto>(`/videos/${videoId}`)
      .then(setVideo)
      .catch((err) => setError(err.message));

    // Dispatch watch_start on mount
    dispatchEvent(watchStart(videoId)).catch(console.error);

    // Dispatch complete on unmount
    return () => {
      dispatchEvent(complete(videoId)).catch(console.error);
    };
  }, [videoId]);

  const handleProgress = (ratio: number) => {
    if (!videoId) return;
    dispatchEvent(watchProgress(videoId, ratio)).catch(console.error);
  };

  const handleComplete = () => {
    if (!videoId) return;
    dispatchEvent(complete(videoId)).catch(console.error);
  };

  if (error) {
    return <main className="error-banner">Error loading video: {error}</main>;
  }

  if (!video) {
    return <main className="loading-spinner">Loading player...</main>;
  }

  return (
    <main aria-label="Watch">
      <div className="watch-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <div className="watch-main">
          <YouTubePlayer
            youtubeVideoId={video.youtubeVideoId}
            onProgress={handleProgress}
            onComplete={handleComplete}
          />
          <h1 style={{ marginTop: '16px', marginBottom: '8px' }}>{video.title}</h1>
          
          <div style={{ marginBottom: '16px' }}>
            <ExplanationChips explanations={video.explanation} />
          </div>

          <p style={{ color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
            {video.description}
          </p>
        </div>

        <aside className="watch-sidebar">
          <PlayerControls videoId={video.id} />
        </aside>
      </div>
    </main>
  );
}
