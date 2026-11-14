import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin/genres'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const res = await login(email, password)
    if (res.success) {
      navigate(from, { replace: true })
    } else {
      setError(res.message)
    }
  }

  const handleQuickFillAdmin = () => {
    setEmail('admin@gmail.com')
    setPassword('password123')
    setError(null)
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-obsidian text-pure-white mb-4 shadow-sm text-lg">
            ▲
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-obsidian">Masuk ke BookSales</h1>
          <p className="text-xs text-stone mt-2">
            Gunakan akun administrator untuk mengelola genre dan penulis.
          </p>
        </div>

        <div className="bg-pure-white p-7 rounded-lg border border-hairline shadow-sm">
          {error && (
            <div className="mb-5 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
                />
                <Mail size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
                />
                <Lock size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Masuk Administrator</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill helper for mentor / testing */}
          <div className="mt-6 pt-5 border-t border-hairline text-center">
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-charcoal hover:text-obsidian px-3 py-1.5 rounded-md bg-paper-white border border-hairline hover:border-smoke transition-colors cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-500" />
              <span>Auto-fill Kredensial Admin Seeder</span>
            </button>
            <div className="text-[11px] text-graphite font-mono mt-2">
              admin@gmail.com / password123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
