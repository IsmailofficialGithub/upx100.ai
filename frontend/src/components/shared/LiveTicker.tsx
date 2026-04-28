import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

const LiveTicker: React.FC = () => {
  const [messages, setMessages] = useState<string[]>(['System initialized and tracking live events...']);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const fetchLiveEvents = async () => {
    try {
      const [callsRes, leadsRes] = await Promise.all([
        api.get('/call-logs?limit=5'),
        api.get('/leads?limit=5')
      ]);
      
      const calls = callsRes.data.data || [];
      const leads = leadsRes.data.data || [];
      
      const newMessages: string[] = [];
      calls.forEach((c: any) => {
        const duration = c.duration_sec ? `(${c.duration_sec}s)` : '';
        const status = c.status === 'success' ? 'Completed' : c.status;
        newMessages.push(`${status} call with ${c.customer_number || 'Unknown'} ${duration}`);
      });
      
      leads.forEach((l: any) => {
        newMessages.push(`New Lead Captured: ${l.name} (${l.status})`);
      });

      if (newMessages.length > 0) {
        setMessages(newMessages.sort(() => 0.5 - Math.random()));
      }
    } catch (err) {
      console.error('Failed to fetch live events for ticker', err);
    }
  };

  useEffect(() => {
    fetchLiveEvents();
    const pollInterval = setInterval(fetchLiveEvents, 30000); // refresh every 30s
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 8000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[hsl(var(--card))] border-b border-[hsl(var(--border-v))]">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <div className={`text-xs font-mono transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-[hsl(var(--muted-foreground))]">LIVE</span>
        <span className="text-[hsl(var(--foreground))] ml-2">{messages[index]}</span>
      </div>
    </div>
  );
};

export default LiveTicker;
