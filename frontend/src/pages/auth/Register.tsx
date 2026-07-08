import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.')
      return
    }
    setIsLoading(true)
    try {
      await register(form)
      navigate('/login')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { email?: string[]; password?: string[]; detail?: string; [key: string]: unknown } } }
        const data = axiosErr.response?.data
        if (data?.email) setError(data.email[0])
        else if (data?.password) setError(data.password[0])
        else if (data?.detail) setError(data.detail as string)
        else setError('Registration failed. Please try again.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-900">
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-1/2 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              RecruitFlow
            </span>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Start your journey with RecruitFlow.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                    First name
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      value={form.first_name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                    Last name
                  </label>
                  <div className="relative mt-2">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <User className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      value={form.last_name}
                      onChange={handleChange}
                      className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                  Email address
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                  Password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirm" className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">
                  Confirm password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password_confirm"
                    name="password_confirm"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={form.password_confirm}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block bg-slate-900">
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1440 800">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3a8a" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grad1)" />
            <path d="M0 0L1440 800M1440 0L0 800" stroke="url(#grad2)" strokeWidth="2" />
            <circle cx="20%" cy="30%" r="300" fill="url(#grad2)" />
            <circle cx="80%" cy="70%" r="400" fill="url(#grad2)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
            <div className="relative w-full max-w-lg rounded-2xl bg-white/10 p-8 backdrop-blur-md border border-white/20 shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="flex -space-x-4">
                  <img className="w-16 h-16 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=1" alt="" />
                  <img className="w-16 h-16 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=2" alt="" />
                  <img className="w-16 h-16 rounded-full border-4 border-slate-900" src="https://i.pravatar.cc/150?u=3" alt="" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Build your dream team</h3>
              <p className="text-slate-300 text-lg">The modern applicant tracking system designed for speed, clarity, and collaboration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
