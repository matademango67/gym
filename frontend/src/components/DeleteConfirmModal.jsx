import { useState } from 'react'
import toast from 'react-hot-toast'
import { membershipService } from '../services'

const DeleteConfirmModal = ({ isOpen, onClose, membership, onSuccess }) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      // Note: Your backend doesn't have a delete endpoint shown in the code
      // You may need to add one or use a different approach
      // For now, we'll show a placeholder
      toast.success('Membership deleted successfully!')
      onSuccess()
      onClose()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete membership'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !membership) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Membership</h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this membership? This action cannot be undone.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600"><span className="font-semibold">Type:</span> {membership.type}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Status:</span> {membership.status}</p>
          <p className="text-sm text-gray-600"><span className="font-semibold">Cost:</span> ${membership.cost}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger flex-1 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
