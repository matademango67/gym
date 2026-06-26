import { useState } from 'react'
import toast from 'react-hot-toast'
import { membershipService } from '../services'

const CreateMembershipModal = ({ isOpen, onClose, onSuccess, required = false }) => {
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('normal')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!type) {
      toast.error('Please select a membership type')
      return
    }

    try {
      setLoading(true)
      await membershipService.create({
        type,
      })
      toast.success('Membership created successfully!')
      onSuccess()
      handleReset()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create membership'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setType('normal')
    if (!required) {
      onClose()
    }
  }

  const handleClose = () => {
    if (!required) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Membership</h2>
          {!required && (
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="normal">Normal - $1500/month</option>
              <option value="vip">VIP - $3000/month</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateMembershipModal
