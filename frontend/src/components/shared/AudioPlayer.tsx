import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  className?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return p + 0.5;
        });
      }, 100);
    }
  };

  const waveformBars = Array.from({ length: 40 }, (_, i) => {
    const height = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
    return Math.max(10, Math.min(80, height));
  });

  return (
    <div className={`flex items-center gap-3 bg-[hsl(var(--muted))] rounded-lg p-3 ${className}`}>
      <button
        onClick={togglePlay}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-0.5 h-10">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-200"
            style={{
              height: `${height}%`,
              backgroundColor: i < (progress / 100) * 40
                ? 'hsl(var(--primary))'
                : 'hsl(var(--border-v))',
              opacity: isPlaying ? 0.8 : 0.5,
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] flex-shrink-0">
        {isPlaying ? 'Playing' : 'Paused'}
      </span>
    </div>
  );
};

export default AudioPlayer;
