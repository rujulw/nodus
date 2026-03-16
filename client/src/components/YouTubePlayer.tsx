import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  youtubeVideoId: string;
  onProgress?: (ratio: number) => void;
  onComplete?: () => void;
}

export default function YouTubePlayer({
  youtubeVideoId,
  onProgress,
  onComplete,
}: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const reportedTicks = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: only accept messages from youtube iframe domains
      if (!event.origin.includes('youtube.com') && !event.origin.includes('youtube-nocookie.com')) {
        return;
      }

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.event === 'onStateChange' && data.info === 0) {
          // 0 == YT.PlayerState.ENDED
          onComplete?.();
        }

        if (data.event === 'infoDelivery' && data.info) {
          const { currentTime, duration, playerState } = data.info;
          if (currentTime !== undefined && duration !== undefined && duration > 0) {
             const ratio = currentTime / duration;
             // Calculate 10% buckets (0.1, 0.2, etc.)
             const bucket = Math.floor(ratio * 10) / 10;
             
             // Only report each 10% tick once per video
             if (bucket > 0 && !reportedTicks.current.has(bucket)) {
               reportedTicks.current.add(bucket);
               onProgress?.(bucket);
             }
          }
          
          if (playerState === 0) {
            onComplete?.();
          }
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        // Ignore JSON parse errors for non-YouTube messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onProgress, onComplete]);

  // Reset ticks when video changes
  useEffect(() => {
    reportedTicks.current.clear();
  }, [youtubeVideoId]);

  return (
    <div className="youtube-player-wrapper" style={{ aspectRatio: '16/9', width: '100%', background: '#000' }}>
      <iframe
        ref={iframeRef}
        src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?enablejsapi=1&autoplay=1&rel=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
