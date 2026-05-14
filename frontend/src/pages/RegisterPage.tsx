import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield } from 'lucide-react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DEVELOPER', 'QA', 'ADMIN']).default('DEVELOPER'),
})

type FormData = z.infer<typeof schema>

const inputClass = 'w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'DEVELOPER' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      setError('')
      const response = await authApi.register(data)
      setAuth(response)
      navigate('/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Registration failed')
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
          <h1 className="text-xl font-semibold mb-1">Create an account</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in your details to get started
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium block mb-1.5">First name</label>
                <input {...register('firstName')} type="text" placeholder="Jane" className={inputClass} />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Last name</label>
                <input {...register('lastName')} type="text" placeholder="Smith" className={inputClass} />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className={inputClass} />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <input {...register('password')} type="password" placeholder="••••••••" className={inputClass} />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Role</label>
              <select {...register('role')} className={inputClass}>
                <option value="DEVELOPER">Developer</option>
                <option value="QA">QA</option>
                <option value="ADMIN">Admin</option>
              </select>
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
