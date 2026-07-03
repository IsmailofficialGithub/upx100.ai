export function CampaignDashboardPreview() {
  const kpis = [
    { label: 'Calls Today', val: '847', delta: '▲ 12.4% vs avg' },
    { label: 'Meetings Booked', val: '23', delta: '▲ 8 vs yesterday' },
    { label: 'Pipeline Generated', val: '$487K', delta: '▲ $94K WoW' },
    { label: 'SDR Hours Saved', val: '187', delta: '≈ $9,350 saved' },
  ];

  const funnel = [
    { label: 'Contacts', pct: 100, val: '4,820' },
    { label: 'Dialed', pct: 82, val: '3,952' },
    { label: 'Connected', pct: 38, val: '1,831' },
    { label: 'Engaged', pct: 18, val: '867' },
    { label: 'Qualified', pct: 7, val: '341' },
    { label: 'Booked', pct: 3, val: '142' },
  ];

  return (
    <div className="bg-[#f5f5f3] text-[#0a0a0a] rounded-b-xl overflow-hidden text-[13px]">
      <div className="px-4 py-3 border-b border-[#e5e5e2] flex justify-between items-center bg-white">
        <div>
          <div className="font-bold text-[15px]">Q4 Outbound Campaign · NexGen IT Solutions</div>
          <div className="text-[11px] text-[#666]">Mid-Market IT MSP · Dallas-Fort Worth</div>
        </div>
        <div className="font-mono text-[10px] text-[#999] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00b86b] animate-pulse" />
          Sample dashboard
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-[#e5e5e2] rounded-lg p-3.5">
            <div className="font-mono text-[9px] uppercase text-[#999] tracking-wide mb-1.5">{k.label}</div>
            <div className="font-mono text-2xl font-bold">{k.val}</div>
            <div className="font-mono text-[10px] text-[#00b86b] font-semibold mt-1">{k.delta}</div>
          </div>
        ))}
      </div>
      <div className="px-3 pb-3">
        <div className="bg-white border border-[#e5e5e2] rounded-lg p-4">
          <div className="text-xs font-semibold mb-3">Campaign Funnel · Last 7 Days</div>
          <div className="space-y-1.5">
            {funnel.map((row) => (
              <div key={row.label} className="flex items-center gap-2.5 text-[11px]">
                <span className="w-[72px] text-[#666]">{row.label}</span>
                <div className="flex-1 h-[22px] bg-[#f0f0ed] rounded overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00b86b] to-[#00d97c] rounded" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="font-mono font-semibold w-12 text-right">{row.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
