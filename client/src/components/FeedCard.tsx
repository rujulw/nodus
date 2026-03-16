import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { VideoDto } from '@/contracts/api-contracts';
import ExplanationChips from './ExplanationChips';
import { dispatchEvent, like, skip, save } from '@/services/events';

interface FeedCardProps {
  video: VideoDto;
  onLike?: () => void;
  onSkip?: () => void;
  onSave?: () => void;
}

export default function FeedCard({ video, onLike, onSkip, onSave }: FeedCardProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  if (isHidden) return null;

  const handleLike = () => {
    if (hasLiked) return; // Prevent double likes in UI
    setHasLiked(true);
    dispatchEvent(like(video.id)).catch(console.error);
    onLike?.();
  };

  const handleSkip = () => {
    setIsHidden(true);
    dispatchEvent(skip(video.id)).catch(console.error);
    onSkip?.();
  };

  const handleSave = () => {
    if (hasSaved) return;
    setHasSaved(true);
    dispatchEvent(save(video.id)).catch(console.error);
    onSave?.();
  };

  const durationStr = () => {
    const min = Math.floor(video.durationSeconds / 60);
    const sec = video.durationSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <article className="feed-card">
      <Link to={`/watch/${video.id}`} className="feed-card__thumb-link">
        <img
          src={video.thumbnailUrl}
          alt={`Thumbnail for ${video.title}`}
          className="feed-card__thumb"
          loading="lazy"
        />
        <div className="feed-card__duration">{durationStr()}</div>
      </Link>

      <div className="feed-card__content">
        <div className="feed-card__meta">
          <time dateTime={video.publishedAt}>
            {new Date(video.publishedAt).toLocaleDateString()}
          </time>
        </div>
        
        <h3 className="feed-card__title">
          <Link to={`/watch/${video.id}`}>{video.title}</Link>
        </h3>

        <ExplanationChips explanations={video.explanation} />

        <div className="feed-card__actions">
          <button
            onClick={handleLike}
            className={`btn-action ${hasLiked ? 'active' : ''}`}
            aria-label="Like this video"
            disabled={hasLiked}
          >
            Like
          </button>
          <button onClick={handleSkip} className="btn-action" aria-label="Skip this video">
            Skip
          </button>
          <button
            onClick={handleSave}
            className={`btn-action ${hasSaved ? 'active' : ''}`}
            aria-label="Save for later"
            disabled={hasSaved}
          >
            Save
          </button>
        </div>
      </div>
    </article>
  );
}
