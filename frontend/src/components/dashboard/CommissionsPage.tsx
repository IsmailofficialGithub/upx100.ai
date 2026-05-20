import React, { useEffect, useState } from 'react';
import AdminDataView from './AdminDataView';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrencyForSource } from '@/lib/currency';
import StatusBadge from '@/components/shared/StatusBadge';
import api from '@/lib/api';

type Props = {
  title: string;
  emptyMessage: string;
  /** Partner portal: no GCC tenant scope. */
  partnerMode?: boolean;
};

const CommissionsPage: React.FC<Props> = ({ title, emptyMessage, partnerMode }) => {
  const { isGCC } = useAuth();
  const gccScope = useGccTenantScope();
  const selectedScopeOrg =
    !partnerMode && gccScope.scopeOrgId !== 'all'
      ? gccScope.organizations.find((org) => org.id === gccScope.scopeOrgId)
      : null;

  const [ledgerUnavailable, setLedgerUnavailable] = useState(false);

  useEffect(() => {
    if (!isGCC || partnerMode) {
      setLedgerUnavailable(false);
      return;
    }
    let cancelled = false;
    api
      .get('/commissions')
      .then((res) => {
        if (!cancelled && res.data?.meta?.commissions_available === false) {
          setLedgerUnavailable(true);
        } else if (!cancelled) {
          setLedgerUnavailable(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLedgerUnavailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isGCC, partnerMode, gccScope.scopeOrgId]);

  const currencySourceForRow = (row: { organizations?: { country_code?: string } }) =>
    row?.organizations?.country_code ? row : selectedScopeOrg || row;

  const scopedEmptyMessage = selectedScopeOrg
    ? `No commission records for ${selectedScopeOrg.name} yet. New clients only show earnings after payments are reconciled for that organization.`
    : emptyMessage;

  return (
    <div className="space-y-3">
      {ledgerUnavailable && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[11px] text-amber-200/90 leading-relaxed max-w-[1400px] mx-auto">
          Commission data is not loaded in this environment (migrations not applied). You are not seeing live per-client
          earnings — run <span className="font-mono">11_commissions.sql</span> on Supabase to enable the ledger.
        </div>
      )}
      <AdminDataView
        title={title}
        endpoint="/commissions"
        emptyMessage={scopedEmptyMessage}
        columns={[
          ...(!selectedScopeOrg
            ? [{ key: 'organizations', label: 'Client', render: (val: { name?: string }) => val?.name ?? '—' }]
            : []),
          { key: 'period', label: 'Period' },
          {
            key: 'collected_mrr',
            label: 'Collected MRR',
            render: (val: number, row: { organizations?: { country_code?: string } }) =>
              formatCurrencyForSource(val, currencySourceForRow(row)),
          },
          { key: 'rate', label: 'Rate (%)', render: (val: number) => `${val}%` },
          {
            key: 'amount',
            label: 'Commission',
            render: (val: number, row: { organizations?: { country_code?: string } }) =>
              formatCurrencyForSource(val, currencySourceForRow(row)),
          },
          {
            key: 'status',
            label: 'Status',
            render: (val: string) => (
              <StatusBadge status={val as 'pending' | 'paid' | 'at_risk' | 'approved'} />
            ),
          },
        ]}
      />
    </div>
  );
};

export default CommissionsPage;
