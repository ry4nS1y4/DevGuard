import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield } from 'lucide-react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setError('')
      const response = await authApi.login(data)
      setAuth(response)
      navigate('/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">DevGuard</span>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <h1 className="text-xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your credentials to access your workspace
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
