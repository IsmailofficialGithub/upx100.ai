import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

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

  const fillFor = (abbr: string) => {
    const c = byAbbr[abbr] || 0;
    if (c <= 0) return 'hsl(var(--muted))';
    const t = c / max;
    const o = 0.22 + 0.78 * t;
    return `hsl(var(--primary) / ${o.toFixed(2)})`;
  };

  return (
    <div
      className={`relative w-full max-w-full min-w-0 overflow-hidden rounded-lg [&_.rsm-svg]:pointer-events-none [&_path.rsm-geography]:pointer-events-auto [&_.rsm-svg]:block [&_.rsm-svg]:max-w-full [&_.rsm-svg]:h-auto ${className}`}
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
                return (
                  <Geography
                    key={(geo as { rsmKey?: string }).rsmKey ?? `${abbr}-${idx}`}
                    geography={geo}
                    fill={fillFor(abbr)}
                    stroke="hsl(var(--border-v))"
                    strokeWidth={0.35}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', filter: 'brightness(1.12)' },
                      pressed: { outline: 'none' },
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
        <div className="pointer-events-none absolute left-2 top-2 z-20 rounded-md border border-[hsl(var(--border-v))] bg-[hsl(var(--card))]/95 px-2 py-1.5 text-[10px] font-mono shadow-md max-w-[200px]">
          <span className="font-semibold text-[hsl(var(--foreground))]">{hovered.name}</span>
          <span className="text-[hsl(var(--muted-foreground))]"> ({hovered.abbr})</span>
          <div className="text-[hsl(var(--primary))] mt-0.5">{hovered.count.toLocaleString()} calls</div>
        </div>
      )}
      <p className="text-[9px] font-mono text-[hsl(var(--muted-foreground))] mt-2 text-center leading-snug">
        Shading from call logs (NANP area code → state). Unmapped numbers appear as “Other / international” in the list.
      </p>
    </div>
  );
};

export default UsaCallActivityMap;
