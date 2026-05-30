import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { useTheme } from '@/context/ThemeContext';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

export type RegionalDatum = {
  state?: string;
  label?: string;
  region?: string;
  count: number;
};

type Props = {
  regionalData: RegionalDatum[];
  className?: string;
};

const UsaCallActivityMap: React.FC<Props> = ({ regionalData, className = '' }) => {
  const { isLight } = useTheme();
  const [hovered, setHovered] = useState<{ abbr: string; name: string; count: number } | null>(null);

  const { byAbbr, max } = useMemo(() => {
    const byAbbr: Record<string, number> = {};
    let max = 0;
    for (const row of regionalData) {
      const abbr = row.state;
      if (!abbr || abbr === 'OTHER') continue;
      const n = row.count || 0;
      byAbbr[abbr] = (byAbbr[abbr] || 0) + n;
      max = Math.max(max, byAbbr[abbr]);
    }
    return { byAbbr, max: max || 1 };
  }, [regionalData]);

  const emptyFill = isLight ? 'hsl(40 5% 88%)' : 'hsl(150 8% 13%)';
  const emptyHoverFill = isLight ? 'hsl(210 18% 78%)' : 'hsl(156 18% 22%)';
  const borderStroke = isLight ? 'hsl(0 0% 100% / 0.9)' : 'hsl(156 25% 34% / 0.72)';

  const fillFor = (abbr: string) => {
    const c = byAbbr[abbr] || 0;
    if (c <= 0) return emptyFill;
    const t = c / max;
    const o = isLight ? 0.3 + 0.7 * t : 0.42 + 0.58 * t;
    return `hsl(var(--primary) / ${o.toFixed(2)})`;
  };

  const hoverFillFor = (abbr: string) =>
    (byAbbr[abbr] || 0) > 0
      ? 'hsl(var(--primary) / 0.92)'
      : emptyHoverFill;

  return (
    <div
      className={`relative w-full max-w-full min-w-0 overflow-hidden rounded-lg border border-[hsl(var(--border-v))] bg-[hsl(var(--background))]/35 p-2 sm:p-3 [&_.rsm-svg]:pointer-events-none [&_path.rsm-geography]:pointer-events-auto [&_.rsm-svg]:block [&_.rsm-svg]:max-w-full [&_.rsm-svg]:h-auto ${className}`}
    >
      <div className="mx-auto w-full max-w-[min(100%,720px)]">
        <ComposableMap
          projection="geoAlbersUsa"
          width={720}
          height={460}
          projectionConfig={{ scale: 950 }}
          className="w-full max-w-full text-[hsl(var(--foreground))]"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo, idx) => {
                const abbr = geo.properties.stusps as string;
                const count = byAbbr[abbr] || 0;
                const name = geo.properties.name as string;
                const fill = fillFor(abbr);
                const hoverFill = hoverFillFor(abbr);
                return (
                  <Geography
                    key={(geo as { rsmKey?: string }).rsmKey ?? `${abbr}-${idx}`}
                    geography={geo}
                    fill={fill}
                    stroke={borderStroke}
                    strokeWidth={0.55}
                    style={{
                      default: { fill, outline: 'none', transition: 'fill 140ms ease, stroke 140ms ease' },
                      hover: { fill: hoverFill, outline: 'none', stroke: 'hsl(var(--foreground) / 0.75)' },
                      pressed: { fill: hoverFill, outline: 'none' },
                    }}
                    onMouseEnter={() => setHovered({ abbr, name, count })}
                    onMouseLeave={() => setHovered(null)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {hovered && (
        <div className="pointer-events-none absolute left-3 top-3 z-20 max-w-[200px] rounded-md border border-[hsl(var(--border-v))] bg-[hsl(var(--card))]/95 px-2 py-1.5 text-[10px] font-mono shadow-lg shadow-black/20">
          <span className="font-semibold text-[hsl(var(--foreground))]">{hovered.name}</span>
          <span className="text-[hsl(var(--muted-foreground))]"> ({hovered.abbr})</span>
          <div className="mt-0.5 text-[hsl(var(--primary))]">{hovered.count.toLocaleString()} calls</div>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-2">
          <span className="h-2.5 w-8 rounded-sm border border-[hsl(var(--border-v))]" style={{ background: emptyFill }} />
          <span className="h-2.5 w-8 rounded-sm" style={{ background: 'hsl(var(--primary) / 0.48)' }} />
          <span className="h-2.5 w-8 rounded-sm" style={{ background: 'hsl(var(--primary) / 0.92)' }} />
          <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">Low to high call volume</span>
        </div>
        <p className="text-center text-[9px] font-mono leading-snug text-[hsl(var(--muted-foreground))] sm:text-right">
          Unmapped numbers appear as Other / international.
        </p>
      </div>
    </div>
  );
};

export default UsaCallActivityMap;
