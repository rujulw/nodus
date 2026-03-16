import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { get } from '@/services/api';
import type { FeedResponse, VideoDto } from '@/contracts/api-contracts';
import FeedCard from '@/components/FeedCard';

export default function FeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'for_you';
  
  const [videos, setVideos] = useState<VideoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    
    get<FeedResponse>('/videos/feed', { mode })
      .then((data) => setVideos(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [mode]);

  const toggleMode = () => {
    setSearchParams({ mode: mode === 'for_you' ? 'explore' : 'for_you' });
  };

  return (
    <main aria-label="Feed">
      <header className="feed-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{mode === 'for_you' ? 'For You' : 'Explore'}</h1>
        <button className="btn-action" onClick={toggleMode}>
          Switch to {mode === 'for_you' ? 'Explore' : 'For You'}
        </button>
      </header>

      {error && <div className="error-banner">Error loading feed: {error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Loading videos...</div>
      ) : videos.length === 0 && !error ? (
        <div className="empty-state">No videos found. Try exploring to find new creators!</div>
      ) : (
        <div className="feed-grid">
          {videos.map((video) => (
            <FeedCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </main>
  );
}
