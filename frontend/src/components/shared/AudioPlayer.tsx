import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

export type TranscriptLine = { speaker: string; text: string };

interface AudioPlayerProps {
  className?: string;
  /** Optional call recording URL (e.g. from API). When set, HTML audio is used. */
  src?: string | null;
  /** When no `src`, transcript is read aloud via the browser speech engine. */
  transcript?: TranscriptLine[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ className = '', src, transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const ttsStartRef = useRef<number>(0);
  const ttsDurationRef = useRef<number>(0);

  const hasAudio = Boolean(src?.trim());
  const hasTranscript = Boolean(transcript?.length);

  const spokenText = useMemo(() => {
    if (!transcript?.length) return '';
    return transcript.map((l) => `${l.speaker}: ${l.text}`).join('\n');
  }, [transcript]);

  const estimatedTtsMs = useMemo(() => {
    if (!spokenText) return 8000;
    return Math.min(180_000, Math.max(5_000, spokenText.length * 42));
  }, [spokenText]);

  const waveformBars = useMemo(() => {
    const seed = spokenText.length + (transcript?.length ?? 0);
    return Array.from({ length: 40 }, (_, i) => {
      const h = 20 + Math.sin(i * 0.5 + seed * 0.01) * 28 + ((seed + i * 3) % 18);
      return Math.max(12, Math.min(78, h));
    });
  }, [spokenText, transcript?.length]);

  const clearProgressTimer = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = undefined;
    }
  };

  const stopTts = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    clearProgressTimer();
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const stopHtmlAudio = useCallback(() => {
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
    clearProgressTimer();
    setIsPlaying(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !hasAudio) return;

    el.load();

    const onTime = () => {
      if (!el.duration || Number.isNaN(el.duration)) return;
      setProgress((el.currentTime / el.duration) * 100);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      clearProgressTimer();
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => {
      setIsPlaying(false);
      clearProgressTimer();
    };

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [hasAudio, src]);

  useEffect(() => {
    return () => {
      stopTts();
      stopHtmlAudio();
    };
  }, [stopTts, stopHtmlAudio]);

  const startTtsProgress = () => {
    clearProgressTimer();
    ttsStartRef.current = Date.now();
    ttsDurationRef.current = estimatedTtsMs;
    setProgress(0);
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - ttsStartRef.current;
      const p = Math.min(99.5, (elapsed / ttsDurationRef.current) * 100);
      setProgress(p);
    }, 120);
  };

  const playTts = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      toast.error('Speech playback is not supported in this browser.');
      return;
    }
    if (!spokenText.trim()) {
      toast.message('Nothing to speak for this transcript.');
      return;
    }
    window.speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(spokenText);
    u.rate = 0.95;
    u.pitch = 1;
    const voices = window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('en'));
    if (voices.length) u.voice = voices[Math.min(voices.length - 1, 3)];

    u.onstart = () => {
      setIsPlaying(true);
      startTtsProgress();
    };
    u.onend = () => {
      clearProgressTimer();
      setProgress(100);
      setIsPlaying(false);
      setTimeout(() => setProgress(0), 400);
    };
    u.onerror = (ev) => {
      clearProgressTimer();
      setIsPlaying(false);
      setProgress(0);
      // Stopping playback calls cancel(), which fires "canceled". Starting a new utterance can fire "interrupted" on the previous one — not user-facing errors.
      const code = (ev as SpeechSynthesisErrorEvent).error;
      if (code === 'canceled' || code === 'interrupted') return;
      toast.error('Could not play transcript audio.');
    };

    window.speechSynthesis.speak(u);
  };

  const togglePlay = () => {
    if (hasAudio) {
      const el = audioRef.current;
      if (!el) return;
      if (isPlaying) {
        el.pause();
        clearProgressTimer();
        setIsPlaying(false);
      } else {
        void el.play().catch((err: any) => {
          console.error('Audio playback error:', err);
          let friendlyError = 'Could not play recording.';
          if (err?.name === 'NotAllowedError') {
            friendlyError = 'Browser blocked playback. Please interact with the page first.';
          } else if (err?.name === 'NotSupportedError') {
            friendlyError = 'Recording not found or format not supported.';
          } else if (err?.message && err.message.includes('supported source')) {
            friendlyError = 'Recording not found or unavailable.';
          } else {
            friendlyError = 'Recording not found or unavailable.';
          }
          toast.error(friendlyError);
          setIsPlaying(false);
        });
      }
      return;
    }

    if (hasTranscript) {
      if (isPlaying) {
        stopTts();
      } else {
        playTts();
      }
      return;
    }

    toast.message('No recording or transcript to play.');
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const warm = () => window.speechSynthesis.getVoices();
    warm();
    window.speechSynthesis.addEventListener('voiceschanged', warm);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', warm);
  }, []);

  const disabled = !hasAudio && !hasTranscript;

  return (
    <div className={`flex items-center gap-3 bg-[hsl(var(--muted))] rounded-lg p-3 ${className}`}>
      {hasAudio && (
        <audio 
          ref={audioRef} 
          src={src || undefined} 
          preload="metadata" 
          className="hidden" 
          onError={(e) => {
            console.error("Audio element error:", e.currentTarget.error);
            const err = e.currentTarget.error;
            let msg = 'Could not load recording.';
            if (err) {
              switch (err.code) {
                case 1: msg = 'Playback was aborted.'; break;
                case 2: msg = 'Network error occurred while loading recording.'; break;
                case 3: msg = 'Recording format is not supported.'; break;
                case 4: msg = 'Recording not found or unavailable.'; break;
              }
            }
            toast.error(msg);
          }}
        />
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={togglePlay}
        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      <div className="flex-1 flex items-center gap-0.5 h-10 min-w-0">
        {waveformBars.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-full transition-all duration-200 min-w-[2px]"
            style={{
              height: `${height}%`,
              backgroundColor: i < (progress / 100) * 40 ? 'hsl(var(--primary))' : 'hsl(var(--border-v))',
              opacity: isPlaying ? 0.85 : 0.45,
            }}
          />
        ))}
      </div>
      <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] flex-shrink-0 w-16 text-right">
        {disabled ? '—' : isPlaying ? (hasAudio ? 'Playing' : 'Speaking') : 'Ready'}
      </span>
    </div>
  );
};

export default AudioPlayer;
