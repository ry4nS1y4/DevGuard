// ── User ─────────────────────────────────────────────────────────────────
export type Role = 'ADMIN' | 'QA' | 'DEVELOPER'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: Role
  createdAt: string
}

export interface AuthResponse {
  token: string
  email: string
  firstName: string
  lastName: string
  role: Role
}

// ── Project ──────────────────────────────────────────────────────────────
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED'

export interface Project {
  id: number
  name: string
  description: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
  memberCount: number
  openBugsCount: number
  testCaseCount: number
}

// ── Bug ───────────────────────────────────────────────────────────────────
export type BugSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type BugStatus = 'OPEN' | 'IN_PROGRESS' | 'FIXED' | 'RETESTING' | 'CLOSED' | 'REJECTED'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Bug {
  id: number
  title: string
  description: string
  stepsToReproduce: string
  expectedResult: string
  actualResult: string
  severity: BugSeverity
  priority: Priority
  status: BugStatus
  createdById: number
  createdByName: string
  assignedToId?: number
  assignedToName?: string
  projectId: number
  projectName: string
  createdAt: string
  updatedAt: string
}

// ── Test Case ─────────────────────────────────────────────────────────────
export type TestCaseStatus = 'NOT_RUN' | 'PASSED' | 'FAILED' | 'BLOCKED'

export interface TestCase {
  id: number
  title: string
  description: string
  preconditions: string
  testSteps: string
  expectedResult: string
  actualResult?: string
  status: TestCaseStatus
  priority: Priority
  createdById: number
  createdByName: string
  projectId: number
  projectName: string
  createdAt: string
  updatedAt: string
}

// ── Test Run ──────────────────────────────────────────────────────────────
export interface TestRun {
  id: number
  name: string
  projectId: number
  projectName: string
  testerName: string
  startDate: string
  endDate?: string
  notes?: string
  results: TestResult[]
  passCount: number
  failCount: number
  blockedCount: number
  totalCount: number
}

export interface TestResult {
  id: number
  testCaseId: number
  testCaseTitle: string
  status: TestCaseStatus
  notes?: string
  linkedBugId?: number
}

// ── Dashboard ─────────────────────────────────────────────────────────────
export interface DashboardRecentBug {
  id: number
  title: string
  severity: BugSeverity
  status: BugStatus
  projectName: string
  createdAt: string
}

export interface DashboardStats {
  totalBugs: number
  openBugs: number
  closedBugs: number
  criticalBugs: number
  totalTestCases: number
  passedTestCases: number
  failedTestCases: number
  blockedTestCases: number
  notRunTestCases: number
  passRate: number
  bugsBySeverity: Record<BugSeverity, number>
  bugsByStatus: Record<BugStatus, number>
  recentBugs: DashboardRecentBug[]
}

// ── API ───────────────────────────────────────────────────────────────────
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ApiError {
  message: string
  status: number
  fieldErrors?: Record<string, string>
}
