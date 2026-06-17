from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src" / "components" / "layout"

ds_path = ROOT / "DashboardShell.tsx"
ds = ds_path.read_text(encoding="utf-8")
start = ds.find("        <Topbar title={title}")
end = ds.find("        <LiveTicker />", start)
if start >= 0 and end > start and "showTenantScope" not in ds:
    replacement = """        <Topbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          portalShell={portalShell}
          showTenantScope={isGccPortal}
        />
"""
    ds = ds[:start] + replacement + ds[end:]
    ds_path.write_text(ds, encoding="utf-8")
    print("DashboardShell ok")
else:
    print("DashboardShell skip", start, end)

tb_path = ROOT / "Topbar.tsx"
tb = tb_path.read_text(encoding="utf-8")
marker = "        <motion.div className=\"flex items-center gap-3 min-w-0\">"
if "showTenantScope &&" not in tb:
    old = """        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className={`md:hidden p-1.5 rounded-md hover:bg-[hsl(var(--muted))] ${
              portalShell ? 'text-[#FF3333] hover:text-[#cc2929]' : 'text-[hsl(var(--foreground))]'
            }`}
          >
            <Menu size={20} />
          </button>
          <motion.div className="flex items-center gap-2 min-w-0">
            <h2
              className={`text-sm font-semibold text-[hsl(var(--foreground))] truncate ${
                portalShell ? 'font-body' : 'font-display'
              }`}
            >
              {title}
            </h2>
            {isGCCAdmin && !portalShell && (
              <span className="hidden sm:inline shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                GCC Admin
              </span>
            )}
          </div>
        </div>"""
    # file uses div not motion.div
    old = old.replace("motion.div", "div")
    new = """        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          <button
            onClick={onMenuClick}
            className={`md:hidden p-1.5 rounded-md hover:bg-[hsl(var(--muted))] shrink-0 ${
              portalShell ? 'text-[#FF3333] hover:text-[#cc2929]' : 'text-[hsl(var(--foreground))]'
            }`}
          >
            <Menu size={20} />
          </button>
          <h2
            className={`text-sm font-semibold text-[hsl(var(--foreground))] truncate shrink-0 max-w-[36vw] sm:max-w-[200px] ${
              portalShell ? 'font-body' : 'font-display'
            }`}
          >
            {title}
          </h2>
          {showTenantScope && (
            <OrgScopePicker
              scopeOrgId={gccScope.scopeOrgId}
              onScopeChange={gccScope.setScopeOrgId}
              organizations={gccScope.organizations}
              loading={gccScope.orgsLoading}
              className="h-8 min-w-0 flex-1 max-w-[min(100%,300px)] border-[hsl(var(--border))] bg-[hsl(var(--muted))]/25 py-1.5"
            />
          )}
          {isGCCAdmin && !portalShell && (
            <span className="hidden sm:inline shrink-0 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              GCC Admin
            </span>
          )}
        </div>"""
    if old in tb:
        tb = tb.replace(old, new)
        tb_path.write_text(tb, encoding="utf-8")
        print("Topbar ok")
    else:
        print("Topbar block missing")
else:
    print("Topbar skip")
