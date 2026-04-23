import React, { useState } from 'react';
import { competitors, faqData } from '@/data/mockData';
import { Check, X, Minus, ChevronDown, ChevronUp, MessageSquare, Tag } from 'lucide-react';

const PlaybookView: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqFilter, setFaqFilter] = useState<string>('all');

  const allTags = Array.from(new Set(faqData.flatMap(f => f.tags)));
  const filteredFaq = faqFilter === 'all' ? faqData : faqData.filter(f => f.tags.includes(faqFilter));

  return (
    <div className="space-y-6">
      {/* Competitive Intelligence */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Competitive Intelligence</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {competitors.map((comp, i) => (
            <div key={i} className="border border-[hsl(var(--border-v))] rounded-xl overflow-hidden">
              {/* VS Header */}
              <div className="p-3 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border-v))]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[hsl(var(--primary))]">VS</span>
                  <span className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">{comp.name}</span>
                </div>
              </div>

              {/* Feature Comparison */}
              <div className="divide-y divide-[hsl(var(--border))]">
                {comp.features.map((feature, fi) => {
                  const isPrice = feature.label === 'Price (monthly)';
                  return (
                    <div key={fi} className="flex items-center px-3 py-2.5">
                      <span className="flex-1 text-[11px] text-[hsl(var(--foreground))]">{feature.label}</span>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center w-10">
                          {isPrice ? (
                            <span className="text-[10px] font-mono font-semibold text-emerald-400">{feature.us}</span>
                          ) : (
                            <>
                              {feature.us === true ? (
                                <Check size={14} className="text-emerald-400" />
                              ) : feature.us === false ? (
                                <X size={14} className="text-red-400" />
                              ) : (
                                <Minus size={14} className="text-[hsl(var(--muted-foreground))]" />
                              )}
                            </>
                          )}
                          <span className="text-[8px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5">US</span>
                        </div>
                        <div className="flex flex-col items-center w-10">
                          {isPrice ? (
                            <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{feature.them}</span>
                          ) : (
                            <>
                              {feature.them === true ? (
                                <Check size={14} className="text-[hsl(var(--muted-foreground))]" />
                              ) : feature.them === false ? (
                                <X size={14} className="text-red-400" />
                              ) : (
                                <Minus size={14} className="text-[hsl(var(--muted-foreground))]" />
                              )}
                            </>
                          )}
                          <span className="text-[8px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5">THEM</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">FAQ</h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFaqFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-colors ${
                faqFilter === 'all'
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFaqFilter(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-colors ${
                  faqFilter === tag
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredFaq.map((item, i) => {
            const isExpanded = expandedFaq === i;
            return (
              <div key={i} className="border border-[hsl(var(--border-v))] rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[hsl(var(--muted))] transition-colors"
                  onClick={() => setExpandedFaq(isExpanded ? null : i)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <MessageSquare size={14} className="text-[hsl(var(--primary))] flex-shrink-0" />
                    <span className="text-sm font-medium text-[hsl(var(--foreground))]">{item.q}</span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" /> : <ChevronDown size={16} className="text-[hsl(var(--muted-foreground))] flex-shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[hsl(var(--border))]">
                    <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed mt-3">{item.a}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                        <Tag size={10} /> AI Talking Points:
                      </span>
                      {item.tags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] text-[9px] font-mono font-semibold rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlaybookView;
