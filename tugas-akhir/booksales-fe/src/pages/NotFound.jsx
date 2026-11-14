import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="font-mono text-xs uppercase tracking-widest text-stone mb-2">404 Error</div>
      <h1 className="text-3xl font-bold tracking-tight text-obsidian mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-xs text-stone max-w-sm mb-6">
        Halaman yang Anda tuju mungkin telah dipindahkan atau tidak tersedia.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-pure-white bg-obsidian hover:bg-carbon rounded-md transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Kembali ke Beranda</span>
      </Link>
    </div>
  )
}

