import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { parseNullableDate } from '@/lib/dateFormat';

type JsPdfWithTable = jsPDF & { lastAutoTable?: { finalY: number } };

export interface MonthlyExportPayload {
  period: { from: string; to: string };
  summary: {
    totalCalls: number;
    totalLeads: number;
    successMeetings: number;
    totalDurationSec: number;
    totalDurationLabel: string;
    callStatusBreakdown: Record<string, number>;
  };
  callLogs: Array<{
    id: string;
    createdAt: string | null;
    status: string;
    durationSec: number | null;
    caller: string | null;
    agent: string;
    organization: string;
  }>;
  leads: Array<{
    id: string;
    createdAt: string | null;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    company: string;
    meetingTime: string | null;
    agent: string;
    organization: string;
  }>;
  adminSnapshot: {
    organizations: number;
    users: number;
    calls: number;
    leads: number;
    agents: number;
    pendingScripts: number;
    pendingUploads: number;
    pendingClones: number;
  } | null;
  meta: {
    role: string;
    email: string;
    userId: string;
    organizationName: string | null;
    includeAdminSnapshot: boolean;
  };
}

function clip(s: string | null | undefined, max = 40): string {
  if (s == null || s === '') return '—';
  const t = String(s);
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function tableBottom(doc: jsPDF, fallback: number): number {
  const d = doc as JsPdfWithTable;
  return (d.lastAutoTable?.finalY ?? fallback) + 8;
}

function exportDate(value: unknown): string {
  const date = parseNullableDate(value);
  return date ? date.toISOString().replace('T', ' ').slice(0, 19) : 'â€”';
}

export function downloadMonthlyExportPdf(payload: MonthlyExportPayload): void {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  let y = 16;

  doc.setFontSize(15);
  doc.text('UP100X — Monthly activity report', 14, y);
  y += 7;
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 70);
  const from = new Date(payload.period.from).toLocaleString();
  const to = new Date(payload.period.to).toLocaleString();
  doc.text(`Period: ${from} — ${to}`, 14, y);
  y += 5;
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, y);
  y += 5;
  doc.text(`Role: ${payload.meta.role}   User: ${clip(payload.meta.email, 48)}`, 14, y);
  if (payload.meta.organizationName) {
    y += 5;
    doc.text(`Organization: ${clip(payload.meta.organizationName, 72)}`, 14, y);
  }
  doc.setTextColor(0, 0, 0);
  y += 9;

  autoTable(doc, {
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Calls in period', String(payload.summary.totalCalls)],
      ['New leads in period', String(payload.summary.totalLeads)],
      ['Meetings (leads marked success)', String(payload.summary.successMeetings)],
      ['Total call duration', payload.summary.totalDurationLabel],
    ],
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [55, 65, 120] },
  });
  y = tableBottom(doc, y);

  const statusRows = Object.entries(payload.summary.callStatusBreakdown).sort((a, b) => b[1] - a[1]);
  if (statusRows.length) {
    doc.setFontSize(10);
    doc.text('Call status mix (same period)', 14, y);
    y += 5;
    autoTable(doc, {
      startY: y,
      head: [['Status', 'Count']],
      body: statusRows.map(([k, v]) => [clip(k, 32), String(v)]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [80, 80, 90] },
    });
    y = tableBottom(doc, y);
  }

  if (payload.adminSnapshot) {
    doc.setFontSize(10);
    doc.text('Scoped snapshot (totals — same visibility as admin stats)', 14, y);
    y += 5;
    const a = payload.adminSnapshot;
    autoTable(doc, {
      startY: y,
      head: [['Measure', 'Count']],
      body: [
        ['Organizations', String(a.organizations)],
        ['Users', String(a.users)],
        ['Calls (all time, scoped)', String(a.calls)],
        ['Leads (all time, scoped)', String(a.leads)],
        ['Agents', String(a.agents)],
        ['Pending script requests', String(a.pendingScripts)],
        ['Pending target uploads', String(a.pendingUploads)],
        ['Voice clones submitted', String(a.pendingClones)],
      ],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [45, 120, 90] },
    });
    y = tableBottom(doc, y);
  }

  doc.addPage();
  y = 14;
  doc.setFontSize(11);
  doc.text('Call logs — period window (up to 400 rows)', 14, y);
  y += 6;
  const callBody = payload.callLogs.map((c) => [
    clip(exportDate(c.createdAt), 19),
    clip(c.status, 14),
    String(Math.round(c.durationSec ?? 0)),
    clip(c.caller, 22),
    clip(c.agent, 18),
    clip(c.organization, 22),
  ]);
  autoTable(doc, {
    startY: y,
    head: [['When (UTC)', 'Status', 'Sec', 'Caller', 'Agent', 'Org']],
    body: callBody.length ? callBody : [['—', 'No rows', '', '', '', '']],
    styles: { fontSize: 7, cellPadding: 1.2 },
    headStyles: { fillColor: [50, 50, 58] },
  });

  doc.addPage();
  y = 14;
  doc.setFontSize(11);
  doc.text('Leads — period window (up to 400 rows)', 14, y);
  y += 6;
  const leadBody = payload.leads.map((l) => [
    clip(exportDate(l.createdAt), 19),
    clip(l.name, 20),
    clip(l.email, 30),
    clip(l.phone, 16),
    clip(l.status, 12),
    clip(l.organization, 18),
  ]);
  autoTable(doc, {
    startY: y,
    head: [['When (UTC)', 'Name', 'Email', 'Phone', 'Status', 'Org']],
    body: leadBody.length ? leadBody : [['—', 'No rows', '', '', '', '']],
    styles: { fontSize: 7, cellPadding: 1.2 },
    headStyles: { fillColor: [50, 50, 58] },
  });

  const slug = new Date().toISOString().slice(0, 10);
  doc.save(`up100x-monthly-report-${slug}.pdf`);
}
