import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, FlaskConical } from 'lucide-react'
import { testCasesApi } from '@/api/testcases'
import CreateTestCaseModal from '@/features/testcases/CreateTestCaseModal'
import type { TestCaseStatus } from '@/types'

const statusStyles: Record<TestCaseStatus, string> = {
  PASSED:  'bg-green-100 text-green-700',
  FAILED:  'bg-red-100 text-red-700',
  BLOCKED: 'bg-orange-100 text-orange-700',
  NOT_RUN: 'bg-muted text-muted-foreground',
}

const statusLabels: Record<TestCaseStatus, string> = {
  PASSED:  'Passed',
  FAILED:  'Failed',
  BLOCKED: 'Blocked',
  NOT_RUN: 'Not Run',
}

const priorityLabels: Record<string, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const selectClass = 'px-3 py-1.5 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring'

export default function TestCasesPage() {
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<TestCaseStatus | ''>('')
  const queryClient = useQueryClient()

  const { data: testCases, isLoading, isError } = useQuery({
    queryKey: ['test-cases'],
    queryFn: testCasesApi.getTestCases,
  })

  const handleCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['test-cases'] })
  }

  const filtered = testCases?.filter((tc) => {
    if (statusFilter && tc.status !== statusFilter) return false
    return true
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Test Cases</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered ? `${filtered.length} test case${filtered.length !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Test Case
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TestCaseStatus | '')}
          className={selectClass}
        >
          <option value="">All statuses</option>
          <option value="NOT_RUN">Not Run</option>
          <option value="PASSED">Passed</option>
          <option value="FAILED">Failed</option>
          <option value="BLOCKED">Blocked</option>
        </select>

        {statusFilter && (
          <button
            onClick={() => setStatusFilter('')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          Loading test cases...
        </div>
      )}

      {isError && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          Failed to load test cases. Please try again.
        </div>
      )}

      {!isLoading && !isError && filtered?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <FlaskConical className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">
            {testCases?.length === 0 ? 'No test cases yet. Create your first one.' : 'No test cases match the current filter.'}
          </p>
        </div>
      )}

      {!isLoading && filtered && filtered.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tc, i) => (
                <tr
                  key={tc.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-muted/10'
                  }`}
                >
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{tc.title}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[tc.status]}`}>
                      {statusLabels[tc.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{priorityLabels[tc.priority]}</td>
                  <td className="px-4 py-3 text-muted-foreground">{tc.projectName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(tc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateTestCaseModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
