import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { membershipService } from '../services'

const EditMembershipModal = ({ isOpen, onClose, membership, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('active')
  const [type, setType] = useState('normal')

  useEffect(() => {
    if (membership) {
      setStatus(membership.status || 'active')
      setType(membership.type || 'normal')
    }
  }, [membership])

  const handleStatusChange = async () => {
    try {
      setLoading(true)
      await membershipService.changeStatus()
      toast.success('Membership status updated!')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update status'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = async () => {
    try {
      setLoading(true)
      await membershipService.changeType()
      toast.success('Membership type updated!')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update type'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !membership) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Membership</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="flex gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field flex-1"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={handleStatusChange}
                className="btn-primary disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '...' : 'Update'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-2">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field flex-1"
                disabled={loading}
              >
                <option value="normal">Normal</option>
                <option value="vip">VIP</option>
              </select>
              <button
                onClick={handleTypeChange}
                className="btn-primary disabled:opacity-50"
                disabled={loading}
              >
                {loading ? '...' : 'Update'}
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-gray-600"><span className="font-semibold">Created:</span> {new Date(membership.created_at).toLocaleDateString()}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Expires:</span> {membership.expire ? new Date(membership.expire).toLocaleDateString() : 'Never'}</p>
            <p className="text-sm text-gray-600"><span className="font-semibold">Cost:</span> ${membership.cost}</p>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary w-full mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditMembershipModal
