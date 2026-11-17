import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Lock, AtSign, Eye, EyeOff, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirectTo = searchParams.get('redirectto')

  const validateField = (field, value, allValues = formData) => {
    let error = ''
    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Nama lengkap wajib diisi.'
        } else if (value.trim().length < 3) {
          error = 'Nama lengkap minimal 3 karakter.'
        }
        break
      case 'username':
        if (!value.trim()) {
          error = 'Username wajib diisi.'
        } else if (value.trim().length < 3) {
          error = 'Username minimal 3 karakter.'
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username hanya boleh huruf, angka, dan underscore (_).'
        }
        break
      case 'email':
        if (!value.trim()) {
          error = 'Email wajib diisi.'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Format email tidak valid (contoh: nama@domain.com).'
        }
        break
      case 'password':
        if (!value) {
          error = 'Password wajib diisi.'
        } else if (value.length < 6) {
          error = 'Password minimal 6 karakter.'
        }
        break
      case 'confirmPassword':
        if (!value) {
          error = 'Konfirmasi password wajib diisi.'
        } else if (value !== allValues.password) {
          error = 'Konfirmasi password tidak cocok dengan password.'
        }
        break
      default:
        break
    }
    return error
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    setFormData(updated)

    // Realtime field validation
    const err = validateField(name, value, updated)
    setErrors((prev) => ({ ...prev, [name]: err }))

    // If typing in password, also re-validate confirmPassword if already filled
    if (name === 'password' && formData.confirmPassword) {
      const confirmErr = validateField('confirmPassword', formData.confirmPassword, updated)
      setErrors((prev) => ({ ...prev, confirmPassword: confirmErr }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError(null)

    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key], formData)
      if (err) newErrors[key] = err
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const res = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: 'customer',
    })

    if (res.success) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true })
      } else {
        navigate('/books', { replace: true })
      }
    } else {
      setServerError(res.message)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-md bg-obsidian text-pure-white mb-4 shadow-sm text-lg">
            ▲
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-obsidian">Buat Akun BookSales</h1>
          <p className="text-xs text-stone mt-2">
            Daftarkan diri Anda untuk menjelajahi dan menikmati koleksi buku kami.
          </p>
        </div>

        <div className="bg-pure-white p-7 rounded-lg border border-hairline shadow-sm">
          {serverError && (
            <div className="mb-5 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Contoh: Raffi Ramadhan"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-pure-white border rounded-md focus:outline-none transition-colors text-obsidian placeholder:text-smoke ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-hairline focus:border-obsidian'
                  }`}
                />
                <User size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
              </div>
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Contoh: raffi_ramadhan"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-pure-white border rounded-md focus:outline-none transition-colors text-obsidian placeholder:text-smoke ${
                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-hairline focus:border-obsidian'
                  }`}
                />
                <AtSign size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
              </div>
              {errors.username && <p className="text-[11px] text-red-600 mt-1">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@domain.com"
                  className={`w-full pl-9 pr-3 py-2 text-sm bg-pure-white border rounded-md focus:outline-none transition-colors text-obsidian placeholder:text-smoke ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-hairline focus:border-obsidian'
                  }`}
                />
                <Mail size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
              </div>
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimal 6 karakter"
                  className={`w-full pl-9 pr-10 py-2 text-sm bg-pure-white border rounded-md focus:outline-none transition-colors text-obsidian placeholder:text-smoke ${
                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-hairline focus:border-obsidian'
                  }`}
                />
                <Lock size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone hover:text-obsidian cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Konfirmasi Password */}
            <div>
              <label className="block text-xs font-medium text-charcoal mb-1.5 uppercase tracking-wider font-mono">
                Konfirmasi Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ulangi password"
                  className={`w-full pl-9 pr-10 py-2 text-sm bg-pure-white border rounded-md focus:outline-none transition-colors text-obsidian placeholder:text-smoke ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-hairline focus:border-obsidian'
                  }`}
                />
                <CheckCircle2 size={15} className="absolute left-3 top-2.5 text-stone pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-stone hover:text-obsidian cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors disabled:opacity-50 cursor-pointer shadow-xs mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Baru</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 pt-5 border-t border-hairline text-center">
            <p className="text-xs text-stone">
              Sudah memiliki akun?{' '}
              <Link
                to={redirectTo ? `/login?redirectto=${encodeURIComponent(redirectTo)}` : '/login'}
                className="font-medium text-obsidian hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

