import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import MembershipTable from '../components/MembershipTable'
import CreateMembershipModal from '../components/CreateMembershipModal'
import EditMembershipModal from '../components/EditMembershipModal'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import { membershipService } from '../services'
import { useAuth } from '../context/AuthContext'

const DashboardPage = () => {
  const { user } = useAuth()
  const [memberships, setMemberships] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMembership, setSelectedMembership] = useState(null)

  useEffect(() => {
    fetchMemberships()
  }, [])

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

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchMemberships()
  }

  const handleEditClick = (membership) => {
    setSelectedMembership(membership)
    setShowEditModal(true)
  }

  const handleDeleteClick = (membership) => {
    setSelectedMembership(membership)
    setShowDeleteModal(true)
  }

  const handleEditSuccess = () => {
    setShowEditModal(false)
    fetchMemberships()
  }

  const handleDeleteSuccess = () => {
    setShowDeleteModal(false)
    fetchMemberships()
  }

  const activeCount = memberships.filter((m) => m.status === 'active').length
  const expiredCount = memberships.filter((m) => m.status === 'expired').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your gym memberships</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-indigo-600">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Memberships</p>
            <p className="text-3xl font-bold text-indigo-600">{memberships.length}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-medium mb-2">Active</p>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </div>

          <div className="card p-6 bg-gradient-to-br from-red-50 to-rose-50 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm font-medium mb-2">Expired</p>
            <p className="text-3xl font-bold text-red-600">{expiredCount}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by membership ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              + New Membership
            </button>
          </div>
        </div>

        {/* Memberships Table */}
        <div className="card p-6">
          <MembershipTable
            memberships={memberships}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {/* Modals */}
      <CreateMembershipModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
        userId={user?.id}
      />

      <EditMembershipModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        membership={selectedMembership}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        membership={selectedMembership}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}

export default DashboardPage
