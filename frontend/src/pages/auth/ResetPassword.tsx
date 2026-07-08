import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
export function ResetPassword() {
  const navigate = useNavigate()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    }, 1000)
  }
  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-slate-50 dark:bg-slate-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900 dark:text-white">
          Create new password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-xl sm:px-12 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
          {!isSubmitted ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200"
                >
                  New password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200"
                >
                  Confirm new password
                </label>
                <div className="relative mt-2">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock
                      className="h-5 w-5 text-slate-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-slate-900 dark:text-white dark:ring-slate-700 dark:focus:ring-primary"
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
                      Reset password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                Password reset successfully
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Your password has been updated. Redirecting you to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
