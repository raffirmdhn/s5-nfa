import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import StoreLayout from './components/layout/StoreLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Home from './pages/Home'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGenres from './pages/admin/AdminGenres'
import AdminAuthors from './pages/admin/AdminAuthors'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Storefront / Public Routes */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book" element={<Navigate to="/books" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/genres" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="authors" element={<AdminAuthors />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
