import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import StoreLayout from './components/layout/StoreLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import GuestRoute from './components/layout/GuestRoute'

import Home from './pages/Home'
import Books from './pages/Books'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGenres from './pages/admin/AdminGenres'
import AdminAuthors from './pages/admin/AdminAuthors'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Storefront & Public Routes */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book" element={<Navigate to="/books" replace />} />

          {/* Guest-Only Routes (Redirect if already logged in) */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          {/* Authenticated User Route (Customer & Admin) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['admin', 'customer', 'user']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected Admin-Only Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="authors" element={<AdminAuthors />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
