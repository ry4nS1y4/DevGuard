import apiClient from './client'
import type { Bug, BugSeverity, BugStatus, Priority } from '@/types'

export interface CreateBugRequest {
  title: string
  description?: string
  stepsToReproduce?: string
  expectedResult?: string
  actualResult?: string
  severity?: BugSeverity
  priority?: Priority
  projectId: number
  assignedToId?: number
}

export interface UpdateBugRequest {
  title?: string
  description?: string
  stepsToReproduce?: string
  expectedResult?: string
  actualResult?: string
  severity?: BugSeverity
  priority?: Priority
  status?: BugStatus
  assignedToId?: number
}

export const bugsApi = {
  getBugs: async (): Promise<Bug[]> => {
    const response = await apiClient.get<Bug[]>('/bugs')
    return response.data
  },

  getBugsByProject: async (projectId: number): Promise<Bug[]> => {
    const response = await apiClient.get<Bug[]>(`/bugs/project/${projectId}`)
    return response.data
  },

  createBug: async (data: CreateBugRequest): Promise<Bug> => {
    const response = await apiClient.post<Bug>('/bugs', data)
    return response.data
  },

  updateBug: async (id: number, data: UpdateBugRequest): Promise<Bug> => {
    const response = await apiClient.put<Bug>(`/bugs/${id}`, data)
    return response.data
  },

  deleteBug: async (id: number): Promise<void> => {
    await apiClient.delete(`/bugs/${id}`)
  },
}
