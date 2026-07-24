import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useGccTenantScope } from '@/context/GccTenantScopeContext';
// import api from '@/lib/api';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Cpu,
  BookOpen,
  X,
  Users,
  Building2,
  Phone,
  FileText,
  Shield,
  Rocket,
  Banknote,
  CreditCard,
  PhoneOutgoing,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type GccNavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: number;
  /** When set, item is hidden unless user has that channel access */
  channel?: 'inbound' | 'outbound';
};

type GccNavGroup = { label: string; items: GccNavItem[] };

const GCC_ADMIN_NAV: GccNavGroup[] = [
  {
    label: 'Operations',
    items: [
      { label: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'All Clients', path: '/admin/organizations', icon: Building2 },
      { label: 'Live Calls', path: '/admin/call-logs', icon: Phone },
      { label: 'HITL Queue', path: '/admin/hitl', icon: BarChart3 },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { label: 'Compliance Monitor', path: '/admin/compliance', icon: Shield },
      { label: 'Client Users', path: '/admin/user', icon: Users },
      { label: 'Sales Partners', path: '/admin/sales-partners', icon: Users },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Revenue & Payments', path: '/admin/commissions', icon: BarChart3 },
      { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'AI Agent Management', path: '/admin/agents', icon: Cpu },
      { label: 'Phone Numbers', path: '/admin/phone-numbers', icon: Phone },
      { label: 'Leads', path: '/admin/leads', icon: FileText },
      { label: 'Outbound Targets', path: '/admin/outbound-targets', icon: FileText, channel: 'outbound' },
    ],
  },
];

const GCC_REVIEWER_NAV: GccNavGroup[] = [
  {
    label: 'Operations',
    items: [
      { label: 'Command Center', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'All Clients', path: '/admin/organizations', icon: Building2 },
      { label: 'Live Calls', path: '/admin/call-logs', icon: Phone },
      { label: 'HITL Queue', path: '/admin/hitl', icon: BarChart3 },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { label: 'Compliance Monitor', path: '/admin/compliance', icon: Shield },
      { label: 'Client Users', path: '/admin/user', icon: Users },
      { label: 'Sales Partners', path: '/admin/sales-partners', icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'AI Agent Management', path: '/admin/agents', icon: Cpu },
      { label: 'Phone Numbers', path: '/admin/phone-numbers', icon: Phone },
      { label: 'Outbound Targets', path: '/admin/outbound-targets', icon: FileText, channel: 'outbound' },
    ],
  },
];

const PARTNER_PRIMARY_NAV: GccNavGroup[] = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview', path: '/partner/dashboard', icon: LayoutDashboard },
      { label: 'Client Portfolio', path: '/partner/organizations', icon: Building2 },
      { label: 'Onboarding', path: '/partner/calendar', icon: Rocket },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Script Requests', path: '/partner/playbook', icon: BookOpen },
      { label: 'Financials', path: '/partner/commissions', icon: Banknote },
    ],
  },
  {
    label: 'Network',
    items: [
      { label: 'Call Logs', path: '/partner/call-logs', icon: Phone },
      { label: 'Leads', path: '/partner/leads', icon: FileText },
      { label: 'Outbound Targets', path: '/partner/outbound-targets', icon: FileText, channel: 'outbound' },
      { label: 'Client Phone Numbers', path: '/partner/phone-numbers', icon: Phone },
      { label: 'AI Agents', path: '/partner/agents', icon: Cpu },
      { label: 'Team', path: '/partner/team', icon: Users },
    ],
  },
];

