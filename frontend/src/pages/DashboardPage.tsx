import { useQuery } from '@tanstack/react-query'
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { dashboardApi } from '@/api/dashboard'
import type { BugSeverity, BugStatus } from '@/types'

const SEVERITY_COLORS: Record<BugSeverity, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MEDIUM:   '#eab308',
  LOW:      '#22c55e',
}

const severityBadge: Record<BugSeverity, string> = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH:     'bg-orange-100 text-orange-700',
  MEDIUM:   'bg-yellow-100 text-yellow-700',
  LOW:      'bg-green-100 text-green-700',
}

const statusBadge: Record<BugStatus, string> = {
  OPEN:        'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-purple-100 text-purple-700',
  FIXED:       'bg-green-100 text-green-700',
  RETESTING:   'bg-yellow-100 text-yellow-700',
  CLOSED:      'bg-muted text-muted-foreground',
  REJECTED:    'bg-red-100 text-red-700',
}

const statusLabels: Record<BugStatus, string> = {
  OPEN:        'Open',
  IN_PROGRESS: 'In Progress',
  FIXED:       'Fixed',
  RETESTING:   'Retesting',
  CLOSED:      'Closed',
  REJECTED:    'Rejected',
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg px-6 py-5">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Loading dashboard...
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="p-8">
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          Failed to load dashboard. Please try again.
        </div>
      </div>
    )
  }

  const severityPieData = (Object.entries(stats.bugsBySeverity) as [BugSeverity, number][])
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0)

  const statusBarData = (Object.entries(stats.bugsByStatus) as [BugStatus, number][])
    .map(([status, count]) => ({ name: statusLabels[status], value: Number(count) }))

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Project quality at a glance</p>
      </div>

      {/* Row 1 — Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Bugs" value={stats.totalBugs} />
        <StatCard label="Open Bugs" value={stats.openBugs} sub={`${stats.closedBugs} closed`} />
        <StatCard label="Critical Bugs" value={stats.criticalBugs} />
        <StatCard
          label="Test Pass Rate"
          value={`${stats.passRate.toFixed(1)}%`}
          sub={`${stats.passedTestCases} of ${stats.totalTestCases} passed`}
        />
      </div>

      {/* Row 2 — Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-4">Bugs by Severity</h2>
          {severityPieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No bugs yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={180}>
                <PieChart>
                  <Pie data={severityPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {severityPieData.map((entry) => (
                      <Cell key={entry.name} fill={SEVERITY_COLORS[entry.name as BugSeverity]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Bugs']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {severityPieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: SEVERITY_COLORS[entry.name as BugSeverity] }}
                    />
                    <span className="text-muted-foreground capitalize">
                      {entry.name.charAt(0) + entry.name.slice(1).toLowerCase()}
                    </span>
                    <span className="font-medium ml-auto pl-4">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-4">Bugs by Status</h2>
          {stats.totalBugs === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No bugs yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={statusBarData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [value, 'Bugs']} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Row 3 — Recent bugs */}
      <div className="bg-card border border-border rounded-lg">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold">Recent Bugs</h2>
        </div>
        {stats.recentBugs.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            No bugs reported yet
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Severity</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-6 py-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBugs.map((bug, i) => (
                <tr
                  key={bug.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-muted/10'
                  }`}
                >
                  <td className="px-6 py-3 font-medium max-w-xs truncate">{bug.title}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityBadge[bug.severity]}`}>
                      {bug.severity.charAt(0) + bug.severity.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadge[bug.status]}`}>
                      {statusLabels[bug.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">{bug.projectName}</td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
