import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import StoreLayout from './components/layout/StoreLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import GuestRoute from './components/layout/GuestRoute'

import Home from './pages/Home'
import Books from './pages/Books'
import BookDetail from './pages/BookDetail'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import InvoicePage from './pages/InvoicePage'
import NotFound from './pages/NotFound'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminBooks from './pages/admin/AdminBooks'
import AdminTransactions from './pages/admin/AdminTransactions'
import AdminGenres from './pages/admin/AdminGenres'
import AdminAuthors from './pages/admin/AdminAuthors'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Storefront & Public Routes */}
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Books />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/book" element={<Navigate to="/books" replace />} />
            <Route path="/cart" element={<CartPage />} />

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

            {/* Authenticated User Routes (Customer & Admin) */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer']}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'customer']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Dedicated Fullpage Official Invoice */}
          <Route
            path="/invoice/:id"
            element={
              <ProtectedRoute allowedRoles={['admin', 'customer']}>
                <InvoicePage />
              </ProtectedRoute>
            }
          />

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
            <Route path="books" element={<AdminBooks />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="genres" element={<AdminGenres />} />
            <Route path="authors" element={<AdminAuthors />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
