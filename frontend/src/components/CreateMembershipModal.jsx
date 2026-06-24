import { useState } from 'react'
import toast from 'react-hot-toast'
import { membershipService, customerService } from '../services'

const CreateMembershipModal = ({ isOpen, onClose, onSuccess, userId }) => {
  const [loading, setLoading] = useState(false)
  const [customerId, setCustomerId] = useState('')
  const [type, setType] = useState('normal')
  const [customers, setCustomers] = useState([])
  const [showCustomers, setShowCustomers] = useState(false)

  const handleSearchCustomer = async (e) => {
    const value = e.target.value
    setCustomerId(value)

    if (value.length > 0) {
      try {
        const response = await customerService.search(value)
        setCustomers(Array.isArray(response.data) ? response.data : [response.data])
        setShowCustomers(true)
      } catch (error) {
        setShowCustomers(false)
      }
    } else {
      setShowCustomers(false)
    }
  }

  const handleSelectCustomer = (customer) => {
    setCustomerId(customer.id)
    setShowCustomers(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!customerId || !type) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await membershipService.create({
        customer_id: customerId,
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
    setCustomerId('')
    setType('normal')
    setCustomers([])
    setShowCustomers(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create Membership</h2>
          <button
            onClick={handleReset}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <input
              type="text"
              value={customerId}
              onChange={handleSearchCustomer}
              placeholder="Search customer ID or name"
              className="input-field"
              disabled={loading}
              autoComplete="off"
            />
            {showCustomers && customers.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
                {customers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => handleSelectCustomer(customer)}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50 border-b last:border-b-0"
                  >
                    <p className="font-semibold text-gray-800">{customer.name}</p>
                    <p className="text-sm text-gray-600">ID: {customer.id}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input-field"
              disabled={loading}
            >
              <option value="normal">Normal - $15/month</option>
              <option value="vip">VIP - $30/month</option>
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
