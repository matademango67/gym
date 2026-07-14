import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import MembershipTable from '../components/MembershipTable'
import CreateMembershipModal from '../components/CreateMembershipModal'
import EditMembershipModal from '../components/EditMembershipModal'
import { membershipService, paymentService, authService, customerService } from '../services'
import { useAuth } from '../context/AuthContext'
import PaymentModal from '../components/PaymentModal'

const DashboardPage = () => {
  const location = useLocation()
  const { user, updateUser } = useAuth()
  const [memberships, setMemberships] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState(null)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  
  // User status from backend
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    fetchMemberships()
    fetchPayments()
    fetchUserStatus()
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

  const handleDeactivateAccount = async (reason) => {
    try {
      await authService.deleteMe(reason)
      toast.success('Account deactivated successfully')
      setShowDeactivateModal(false)
      // Redirect to login or show appropriate message
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to deactivate account'
      toast.error(message)
    }
  }

  const handleUpdateProfile = async (data) => {
    try {
      // Update customer profile
      await customerService.update(null, data)
      toast.success('Profile updated successfully!')
      setShowEditProfileModal(false)
      // Refresh user data
      fetchUserStatus()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile'
      toast.error(message)
    }
  }

  const fetchUserStatus = async () => {
    try {
      const response = await authService.getMe()
      console.log('User status response:', response.data) // Debug log
      // The backend returns { message: "...", user: {...} }
      const userData = response.data.user || response.data
      setUserData(userData)
      // Update the auth context with the fresh user data
      if (updateUser && userData) {
        updateUser(userData)
      }
    } catch (error) {
      console.error('Failed to fetch user status:', error)
      // Don't show error toast for this - it's not critical
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

        {/* User Status Card */}
        <div className="mb-8">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Account Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  userData?.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : userData?.status === 'inactive'
                    ? 'bg-red-100 text-red-800'
                    : userData?.status === 'banned'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {userData?.status ? userData.status.charAt(0).toUpperCase() + userData.status.slice(1) : 'Active'}
                </span>
                <span className="text-gray-600 text-sm">
                  {userData?.status === 'active' ? 'Your account is active' : 
                   userData?.status === 'inactive' ? 'Your account is deactivated' :
                   userData?.status === 'banned' ? 'Your account is banned' : 'Account status unknown'}
                </span>
              </div>
              {userData?.status === 'active' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowDeactivateModal(true)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition-colors"
                  >
                    Deactivate Account
                  </button>
                </div>
              )}
            </div>
          </div>
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
                        {formatDate(payment.time)}
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

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <EditProfileModal
          customer={userData}
          onSave={handleUpdateProfile}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <DeactivateAccountModal
          onConfirm={handleDeactivateAccount}
          onClose={() => setShowDeactivateModal(false)}
        />
      )}
    </div>
  )
}

// Edit Profile Modal Component
const EditProfileModal = ({ customer, onSave, onClose }) => {
  const [name, setName] = useState(customer?.name || '')
  const [birth, setBirth] = useState(customer?.birth || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({ name, birth })
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="input-field"
              required
              max={new Date().toISOString().split('T')[0]}
              style={{
                colorScheme: 'light'
              }}
            />
            <style>{`
              input[type="date"]::-webkit-calendar-picker-indicator {
                display: none;
                -webkit-appearance: none;
              }
              input[type="date"]::-moz-calendar-picker-indicator {
                display: none;
              }
            `}</style>
            <p className="text-xs text-gray-500 mt-1">Click the field and use arrow keys to adjust the date</p>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Deactivate Account Modal Component
const DeactivateAccountModal = ({ onConfirm, onClose }) => {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      toast.error('Please provide a reason for deactivating your account')
      return
    }
    setLoading(true)
    try {
      await onConfirm(reason)
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Deactivate Account</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to deactivate your account? This action cannot be undone.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Deactivation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Please provide a reason for deactivating your account..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be logged and visible to administrators.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Deactivating...' : 'Confirm Deactivation'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DashboardPage
