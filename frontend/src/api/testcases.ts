import apiClient from './client'
import type { TestCase, TestCaseStatus, Priority } from '@/types'

export interface CreateTestCaseRequest {
  title: string
  description?: string
  preconditions?: string
  testSteps?: string
  expectedResult?: string
  priority?: Priority
  projectId: number
}

export interface UpdateTestCaseRequest {
  title?: string
  description?: string
  preconditions?: string
  testSteps?: string
  expectedResult?: string
  actualResult?: string
  priority?: Priority
  status?: TestCaseStatus
}

export const testCasesApi = {
  getTestCases: async (): Promise<TestCase[]> => {
    const response = await apiClient.get<TestCase[]>('/test-cases')
    return response.data
  },

  getTestCasesByProject: async (projectId: number): Promise<TestCase[]> => {
    const response = await apiClient.get<TestCase[]>(`/test-cases/project/${projectId}`)
    return response.data
  },

  createTestCase: async (data: CreateTestCaseRequest): Promise<TestCase> => {
    const response = await apiClient.post<TestCase>('/test-cases', data)
    return response.data
  },

  updateTestCase: async (id: number, data: UpdateTestCaseRequest): Promise<TestCase> => {
    const response = await apiClient.put<TestCase>(`/test-cases/${id}`, data)
    return response.data
  },

  deleteTestCase: async (id: number): Promise<void> => {
    await apiClient.delete(`/test-cases/${id}`)
  },
}
