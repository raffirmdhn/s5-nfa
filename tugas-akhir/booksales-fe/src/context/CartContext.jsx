import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

const CART_STORAGE_KEY = 'booksales_cart'

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Ignore storage write errors
    }
  }, [cart])

  const addToCart = (book, quantity = 1) => {
    if (!book || !book.id) return { success: false, message: 'Buku tidak valid' }
    const stock = Number(book.stock || 0)
    if (stock <= 0) {
      return { success: false, message: 'Stok buku ini sedang habis' }
    }

    let added = false
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
        added = true
        return updated
      } else {
        if (quantity > stock) {
          errorMsg = `Maksimal pembelian untuk buku ini adalah ${stock} eksemplar`
          return prev
        }
        added = true
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
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
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
