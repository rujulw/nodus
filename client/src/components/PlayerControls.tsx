import { useState } from 'react';
import { dispatchEvent, like, skip, save } from '@/services/events';

interface PlayerControlsProps {
  videoId: string;
}

export default function PlayerControls({ videoId }: PlayerControlsProps) {
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  const handleLike = () => {
    if (hasLiked) return;
    setHasLiked(true);
    dispatchEvent(like(videoId)).catch(console.error);
  };

  const handleSkip = () => {
    dispatchEvent(skip(videoId)).catch(console.error);
    // Might want to navigate home or to next video, but for now just dispatches
    window.location.href = '/';
  };

  const handleSave = () => {
    if (hasSaved) return;
    setHasSaved(true);
    dispatchEvent(save(videoId)).catch(console.error);
  };

  return (
    <aside className="player-controls">
      <h3>Actions</h3>
      <div className="player-controls__buttons">
        <button
          onClick={handleLike}
          className={`btn-action ${hasLiked ? 'active' : ''}`}
          disabled={hasLiked}
        >
          {hasLiked ? 'Liked' : 'Like'}
        </button>
        <button onClick={handleSkip} className="btn-action">
          Skip
        </button>
        <button
          onClick={handleSave}
          className={`btn-action ${hasSaved ? 'active' : ''}`}
          disabled={hasSaved}
        >
          {hasSaved ? 'Saved' : 'Save'}
        </button>
      </div>
    </aside>
  );
}
