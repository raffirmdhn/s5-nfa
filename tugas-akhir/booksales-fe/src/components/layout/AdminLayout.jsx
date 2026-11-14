import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
import Footer from './Footer'

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper-white text-obsidian font-sans">
      <AdminNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

