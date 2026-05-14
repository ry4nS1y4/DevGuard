import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Bug as BugIcon } from 'lucide-react'
import { bugsApi } from '@/api/bugs'
import CreateBugModal from '@/features/bugs/CreateBugModal'
import type { BugSeverity, BugStatus } from '@/types'

const severityStyles: Record<BugSeverity, string> = {
  CRITICAL: 'bg-red-100 text-red-700',
  HIGH:     'bg-orange-100 text-orange-700',
  MEDIUM:   'bg-yellow-100 text-yellow-700',
  LOW:      'bg-green-100 text-green-700',
}

const statusStyles: Record<BugStatus, string> = {
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

const priorityLabels: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const selectClass = 'px-3 py-1.5 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring'

export default function BugsPage() {
  const [showModal, setShowModal] = useState(false)
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | ''>('')
  const [statusFilter, setStatusFilter] = useState<BugStatus | ''>('')
  const queryClient = useQueryClient()

  const { data: bugs, isLoading, isError } = useQuery({
    queryKey: ['bugs'],
    queryFn: bugsApi.getBugs,
  })

  const handleCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['bugs'] })
  }

  const filtered = bugs?.filter((b) => {
    if (severityFilter && b.severity !== severityFilter) return false
    if (statusFilter && b.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bugs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered ? `${filtered.length} bug${filtered.length !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Bug
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value as BugSeverity | '')}
          className={selectClass}
        >
          <option value="">All severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BugStatus | '')}
          className={selectClass}
        >
          <option value="">All statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="FIXED">Fixed</option>
          <option value="RETESTING">Retesting</option>
          <option value="CLOSED">Closed</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {(severityFilter || statusFilter) && (
          <button
            onClick={() => { setSeverityFilter(''); setStatusFilter('') }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          Loading bugs...
        </div>
      )}

      {isError && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          Failed to load bugs. Please try again.
        </div>
      )}

      {!isLoading && !isError && filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <BugIcon className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">
            {bugs?.length === 0 ? 'No bugs reported yet.' : 'No bugs match the current filters.'}
          </p>
        </div>
      )}

      {!isLoading && filtered && filtered.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Severity</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assigned To</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bug, i) => (
                <tr
                  key={bug.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-muted/10'
                  }`}
                >
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{bug.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${severityStyles[bug.severity]}`}>
                      {bug.severity.charAt(0) + bug.severity.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{priorityLabels[bug.priority]}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[bug.status]}`}>
                      {statusLabels[bug.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{bug.assignedToName ?? '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{bug.projectName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(bug.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateBugModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
