export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-hairline bg-pure-white py-6 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-obsidian">▲ BookSales</span>
          <span>—</span>
          <span>Platform Toko Buku Online Modern</span>
        </div>
        <div className="text-[11px] text-stone">
          &copy; {currentYear} BookSales. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
