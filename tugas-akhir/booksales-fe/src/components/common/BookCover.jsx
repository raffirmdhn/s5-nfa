import { useState } from 'react'
import { BookOpen } from 'lucide-react'

export default function BookCover({ src, title, author, className = 'h-52' }) {
  const [imageError, setImageError] = useState(false)

  const isFullUrl = src && (src.startsWith('http://') || src.startsWith('https://'))

  if (!isFullUrl || imageError) {
    return (
      <div
        className={`w-full ${className} bg-linear-to-br from-obsidian via-charcoal to-carbon text-pure-white p-5 flex flex-col justify-between border-b border-hairline relative overflow-hidden select-none`}
      >
        {/* Subtle decorative line like a book spine */}
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-pure-white/10 border-r border-pure-white/10" />

        <div className="pl-3">
          <div className="w-6 h-6 rounded bg-pure-white/10 flex items-center justify-center mb-2">
            <BookOpen size={13} className="text-pure-white/70" />
          </div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-smoke block line-clamp-1">
            {author || 'BookSales'}
          </span>
        </div>

        <div className="pl-3">
          <p className="text-xs font-semibold tracking-tight text-pure-white line-clamp-2 leading-snug">
            {title}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className} bg-paper-white border-b border-hairline overflow-hidden flex items-center justify-center`}>
      <img
        src={src}
        alt={title}
        onError={() => setImageError(true)}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      />
    </div>
  )
}

