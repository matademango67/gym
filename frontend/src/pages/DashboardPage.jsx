import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import MembershipTable from '../components/MembershipTable'
import CreateMembershipModal from '../components/CreateMembershipModal'
import EditMembershipModal from '../components/EditMembershipModal'
import { membershipService, paymentService } from '../services'
import { useAuth } from '../context/AuthContext'
import PaymentModal from '../components/PaymentModal'

const DashboardPage = () => {
  const location = useLocation()
  const { user } = useAuth()
  const [memberships, setMemberships] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState(null)

  useEffect(() => {
    fetchMemberships()
    fetchPayments()
  }, [])

  useEffect(() => {
    if (location.state?.showCreateMembership) {
      setShowCreateModal(true)
      // Clear the state so it doesn't trigger again
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const fetchMemberships = async () => {
    try {
      setLoading(true)
      const response = await membershipService.getMe()
      setMemberships(Array.isArray(response.data) ? response.data : [response.data])
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch memberships'
      toast.error(message)
      setMemberships([])
    } finally {
      setLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await paymentService.getMyPayments()
      setPayments(Array.isArray(response.data) ? response.data : [response.data])
    } catch (error) {
      console.error('Failed to fetch payments:', error)
      setPayments([])
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchMemberships()
  }

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    // Small delay to ensure backend has processed the payment
    setTimeout(() => {
      fetchPayments()
      fetchMemberships()
    }, 500)
  }

  const handleEditClick = async (membership) => {
    try {
      await membershipService.changeType()
      toast.success('Membership type changed successfully!')
      fetchMemberships()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to change membership type'
      toast.error(message)
    }
  }

  const handlePauseActivateClick = async (membership) => {
    try {
      await membershipService.changeStatus()
      toast.success('Membership status updated successfully!')
      fetchMemberships()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update membership status'
      toast.error(message)
    }
  }

  const activeCount = memberships.filter((m) => m.status === 'active').length
  const expiredCount = memberships.filter((m) => m.status === 'expired').length
  const bannedCount = memberships.filter((m) => m.status === 'banned').length
  const pausedCount = memberships.filter((m) => m.status === 'paused').length

  // Get unique statuses
  const statusCounts = memberships.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1
    return acc
  }, {})

  const formatDate = (dateValue) => {
    // Handle null, undefined, or empty values
    if (!dateValue || dateValue === null || dateValue === undefined) return '—'
    
    // If it's a number (timestamp), convert it
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    // Convert to string for processing
    const dateString = String(dateValue)
    
    // Handle 'Invalid Date' string
    if (dateString === 'Invalid Date') return '—'
    
    // Try to parse the date
    let date
    if (dateString.includes('T')) {
      // ISO format: 2024-01-15T10:30:00.000Z
      date = new Date(dateString)
    } else if (dateString.includes('-')) {
      // Handle PostgreSQL timestamp format: "2024-01-15 14:30:00"
      if (dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ')
        const [year, month, day] = datePart.split('-')
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      } else {
        // Date format: 2024-01-15
        const [year, month, day] = dateString.split('-')
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }
    } else {
      // Try direct parsing
      date = new Date(dateString)
    }
    
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome, {user?.email?.split('@')[0] || 'User'}!</h1>
          <p className="text-gray-600">Manage your gym memberships and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Object.keys(statusCounts).length > 0 ? (
            Object.entries(statusCounts).map(([status, count]) => {
              const statusColors = {
                active: 'from-green-50 to-emerald-50 border-green-600',
                expired: 'from-red-50 to-rose-50 border-red-600',
                banned: 'from-gray-50 to-gray-100 border-gray-600',
                paused: 'from-yellow-50 to-amber-50 border-yellow-600',
              }
              const colors = statusColors[status] || 'from-blue-50 to-indigo-50 border-blue-600'
              
              return (
                <div key={status} className={`card p-6 bg-gradient-to-br ${colors} border-l-4`}>
                  <p className="text-gray-600 text-sm font-medium capitalize">{status}</p>
                </div>
              )
            })
          ) : (
            <div className="col-span-full card p-6 bg-gray-50 border-l-4 border-gray-600">
              <p className="text-gray-600">No membership status to display</p>
            </div>
          )}
        </div>

        {/* Membership Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">My Membership</h2>
            {memberships.length === 0 ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                + Create Membership (Required)
              </button>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary"
              >
                + Add Payment
              </button>
            )}
          </div>

          {memberships.length > 0 ? (
            <div className="card p-6">
          <MembershipTable
            memberships={memberships}
            loading={loading}
            onEdit={handleEditClick}
            onPauseActivate={handlePauseActivateClick}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
          />
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-600 text-lg mb-4">No membership found</p>
              <p className="text-gray-500">Create a membership to get started</p>
            </div>
          )}
        </div>

        {/* Payment History Section */}
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment History</h2>
          {payments.length > 0 && payments.some(p => p !== null) ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.filter(p => p !== null).map((payment) => (
                    <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-800">{payment.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">${payment.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-800 capitalize">automatic</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="badge-active">
                          approved
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(payment.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-600 py-8">No payments yet</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateMembershipModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        userId={user?.id}
        required={memberships.length === 0}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      />

      {/* EditMembershipModal removed - status change now happens on click */}
    </div>
  )
}

export default DashboardPage
