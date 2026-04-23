import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, Moon, Sun, Bell, Download, Pause, Play, LogOut } from 'lucide-react';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ title, onMenuClick }) => {
  const { toggleMode, isLight } = useTheme();
  const { isAuthenticated, logout, login } = useAuth();
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleLogin = () => {
    login('cm');
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-[52px] bg-[hsl(var(--card))]/80 backdrop-blur-xl border-b border-[hsl(var(--border-v))] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-md hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                onClick={toggleMode}
                className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                title="Toggle theme"
              >
                {isLight ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              <button className="relative p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[hsl(var(--primary))] rounded-full" />
              </button>

              <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors">
                <Download size={14} />
                <span>Export</span>
              </button>

              <button
                onClick={() => setShowPauseModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isPaused
                    ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                    : 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25'
                }`}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
                <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleMode}
                className="p-2 rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
              >
                {isLight ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-opacity"
              >
                Login
              </button>
            </>
          )}
        </div>
      </header>

      {/* Pause/Resume Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-display font-semibold text-[hsl(var(--foreground))] mb-2">
              {isPaused ? 'Resume Campaign' : 'Pause Campaign'}
            </h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
              {isPaused
                ? 'Are you sure you want to resume all active campaigns?'
                : 'Select a reason for pausing the campaign:'}
            </p>

            {!isPaused && (
              <div className="space-y-2 mb-4">
                {['Too many meetings', 'Staffing capacity', 'Company holiday', 'Budget review', 'Other'].map(reason => (
                  <button
                    key={reason}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors"
                    onClick={() => {
                      setIsPaused(true);
                      setShowPauseModal(false);
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            )}

            {isPaused && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsPaused(false);
                    setShowPauseModal(false);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90"
                >
                  Resume
                </button>
                <button
                  onClick={() => setShowPauseModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
                >
                  Cancel
                </button>
              </div>
            )}

            {!isPaused && (
              <button
                onClick={() => setShowPauseModal(false)}
                className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
