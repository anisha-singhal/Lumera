'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F1EB] to-[#E8E0D5]">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#800020] mb-4">
              <Image
                src="/images/logo-flame.png"
                alt="Lumera"
                width={32}
                height={32}
                className="brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-serif text-[#800020]">Lumera Admin</h1>
            <p className="text-sm text-gray-500 mt-2">Enter password to access dashboard</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020]/20 focus:border-[#800020] transition-colors"
                placeholder="Enter admin password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 px-4 bg-[#800020] text-white font-medium rounded-lg hover:bg-[#600018] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-500 hover:text-[#800020] transition-colors"
            >
              &larr; Back to website
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Protected admin area. Unauthorized access is prohibited.
        </p>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F1EB] to-[#E8E0D5]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
