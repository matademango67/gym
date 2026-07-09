import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeactivateAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to deactivate your account? After disabling the account, only the staff can activate it.'
    )
    
    if (confirmed) {
      try {
        await deleteAccount()
      } catch (error) {
        // Error is already handled in AuthContext
      }
    }
  }

  const isAdminOrEmployee = user?.role === 'admin' || user?.role === 'employee'

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-lg">
              <span className="text-white font-bold">💪</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Gym Hub</h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden sm:block">
              <p className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-gray-800">{user?.email}</span>
              </p>
            </div>

            {/* Show Admin link only for admin and employee roles */}
            {isAdminOrEmployee && (
              <button
                onClick={() => navigate('/admin')}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors duration-200"
              >
                Admin Panel
              </button>
            )}

            <button
              onClick={handleDeactivateAccount}
              className="px-4 py-2 rounded-lg bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors duration-200"
            >
              Deactivate Account
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