const PARTNER_SUB_NAV: GccNavGroup[] = [
  {
    label: 'Operations',
    items: [
      { label: 'Overview', path: '/partner/dashboard', icon: LayoutDashboard },
      { label: 'Client Portfolio', path: '/partner/organizations', icon: Building2 },
      { label: 'Onboarding', path: '/partner/calendar', icon: Rocket },
      { label: 'Financials', path: '/partner/commissions', icon: Banknote },
    ],
  },
  {
    label: 'Network',
    items: [
      { label: 'Call Logs', path: '/partner/call-logs', icon: Phone },
      { label: 'Leads', path: '/partner/leads', icon: FileText },
      { label: 'Outbound Targets', path: '/partner/outbound-targets', icon: FileText, channel: 'outbound' },
      { label: 'Client Phone Numbers', path: '/partner/phone-numbers', icon: Phone },
      { label: 'AI Agents', path: '/partner/agents', icon: Cpu },
      { label: 'Team', path: '/partner/team', icon: Users },
    ],
  },
];

const CLIENT_ADMIN_PORTAL_NAV: GccNavGroup[] = [
  {
    label: 'Campaign',
    items: [
      { label: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
      { label: 'Calendar & Meetings', path: '/client/calendar', icon: CalendarDays },
      { label: 'Call Logs', path: '/client/call-logs', icon: Phone },
      { label: 'Leads', path: '/client/leads', icon: FileText },
      { label: 'Outbound Calling', path: '/client/outbound-targets', icon: PhoneOutgoing, channel: 'outbound' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Script & target uploads', path: '/client/engine', icon: Cpu },
      { label: 'Sales Playbook', path: '/client/playbook', icon: BookOpen },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Phone Numbers', path: '/client/phone-numbers', icon: Phone },
      { label: 'AI Agent Management', path: '/client/agents', icon: Cpu },
      { label: 'Team', path: '/client/team', icon: Users },
      { label: 'Billing & Plans', path: '/client/billing', icon: CreditCard },
    ],
  },
];

const CLIENT_SUB_PORTAL_NAV: GccNavGroup[] = [
  {
    label: 'Campaign',
    items: [
      { label: 'Dashboard', path: '/client/dashboard', icon: LayoutDashboard },
      { label: 'Calendar & Meetings', path: '/client/calendar', icon: CalendarDays },
      { label: 'Call Logs', path: '/client/call-logs', icon: Phone },
      { label: 'Leads', path: '/client/leads', icon: FileText },
      { label: 'Outbound Calling', path: '/client/outbound-targets', icon: PhoneOutgoing, channel: 'outbound' },
    ],
  },
  {
    label: 'Intelligence',
    items: [{ label: 'Sales Playbook', path: '/client/playbook', icon: BookOpen }],
  },
  {
    label: 'Workspace',
    items: [
      { label: 'Phone Numbers', path: '/client/phone-numbers', icon: Phone },
      { label: 'AI Agent Management', path: '/client/agents', icon: Cpu },
      { label: 'Billing & Plans', path: '/client/billing', icon: CreditCard },
    ],
  },
];

type PortalChromeProps = {
  isOpen: boolean;
  onClose: () => void;
  groups: GccNavGroup[];
  pathname: string;
  onNav: (path: string) => void;
  headerTitle: string;
  headerTitleColor: string;
  headerSubtitle: React.ReactNode;
};

function PortalSidebarChrome({
  isOpen,
  onClose,
  groups,
  pathname,
  onNav,
  headerTitle,
  headerTitleColor,
  headerSubtitle,
}: PortalChromeProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`gcc-sidebar fixed top-0 left-0 h-full w-[240px] z-50 flex flex-col transition-transform duration-300 border-r border-[hsl(var(--border))] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-[18px] border-b border-[hsl(var(--border))]">
          <div className="flex items-center gap-2.5 text-[hsl(var(--foreground))]">
            <img src="/logo.png" alt="Q-UP.AI" className="h-12 w-12 object-contain theme-logo" />
            <span className="font-mono font-bold text-sm tracking-tight">Q-UP.AI</span>
          </div>
          <button type="button" onClick={onClose} className="md:hidden text-[hsl(var(--muted-foreground))] p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-5 py-3 border-b border-[hsl(var(--border))]">
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: headerTitleColor }}>
            {headerTitle}
          </div>
          <div className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{headerSubtitle}</div>
        </div>

        <nav className="flex-1 py-2.5 overflow-y-auto custom-scrollbar">
          {groups.map((group) => (
            <div key={group.label} className="mb-1">
              <p className="gcc-nav-group-label">{group.label}</p>
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={`${group.label}-${item.path}-${item.label}`}
                    type="button"
                    onClick={() => onNav(item.path)}
                    className={`gcc-nav-item ${isActive ? 'gcc-nav-item-active' : ''}`}
                  >
                    <Icon size={16} className="shrink-0 opacity-90" />
                    <span className="truncate">{item.label}</span>
                    {item.badge != null && item.badge > 0 && (
                      <span className="gcc-nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="px-5 py-3 border-t border-[hsl(var(--border))] text-[10px] text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-1.5">
            <span className="gcc-tick-dot" />
            <span>Engine active · Built for TCPA / CAN-SPAM</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function filterNavGroupsByChannel(
  groups: GccNavGroup[],
  canInbound: boolean,
  canOutbound: boolean,
): GccNavGroup[] {
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.channel === 'outbound') return canOutbound;
        if (item.channel === 'inbound') return canInbound;
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isUK, currencySymbol } = useTheme();
  const {
    user,
    isGCC,
    isGCCAdmin,
    isGCCReviewer,
    isSP,
    isSPPrimary,
    isClient,
    isClientAdmin,
    canAccessInbound,
    canAccessOutbound,
  } = useAuth();
  const gccScope = useGccTenantScope();
  const rolePrefix = isGCC ? 'admin' : isSP ? 'partner' : 'client';
  const portalSubtitle = isGCCAdmin
    ? 'GCC Admin console'
    : isGCCReviewer
      ? 'GCC Reviewer console'
      : isSP
        ? 'Partner portal'
        : 'Client portal';

  const [hitlBadge, setHitlBadge] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!isGCCAdmin && !isGCCReviewer) {
      setHitlBadge(undefined);
      return;
    }

    let cancelled = false;
    setHitlBadge(undefined);

    import('@/lib/hitlQueueFetch')
      .then(({ fetchPendingHitlCount }) => fetchPendingHitlCount())
      .then((n) => {
        if (!cancelled) setHitlBadge(n > 0 ? n : undefined);
      })
      .catch(() => {
        if (!cancelled) setHitlBadge(undefined);
      });
    const onQueueChange = () => {
      if (!cancelled) {
        import('@/lib/hitlQueueFetch')
          .then(({ fetchPendingHitlCount }) => fetchPendingHitlCount())
          .then((n) => {
            if (!cancelled) setHitlBadge(n > 0 ? n : undefined);
          })
          .catch(() => {
            if (!cancelled) setHitlBadge(undefined);
          });
      }
    };
    window.addEventListener('gcc-hitl-queue-changed', onQueueChange);
    return () => {
      cancelled = true;
      window.removeEventListener('gcc-hitl-queue-changed', onQueueChange);
    };
  }, [isGCCAdmin, isGCCReviewer, gccScope.scopeOrgId]);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const gccNavWithBadges: GccNavGroup[] = React.useMemo(() => {
    if (!isGCCAdmin || hitlBadge === undefined) return GCC_ADMIN_NAV;
    return GCC_ADMIN_NAV.map((g) => ({
      ...g,
      items: g.items.map((item) =>
        item.path === '/admin/hitl' ? { ...item, badge: hitlBadge } : item
      ),
    }));
  }, [isGCCAdmin, hitlBadge]);

  const reviewerNavWithBadges: GccNavGroup[] = React.useMemo(() => {
    if (!isGCCReviewer || hitlBadge === undefined) return GCC_REVIEWER_NAV;
    return GCC_REVIEWER_NAV.map((g) => ({
      ...g,
      items: g.items.map((item) =>
        item.path === '/admin/hitl' ? { ...item, badge: hitlBadge } : item
      ),
    }));
  }, [isGCCReviewer, hitlBadge]);

  const regionMoney = isUK ? `United Kingdom · ${currencySymbol}` : `United States · ${currencySymbol}`;

  if (isGCCAdmin) {
    return (
      <PortalSidebarChrome
        isOpen={isOpen}
        onClose={onClose}
        groups={filterNavGroupsByChannel(gccNavWithBadges, canAccessInbound, canAccessOutbound)}
        pathname={location.pathname}
        onNav={handleNav}
        headerTitle="GCC ADMIN"
        headerTitleColor="var(--gcc-danger)"
        headerSubtitle="God Mode · All Tenants"
      />
    );
  }

  if (isGCCReviewer) {
    return (
      <PortalSidebarChrome
        isOpen={isOpen}
        onClose={onClose}
        groups={filterNavGroupsByChannel(reviewerNavWithBadges, canAccessInbound, canAccessOutbound)}
        pathname={location.pathname}
        onNav={handleNav}
        headerTitle="GCC REVIEWER"
        headerTitleColor="hsl(210 100% 50%)"
        headerSubtitle="HITL Operations · All Tenants"
      />
    );
  }

  if (isSP) {
    const partnerGroups = filterNavGroupsByChannel(
      isSPPrimary ? PARTNER_PRIMARY_NAV : PARTNER_SUB_NAV,
      canAccessInbound,
      canAccessOutbound,
    );
    const partnerSubtitle =
      isSPPrimary ? (
        regionMoney
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-[hsl(210_100%_50%/0.25)] bg-[hsl(210_100%_50%/0.1)] text-[hsl(210_100%_60%)]">
            TEAM
          </span>
          <span>{regionMoney}</span>
        </span>
      );
    return (
      <PortalSidebarChrome
        isOpen={isOpen}
        onClose={onClose}
        groups={partnerGroups}
        pathname={location.pathname}
        onNav={handleNav}
        headerTitle="Sales Partner Portal"
        headerTitleColor="hsl(var(--foreground))"
        headerSubtitle={partnerSubtitle}
      />
    );
  }

  if (isClient) {
    const clientGroups = filterNavGroupsByChannel(
      isClientAdmin ? CLIENT_ADMIN_PORTAL_NAV : CLIENT_SUB_PORTAL_NAV,
      canAccessInbound,
      canAccessOutbound,
    );
    const clientSubtitle =
      isClientAdmin ? (
        <span className="flex flex-wrap items-center gap-1">
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-[hsl(150_100%_50%/0.25)] bg-[hsl(150_100%_50%/0.08)] text-[hsl(150_100%_45%)]">
            ADMIN
          </span>
          <span>{regionMoney}</span>
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1">
          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-[hsl(var(--border-v))] bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
            TEAM
          </span>
          <span>{regionMoney}</span>
        </span>
      );
    return (
      <PortalSidebarChrome
        isOpen={isOpen}
        onClose={onClose}
        groups={clientGroups}
        pathname={location.pathname}
        onNav={handleNav}
        headerTitle={user?.entityName || 'Client workspace'}
        headerTitleColor="hsl(var(--foreground))"
        headerSubtitle={clientSubtitle}
      />
    );
  }

  const navItems = [
    {
      label: 'Dashboard',
      path: `/${rolePrefix}/dashboard`,
      icon: LayoutDashboard,
      group: 'CAMPAIGN',
      roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'],
    },
    {
      label: 'Outbound Targets',
      path: `/${rolePrefix}/outbound-targets`,
      icon: FileText,
      group: 'CAMPAIGN',
      roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'],
      channel: 'outbound' as const,
    },
    {
      label: 'Users',
      path: `/${rolePrefix}/user`,
      icon: Users,
      group: 'MANAGEMENT',
      roles: ['gcc_admin', 'gcc_reviewer'],
    },
    {
      label: 'Team',
      path: `/${rolePrefix}/team`,
      icon: Users,
      group: 'MANAGEMENT',
      roles: ['sp_primary', 'sp_sub', 'client_admin'],
    },
    {
      label: 'Organizations',
      path: `/${rolePrefix}/organizations`,
      icon: Building2,
      group: 'MANAGEMENT',
      roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary'],
    },
    {
      label: 'Phone Numbers',
      path: `/${rolePrefix}/phone-numbers`,
      icon: Phone,
      group: 'MANAGEMENT',
      roles: ['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub'],
    },
    {
      label: 'AI Agent Management',
      path: `/${rolePrefix}/agents`,
      icon: Cpu,
      group: 'MANAGEMENT',
      roles: ['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub'],
    },
    {
      label: 'Call Logs',
      path: `/${rolePrefix}/call-logs`,
      icon: Phone,
      group: 'MANAGEMENT',
      roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'],
    },
    {
      label: 'Leads',
      path: `/${rolePrefix}/leads`,
      icon: FileText,
      group: 'MANAGEMENT',
      roles: ['gcc_admin', 'gcc_reviewer', 'sp_primary', 'sp_sub', 'client_admin', 'client_sub'],
    },
    {
      label: 'Calendar & Meetings',
      path: `/${rolePrefix}/calendar`,
      icon: CalendarDays,
      group: 'CAMPAIGN',
      roles: ['sp_primary', 'sp_sub', 'client_admin', 'client_sub'],
    },
    {
      label: 'Script & target uploads',
      path: `/${rolePrefix}/engine`,
      icon: Cpu,
      group: 'INTELLIGENCE',
      roles: ['client_admin'],
    },
    {
      label: 'Sales Playbook',
      path: `/${rolePrefix}/playbook`,
      icon: BookOpen,
      group: 'INTELLIGENCE',
      roles: ['sp_primary', 'sp_sub', 'client_admin', 'client_sub'],
    },
    {
      label: 'Commissions',
      path: `/${rolePrefix}/commissions`,
      icon: BarChart3,
      group: 'CAMPAIGN',
      roles: ['gcc_admin', 'sp_primary', 'sp_sub'],
    },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[hsl(var(--card))] border-r border-[hsl(var(--border-v))] z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border-v))]">
          <div>
            <h1 className="font-mono text-sm font-bold text-[hsl(var(--primary))]">Q-UP</h1>
            <p className="text-[10px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5 leading-snug">
              <span>{user?.entityName || portalSubtitle}</span>
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <p className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">
                {user?.name || 'Guest'}
              </p>
              <span className="text-[8px] px-1 py-0.5 rounded bg-[hsl(var(--muted))] border border-[hsl(var(--border-v))] font-bold text-[hsl(var(--foreground))]">
                {user?.region || 'US'}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="md:hidden text-[hsl(var(--muted-foreground))]">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          {['CAMPAIGN', 'INTELLIGENCE', 'MANAGEMENT'].map((group) => (
            <div key={group} className="mb-4">
              <p className="px-4 py-2 text-[9px] font-mono font-semibold uppercase tracking-[0.15em] text-[hsl(var(--muted-foreground))]">
                {group}
              </p>
              {navItems
                .filter((item) => {
                  if (item.group !== group || !item.roles.includes(user?.role || '')) return false;
                  if (item.channel === 'outbound') return canAccessOutbound;
                  if (item.channel === 'inbound') return canAccessInbound;
                  return true;
                })
                .map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-[hsl(var(--primary))] bg-[hsl(var(--primary))]/5 border-l-[3px] border-l-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] border-l-[3px] border-l-transparent'
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-[hsl(var(--border-v))]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[9px] font-mono text-[hsl(var(--muted-foreground))]">
              Engine active · Built for TCPA / CAN-SPAM
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
