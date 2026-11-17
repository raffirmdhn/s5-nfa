import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

const GUEST_STORAGE_KEY = 'booksales_cart_guest'
const getUserStorageKey = (userId) => `booksales_cart_user_${userId}`

const readCartFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const mergeCarts = (baseCart, incomingCart) => {
  if (!incomingCart || incomingCart.length === 0) return baseCart || []
  const merged = [...(baseCart || [])]

  for (const incoming of incomingCart) {
    if (!incoming || !incoming.book) continue
    const existingIndex = merged.findIndex((i) => i.book.id === incoming.book.id)
    if (existingIndex > -1) {
      const stock = Number(merged[existingIndex].book.stock || 0)
      const nextQty = merged[existingIndex].quantity + (incoming.quantity || 1)
      merged[existingIndex] = {
        ...merged[existingIndex],
        quantity: stock > 0 ? Math.min(nextQty, stock) : nextQty,
      }
    } else {
      merged.push(incoming)
    }
  }

  return merged
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || null
  const prevUserIdRef = useRef(userId)

  // Inisialisasi awal cart dengan pengecekan migrasi
  const [cart, setCart] = useState(() => {
    // 1. Migrasi dari key legacy 'booksales_cart' jika ada
    const legacy = readCartFromStorage('booksales_cart')
    if (legacy.length > 0) {
      localStorage.removeItem('booksales_cart')
      if (userId) {
        localStorage.setItem(getUserStorageKey(userId), JSON.stringify(legacy))
        return legacy
      } else {
        localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(legacy))
        return legacy
      }
    }

    // 2. Baca dari storage sesuai status user saat pertama mount
    if (userId) {
      return readCartFromStorage(getUserStorageKey(userId))
    }
    return readCartFromStorage(GUEST_STORAGE_KEY)
  })

  // Sinkronisasi saat user berganti (Guest -> User, User A -> User B, User -> Logout)
  useEffect(() => {
    const prevId = prevUserIdRef.current

    if (prevId !== userId) {
      if (userId) {
        // User berhasil login (baik dari guest maupun akun lain)
        const guestCart = readCartFromStorage(GUEST_STORAGE_KEY)
        const userCart = readCartFromStorage(getUserStorageKey(userId))

        if (guestCart.length > 0) {
          // Ada item di keranjang sebelum login -> gabungkan ke akun yang baru login pertama
          const merged = mergeCarts(userCart, guestCart)
          localStorage.removeItem(GUEST_STORAGE_KEY)
          localStorage.setItem(getUserStorageKey(userId), JSON.stringify(merged))
          setCart(merged)
        } else {
          setCart(userCart)
        }
      } else {
        // User baru saja logout -> beralih ke keranjang tamu kosong
        const guestCart = readCartFromStorage(GUEST_STORAGE_KEY)
        setCart(guestCart)
      }
      prevUserIdRef.current = userId
    }
  }, [userId])

  // Persist perubahan keranjang ke localStorage sesuai akun aktif
  useEffect(() => {
    const currentKey = userId ? getUserStorageKey(userId) : GUEST_STORAGE_KEY
    try {
      localStorage.setItem(currentKey, JSON.stringify(cart))
    } catch {
      // Ignore write errors
    }
  }, [cart, userId])

  const addToCart = (book, quantity = 1) => {
    if (!book || !book.id) return { success: false, message: 'Buku tidak valid' }
    const stock = Number(book.stock || 0)
    if (stock <= 0) {
      return { success: false, message: 'Stok buku ini sedang habis' }
    }

    let errorMsg = ''

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.book.id === book.id)
      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity
        const nextQty = currentQty + quantity
        if (nextQty > stock) {
          errorMsg = `Maksimal pembelian untuk buku ini adalah ${stock} eksemplar`
          return prev
        }
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: nextQty,
        }
        return updated
      } else {
        if (quantity > stock) {
          errorMsg = `Maksimal pembelian untuk buku ini adalah ${stock} eksemplar`
          return prev
        }
        return [...prev, { book, quantity }]
      }
    })

    if (errorMsg) {
      return { success: false, message: errorMsg }
    }
    return { success: true, message: `"${book.title}" berhasil ditambahkan ke keranjang` }
  }

  const updateQuantity = (bookId, quantity) => {
    const qty = Number(quantity)
    if (qty < 1) return

    setCart((prev) =>
      prev.map((item) => {
        if (item.book.id === bookId) {
          const maxStock = Number(item.book.stock || 0)
          const validQty = Math.min(qty, maxStock)
          return { ...item, quantity: validQty }
        }
        return item
      })
    )
  }

  const removeFromCart = (bookId) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId))
  }

  const clearCart = () => {
    setCart([])
    const currentKey = userId ? getUserStorageKey(userId) : GUEST_STORAGE_KEY
    try {
      localStorage.removeItem(currentKey)
    } catch {
      // Ignore
    }
  }

  const getCartCount = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0)
  }

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + (Number(item.book.price) || 0) * (item.quantity || 0),
      0
    )
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider')
  }
  return context
}

export default CartContext
