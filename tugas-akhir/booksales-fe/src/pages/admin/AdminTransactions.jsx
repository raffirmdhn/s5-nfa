import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import transactionService from '../../services/transactionService'
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal'
import TransactionDetailModal from '../../components/common/TransactionDetailModal'
import {
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Filter,
  ShoppingBag,
  Clock,
  Package,
  Eye,
  Printer,
} from 'lucide-react'

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [notification, setNotification] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  // Detail Modal State
  const [selectedTx, setSelectedTx] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Delete State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [txToDelete, setTxToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchTransactions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await transactionService.getTransactions()
      setTransactions(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data transaksi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const showToast = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 4000)
  }

  const handleStatusChange = async (txId, newStatus) => {
    setUpdatingId(txId)
    try {
      await transactionService.updateTransactionStatus(txId, newStatus)
      showToast('Status pesanan berhasil diperbarui!')
      setTransactions((prev) =>
        prev.map((item) => (item.id === txId ? { ...item, status: newStatus } : item))
      )
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal memperbarui status pesanan.'
      alert(msg)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleOpenDelete = (tx) => {
    setTxToDelete(tx)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!txToDelete) return
    setDeleteLoading(true)
    try {
      await transactionService.deleteTransaction(txToDelete.id)
      setIsDeleteModalOpen(false)
      showToast(`Transaksi "${txToDelete.order_number || txToDelete.id}" berhasil dihapus dan stok dikembalikan!`)
      fetchTransactions()
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal menghapus transaksi.'
      alert(msg)
    } finally {
      setDeleteLoading(false)
      setTxToDelete(null)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      t.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.book?.title?.toLowerCase().includes(search.toLowerCase())

    const matchStatus =
      selectedStatus === 'all' ||
      String(t.status || 'pending').toLowerCase() === selectedStatus.toLowerCase()

    return matchSearch && matchStatus
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-obsidian">Manajemen Transaksi</h1>
            <span className="text-xs font-mono px-2 py-0.5 bg-paper-white text-charcoal border border-hairline rounded-full">
              {transactions.length} Pesanan
            </span>
          </div>
          <p className="text-xs text-stone mt-1">
            Pantau dan kelola seluruh transaksi serta status pesanan buku dari pelanggan.
          </p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="mb-4 p-3 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchTransactions}
            className="text-xs underline hover:no-underline font-medium cursor-pointer"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Control Bar: Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari order, pelanggan, atau judul buku..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian placeholder:text-smoke transition-colors"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-stone pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-stone hidden sm:block" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-pure-white border border-hairline rounded-md focus:outline-none focus:border-obsidian text-obsidian transition-colors cursor-pointer"
            >
              <option value="all">Semua Status ({transactions.length})</option>
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="dikirim">Dikirim</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchTransactions}
          title="Segarkan Data"
          disabled={loading}
          className="p-1.5 text-stone hover:text-obsidian rounded-md border border-hairline bg-pure-white hover:bg-paper-white transition-colors cursor-pointer self-end sm:self-auto"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-pure-white rounded-lg border border-hairline shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-hairline bg-paper-white/70 text-stone font-mono uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-32">Nomor Order</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Buku & Qty</th>
                <th className="py-3 px-4">Total Bayar</th>
                <th className="py-3 px-4 w-36">Status Pesanan</th>
                <th className="py-3 px-4 w-32">Waktu</th>
                <th className="py-3 px-4 w-16 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-4"><div className="h-3 w-20 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-28 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-36 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-16 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-6 w-24 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4"><div className="h-3 w-20 bg-hairline rounded" /></td>
                    <td className="py-3.5 px-4 text-right"><div className="h-3 w-8 bg-hairline rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone">
                    <ShoppingBag size={24} className="mx-auto mb-2 text-ash" />
                    <p className="font-medium text-charcoal">Tidak ada transaksi yang cocok</p>
                    <p className="text-[11px] mt-0.5">
                      {search ? 'Coba filter atau kata kunci pencarian yang lain.' : 'Belum ada transaksi pembelian buku yang tercatat.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-paper-white/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-obsidian text-[11px]">
                      {tx.order_number || `ORD-${tx.id}`}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-obsidian">
                        {tx.customer?.name || 'Pelanggan'}
                      </div>
                      <div className="text-[10px] text-stone font-mono">
                        {tx.customer?.email || '-'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-charcoal line-clamp-1">
                        {tx.book?.title || 'Judul Buku'}
                      </div>
                      <div className="text-[10px] text-stone">
                        {tx.quantity} eksemplar
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-obsidian">
                      {formatPrice(tx.total_amount)}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={tx.status || 'pending'}
                        disabled={updatingId === tx.id}
                        onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                        className={`text-xs font-mono font-semibold px-2 py-1 rounded border cursor-pointer focus:outline-none transition-colors ${
                          tx.status === 'selesai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : tx.status === 'dikirim'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : tx.status === 'diproses'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-paper-white text-stone border-hairline'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="diproses">Diproses</option>
                        <option value="dikirim">Dikirim</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone text-[11px]">
                      {formatDate(tx.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/invoice/${tx.id}`}
                          target="_blank"
                          title="Buka Faktur Resmi Fullpage (Tokopedia style)"
                          className="p-1.5 text-stone hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <Printer size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTx(tx)
                            setIsDetailOpen(true)
                          }}
                          title="Lihat Rincian Cepat"
                          className="p-1.5 text-stone hover:text-obsidian hover:bg-hairline/60 rounded transition-colors cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(tx)}
                          title="Hapus Transaksi"
                          className="p-1.5 text-stone hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Invoice Modal */}
      <TransactionDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedTx(null)
        }}
        initialData={selectedTx}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        itemName={txToDelete?.order_number || `ORD-${txToDelete?.id}`}
        title="Hapus Transaksi"
        description="Apakah Anda yakin ingin menghapus transaksi ini? Stok buku yang dibeli akan otomatis dikembalikan ke sistem."
        loading={deleteLoading}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setTxToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
