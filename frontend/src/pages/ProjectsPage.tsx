import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, FolderKanban } from 'lucide-react'
import { projectsApi } from '@/api/projects'
import CreateProjectModal from '@/features/projects/CreateProjectModal'
import type { ProjectStatus } from '@/types'

const statusStyles: Record<ProjectStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  ON_HOLD: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  ARCHIVED: 'bg-muted text-muted-foreground',
}

const statusLabels: Record<ProjectStatus, string> = {
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
}

export default function ProjectsPage() {
  const [showModal, setShowModal] = useState(false)
  const queryClient = useQueryClient()

  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  })

  const handleCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {projects ? `${projects.length} project${projects.length !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
          Loading projects...
        </div>
      )}

      {isError && (
        <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-md">
          Failed to load projects. Please try again.
        </div>
      )}

      {!isLoading && !isError && projects?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <FolderKanban className="h-10 w-10 mb-3 opacity-30" />
          <p className="text-sm">No projects yet. Create your first one.</p>
        </div>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, i) => (
                <tr
                  key={project.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${
                    i % 2 === 0 ? '' : 'bg-muted/10'
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{project.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
                    {project.description || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusStyles[project.status]}`}>
                      {statusLabels[project.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}
