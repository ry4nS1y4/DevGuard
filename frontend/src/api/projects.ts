import apiClient from './client'
import type { Project, ProjectStatus } from '@/types'

export interface CreateProjectRequest {
  name: string
  description?: string
  status?: ProjectStatus
}

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects')
    return response.data
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', data)
    return response.data
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
  },
}
