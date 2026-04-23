import React, { useState, useEffect } from 'react';
import { tickerMessages } from '@/data/mockData';

const LiveTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % tickerMessages.length);
        setFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[hsl(var(--card))] border-b border-[hsl(var(--border-v))]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <div className={`text-xs font-mono transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[hsl(var(--muted-foreground))]">LIVE</span>
        <span className="text-[hsl(var(--foreground))] ml-2">{tickerMessages[index]}</span>
      </div>
    </div>
  );
};

export default LiveTicker;
