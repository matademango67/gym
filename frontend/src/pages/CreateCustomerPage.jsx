import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { customerService } from '../services'

const CreateCustomerPage = () => {
  const [name, setName] = useState('')
  const [birth, setBirth] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!name || !birth) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      await customerService.create({ name, birth })
      toast.success('Customer profile created successfully!')
      
      // Navigate to dashboard after successful creation
      setTimeout(() => {
        navigate('/dashboard', { state: { showCreateMembership: true } })
      }, 1000)
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to create customer profile'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
      <div className="card w-full max-w-md p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Create Customer Profile</h1>
        <p className="text-center text-gray-600 mb-8">Complete your profile to continue</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="input-field"
              disabled={loading}
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
            <input
              type="date"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="input-field"
              disabled={loading}
              min="1935-01-01"
              max="2011-01-01"
            />
            <p className="text-xs text-gray-500 mt-1">You must be at least 15 years old</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                Creating profile...
              </span>
            ) : (
              'Create Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateCustomerPage