import React, { useState, useRef } from 'react';
import { scripts, voiceConfig } from '@/data/mockData';
import StatusBadge from '@/components/shared/StatusBadge';
import { Upload, Download, Play, FileText } from 'lucide-react';

type ScriptTag = 'DISCLOSURE' | 'PITCH' | 'QUALIFY' | 'VALUE' | 'CLOSE';

const tagColors: Record<ScriptTag, string> = {
  DISCLOSURE: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  PITCH: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  QUALIFY: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  VALUE: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  CLOSE: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const EngineView: React.FC = () => {
  const [scriptTab, setScriptTab] = useState<'outbound' | 'inbound'>('outbound');
  const [scriptChange, setScriptChange] = useState('');
  const [csvData, setCsvData] = useState<Array<{ name: string; company: string; title: string; email: string }> | null>(null);
  const [csvFileName, setCsvFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentScript = scripts[scriptTab];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      processCSV(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCSV(file);
  };

  const processCSV = (file: File) => {
    setCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim());
      const parsed = lines.slice(1).map(line => {
        const cols = line.split(',');
        return {
          name: cols[0]?.trim() || '',
          company: cols[1]?.trim() || '',
          title: cols[2]?.trim() || '',
          email: cols[3]?.trim() || '',
        };
      }).filter(r => r.name);
      setCsvData(parsed.slice(0, 10));
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Scripts */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Campaign Scripts</h3>

        <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5 w-fit mb-4">
          {(['outbound', 'inbound'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setScriptTab(tab)}
              className={`px-4 py-1.5 rounded-md text-[11px] font-mono font-semibold uppercase transition-colors ${
                scriptTab === tab
                  ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              {tab === 'outbound' ? 'Outbound Cold' : 'Inbound Triage'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {currentScript.map((line) => (
            <div key={line.id} className="flex gap-3 p-3 bg-[hsl(var(--muted))] rounded-lg border border-[hsl(var(--border-v))]">
              <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold border h-fit ${tagColors[line.tag as ScriptTag]}`}>
                {line.tag}
              </span>
              <p className="text-xs text-[hsl(var(--foreground))] leading-relaxed">{line.text}</p>
            </div>
          ))}
        </div>

        {/* Script Change Request */}
        <div className="mt-4 p-4 border border-[hsl(var(--border-v))] rounded-lg bg-[hsl(var(--muted))]/30">
          <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Request Script Change</p>
          <textarea
            value={scriptChange}
            onChange={e => setScriptChange(e.target.value)}
            placeholder="Describe the change you'd like to make to the script..."
            className="w-full h-20 px-3 py-2 bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-lg text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]/50 focus:outline-none focus:border-[hsl(var(--primary))]/50 resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => { setScriptChange(''); alert('Script change request submitted!'); }}
              disabled={!scriptChange.trim()}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>

      {/* Target Accounts CSV Upload */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))]">Target Accounts</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors">
            <Download size={14} /> Download Template
          </button>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5'
              : 'border-[hsl(var(--border-v))] hover:border-[hsl(var(--border-v))] hover:bg-[hsl(var(--muted))]'
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
          <Upload size={24} className="mx-auto mb-2 text-[hsl(var(--muted-foreground))]" />
          <p className="text-sm text-[hsl(var(--foreground))]">Drop CSV file here or click to browse</p>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">Name, Company, Title, Email columns required</p>
        </div>

        {/* Preview Table */}
        {csvData && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} className="text-[hsl(var(--primary))]" />
              <span className="text-xs font-mono text-[hsl(var(--foreground))]">{csvFileName}</span>
              <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">({csvData.length} rows)</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[hsl(var(--border-v))]">
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Name</th>
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Company</th>
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Title</th>
                    <th className="text-left py-2 px-2 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row, idx) => (
                    <tr key={idx} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.name}</td>
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.company}</td>
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.title}</td>
                      <td className="py-2 px-2 text-[hsl(var(--foreground))]">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        <div className="mt-4">
          <p className="text-[10px] font-mono uppercase text-[hsl(var(--muted-foreground))] mb-2 tracking-wider">Recent Submissions</p>
          <div className="space-y-2">
            {[
              { name: 'Q3_enterprise_targets.csv', date: 'Jul 20, 2025', status: 'deployed' as const, count: 142 },
              { name: 'healthcare_leads_july.csv', date: 'Jul 15, 2025', status: 'pending' as const, count: 89 },
              { name: 'fintech_outbound.csv', date: 'Jul 10, 2025', status: 'approved' as const, count: 210 },
            ].map((sub, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 bg-[hsl(var(--muted))] rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-[hsl(var(--muted-foreground))]" />
                  <div>
                    <p className="text-xs text-[hsl(var(--foreground))]">{sub.name}</p>
                    <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">{sub.date} · {sub.count} accounts</p>
                  </div>
                </div>
                <StatusBadge status={sub.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Voice Configuration */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border-v))] rounded-xl p-4">
        <h3 className="text-sm font-display font-semibold text-[hsl(var(--foreground))] mb-4">Voice Configuration</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[hsl(var(--border-v))]">
                <th className="text-left py-2 px-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Campaign</th>
                <th className="text-left py-2 px-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Phone Number</th>
                <th className="text-left py-2 px-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Voice Persona</th>
                <th className="text-right py-2 px-3 font-mono text-[10px] uppercase text-[hsl(var(--muted-foreground))]">Preview</th>
              </tr>
            </thead>
            <tbody>
              {voiceConfig.map(vc => (
                <tr key={vc.id} className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">
                  <td className="py-3 px-3 text-[hsl(var(--foreground))]">{vc.campaign}</td>
                  <td className="py-3 px-3 font-mono text-[hsl(var(--foreground))]">{vc.phone}</td>
                  <td className="py-3 px-3">
                    <select
                      defaultValue={vc.voice}
                      className="bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] rounded px-2 py-1 text-[hsl(var(--foreground))] text-xs focus:outline-none focus:border-[hsl(var(--primary))]/50"
                    >
                      <option>Professional Female</option>
                      <option>Professional Male</option>
                      <option>Warm Female</option>
                      <option>Warm Male</option>
                      <option>Energetic Female</option>
                      <option>Energetic Male</option>
                    </select>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="p-1.5 rounded-md hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors">
                      <Play size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Voice Clone Upload */}
        <div className="mt-4 p-4 border border-dashed border-[hsl(var(--border-v))] rounded-lg text-center">
          <p className="text-xs text-[hsl(var(--foreground))]">Upload a voice sample to create a custom AI voice clone</p>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))] mt-1">MP3 or WAV, 30 seconds minimum</p>
          <button className="mt-2 px-4 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/80 transition-colors">
            Choose File
          </button>
        </div>
      </div>
    </div>
  );
};

export default EngineView;
