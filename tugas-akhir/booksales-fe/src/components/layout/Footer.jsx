export default function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline bg-pure-white py-6 w-full">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-obsidian">▲ BookSales</span>
          <span>—</span>
          <span>Praktikum Pemrograman Web (ReactJS Lanjutan)</span>
        </div>
        <div className="font-mono text-[11px] text-graphite">
          Raffi Ramadhan · 0110224204 · STT Terpadu Nurul Fikri
        </div>
      </div>
    </footer>
  )
}
