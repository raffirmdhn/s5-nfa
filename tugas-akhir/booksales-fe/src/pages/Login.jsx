import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'

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
      if (res.user?.role === 'admin') {
        navigate(from, { replace: true })
      } else {
        navigate('/books', { replace: true })
      }
    } else {
      setError(res.message)
    }
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
            Masukkan email dan password akun Anda untuk melanjutkan.
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
                  <span>Masuk</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Akun clue */}
          <div className="mt-6 pt-5 border-t border-hairline text-center">
            <div className="text-[11px] text-stone font-mono">
              admin@gmail.com / password123
            </div>
          </div>

          {/* Link to Register */}
          <div className="mt-4 text-center">
            <p className="text-xs text-stone">
              Belum memiliki akun?{' '}
              <Link to="/register" className="font-medium text-obsidian hover:underline">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
