import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { testCasesApi } from '@/api/testcases'
import { projectsApi } from '@/api/projects'
import type { Priority } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  preconditions: z.string().optional(),
  testSteps: z.string().optional(),
  expectedResult: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  projectId: z.coerce.number({ invalid_type_error: 'Project is required' }).min(1, 'Project is required'),
})

type FormData = z.infer<typeof schema>

interface Props {
  onClose: () => void
  onCreated: () => void
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

const inputClass = 'w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background'

export default function CreateTestCaseModal({ onClose, onCreated }: Props) {
  const [error, setError] = useState('')

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  })

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'MEDIUM' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      await testCasesApi.createTestCase(data)
      onCreated()
      onClose()
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Failed to create test case')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-lg shadow-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="text-base font-semibold">New Test Case</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4 overflow-y-auto">
          <div>
            <label className="text-sm font-medium block mb-1.5">Title</label>
            <input {...register('title')} type="text" placeholder="Verify login with valid credentials" className={inputClass} />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Project</label>
              <select {...register('projectId')} className={inputClass}>
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {errors.projectId && <p className="text-xs text-destructive mt-1">{errors.projectId.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Priority</label>
              <select {...register('priority')} className={inputClass}>
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea {...register('description')} rows={2} placeholder="What does this test case verify?" className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Preconditions</label>
            <textarea {...register('preconditions')} rows={2} placeholder="What must be true before running this test?" className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Test Steps</label>
            <textarea {...register('testSteps')} rows={3} placeholder="1. Navigate to...&#10;2. Enter...&#10;3. Click..." className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1.5">Expected Result</label>
            <textarea {...register('expectedResult')} rows={2} placeholder="What should happen?" className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">{error}</div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-border hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Test Case'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
