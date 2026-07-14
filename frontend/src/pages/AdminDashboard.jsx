import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminService } from '../services'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState('users')

  // Users state
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersSearch, setUsersSearch] = useState('')

  // Customers state
  const [customers, setCustomers] = useState([])
  const [customersLoading, setCustomersLoading] = useState(false)
  const [customersSearch, setCustomersSearch] = useState('')

  // Payments state
  const [payments, setPayments] = useState([])
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [paymentsSearch, setPaymentsSearch] = useState('')

  // Memberships state
  const [memberships, setMemberships] = useState([])
  const [membershipsLoading, setMembershipsLoading] = useState(false)
  const [membershipsSearch, setMembershipsSearch] = useState('')

  // Modals state
  const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false)
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false)
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false)
  const [showEditMembershipModal, setShowEditMembershipModal] = useState(false)
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [statusChangeData, setStatusChangeData] = useState({ userId: null, status: null })

  // Fetch functions
  const fetchUsers = async () => {
    try {
      setUsersLoading(true)
      const response = await adminService.getAllUsers()
      setUsers(Array.isArray(response.data) ? response.data : [response.data])
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch users'
      toast.error(message)
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchCustomers = async (searchTerm = '') => {
    try {
      setCustomersLoading(true)
      if (searchTerm) {
        // Use search endpoint if search term is provided
        const response = await adminService.searchCustomer(searchTerm)
        setCustomers(Array.isArray(response.data) ? response.data : [response.data])
      } else {
        // Use getAll endpoint if no search term
        const response = await adminService.getAllCustomers()
        setCustomers(Array.isArray(response.data) ? response.data : [response.data])
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch customers'
      toast.error(message)
    } finally {
      setCustomersLoading(false)
    }
  }

  const fetchPayments = async () => {
    try {
      setPaymentsLoading(true)
      // Backend endpoint: GET /admin/payments (requires admin/employee role)
      const response = await adminService.getAllPayments()
      setPayments(Array.isArray(response.data) ? response.data : [response.data])
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch payments'
      toast.error(message)
    } finally {
      setPaymentsLoading(false)
    }
  }

  const fetchMemberships = async () => {
    try {
      setMembershipsLoading(true)
      // TODO: Verify this endpoint returns all memberships for admin view
      // Backend endpoint: GET /membership (no auth required based on router)
      const response = await adminService.getAllMemberships()
      setMemberships(Array.isArray(response.data) ? response.data : [response.data])
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to fetch memberships'
      toast.error(message)
    } finally {
      setMembershipsLoading(false)
    }
  }

  useEffect(() => {
    if (activeSection === 'users') fetchUsers()
    if (activeSection === 'customers') fetchCustomers(customersSearch)
    if (activeSection === 'payments') fetchPayments()
    if (activeSection === 'memberships') fetchMemberships()
  }, [activeSection])

  const handleLogout = async () => {
    await logout()
    window.location.href = '/login'
  }

  const handleCreateEmployee = async (email, password) => {
    try {
      // TODO: Verify this endpoint creates employee users
      // Backend endpoint: POST /admin/register/employee (requires admin role)
      await adminService.registerEmployee(email, password)
      toast.success('Employee created successfully!')
      setShowCreateEmployeeModal(false)
      fetchUsers()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create employee'
      toast.error(message)
    }
  }

  const handleCreateAdmin = async (email, password) => {
    try {
      // TODO: Verify this endpoint creates admin users
      // Backend endpoint: POST /admin/register (requires admin role)
      await adminService.registerAdmin(email, password)
      toast.success('Admin created successfully!')
      setShowCreateAdminModal(false)
      fetchUsers()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create admin'
      toast.error(message)
    }
  }

  const handleChangeUserStatus = async (userId, status) => {
    setStatusChangeData({ userId, status })
    setShowStatusChangeModal(true)
  }

  const handleStatusChangeConfirm = async (reason) => {
    if (!reason || reason.trim() === '') {
      toast.error('Please provide a reason for the status change')
      return
    }

    try {
      await adminService.setUserStatus(statusChangeData.userId, statusChangeData.status, reason.trim())
      toast.success('User status updated successfully!')
      setShowStatusChangeModal(false)
      setStatusChangeData({ userId: null, status: null })
      fetchUsers()
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user status'
      toast.error(message)
    }
  }

  const handleUpdateCustomer = async (customerId, data) => {
    try {
      // TODO: Verify this endpoint works for admin updates
      // Backend endpoint: PATCH /customer/:id (requires admin/employee role)
      await adminService.updateCustomer(customerId, data)
      toast.success('Customer updated successfully!')
      setShowEditCustomerModal(false)
      fetchCustomers()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update customer'
      toast.error(message)
    }
  }

  const handleChangeMembershipType = async (membership) => {
    try {
      await adminService.changeMembershipType(membership.user_id)
      toast.success('Membership type changed successfully!')
      fetchMemberships()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to change membership type'
      toast.error(message)
    }
  }

  const handleChangeMembershipStatus = async (membership) => {
    try {
      await adminService.changeMembershipStatus(membership.user_id)
      toast.success('Membership status updated successfully!')
      fetchMemberships()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update membership status'
      toast.error(message)
    }
  }

  const scrollToSection = (section) => {
    setActiveSection(section)
    // Reset search when switching to customers section
    if (section === 'customers') {
      setCustomersSearch('')
      fetchCustomers()
    }
  }

  const handleCustomerSearch = (e) => {
    const value = e.target.value
    setCustomersSearch(value)
    fetchCustomers(value)
  }

  // Filter functions
  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(usersSearch.toLowerCase()) ||
    user.id?.toString().includes(usersSearch)
  )

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(customersSearch.toLowerCase()) ||
    customer.email?.toLowerCase().includes(customersSearch.toLowerCase()) ||
    customer.id?.toString().includes(customersSearch)
  )

  const filteredPayments = payments.filter(payment =>
    payment.id?.toString().includes(paymentsSearch) ||
    payment.user_id?.toString().includes(paymentsSearch)
  )

  const filteredMemberships = memberships.filter(membership =>
    membership.id?.toString().includes(membershipsSearch) ||
    membership.user_id?.toString().includes(membershipsSearch)
  )

  const formatDate = (dateValue) => {
    if (!dateValue || dateValue === null || dateValue === undefined) return '—'
    if (typeof dateValue === 'number') {
      const date = new Date(dateValue)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    const dateString = String(dateValue)
    if (dateString === 'Invalid Date') return '—'
    let date
    if (dateString.includes('T')) {
      date = new Date(dateString)
    } else if (dateString.includes('-')) {
      // Handle PostgreSQL timestamp format: "2024-01-15 14:30:00"
      if (dateString.includes(' ')) {
        const [datePart, timePart] = dateString.split(' ')
        const [year, month, day] = datePart.split('-')
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      } else {
        // Handle date-only format: "2024-01-15"
        const [year, month, day] = dateString.split('-')
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      }
    } else {
      date = new Date(dateString)
    }
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, customers, payments, and memberships</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            <button
              onClick={() => scrollToSection('users')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeSection === 'users'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => scrollToSection('memberships')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeSection === 'memberships'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Memberships
            </button>
            <button
              onClick={() => scrollToSection('customers')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeSection === 'customers'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => scrollToSection('payments')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeSection === 'payments'
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              Payments
            </button>
          </div>
        </div>

        {/* Users Section */}
        {activeSection === 'users' && (
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
              {user?.role === 'admin' && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowCreateEmployeeModal(true)}
                    className="btn-primary"
                  >
                    + Create Employee
                  </button>
                  <button
                    onClick={() => setShowCreateAdminModal(true)}
                    className="btn-success"
                  >
                    + Create Admin
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search users by email or ID..."
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Users Table */}
            {usersLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status Reason</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">{user.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="badge-active capitalize">{user.role}</span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.status_reason || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                            <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleChangeUserStatus(user.id, 'active')}
                              className="px-3 py-1 rounded bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                            >
                              Activate
                            </button>
                            <button
                              onClick={() => handleChangeUserStatus(user.id, 'inactive')}
                              className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleChangeUserStatus(user.id, 'banned')}
                              className="px-3 py-1 rounded bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
                            >
                              Ban
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No users found</p>
              </div>
            )}
          </div>
        )}

        {/* Memberships Section */}
        {activeSection === 'memberships' && (
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Memberships Management</h2>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search memberships by ID or user ID..."
                value={membershipsSearch}
                onChange={(e) => setMembershipsSearch(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Memberships Table */}
            {membershipsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredMemberships.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Start Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">End Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMemberships.map((membership) => (
                      <tr key={membership.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">{membership.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{membership.user_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{membership.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 capitalize">{membership.type}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            membership.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : membership.status === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : membership.status === 'paused'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {membership.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(membership.start_date)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(membership.end_date)}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => handleChangeMembershipType(membership)}
                              className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                              title="Change membership type (Normal/VIP)"
                            >
                              Edit Type
                            </button>
                            <button
                              onClick={() => handleChangeMembershipStatus(membership)}
                              className={`px-3 py-1 rounded text-white text-xs font-semibold transition-colors ${
                                membership.status === 'paused'
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-yellow-600 hover:bg-yellow-700'
                              }`}
                              title={membership.status === 'paused' ? 'Activate membership' : 'Pause membership'}
                            >
                              {membership.status === 'paused' ? 'Activate' : 'Pause'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No memberships found</p>
              </div>
            )}
          </div>
        )}

        {/* Customers Section */}
        {activeSection === 'customers' && (
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Customers Management</h2>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search customers by name, email, or ID..."
                value={customersSearch}
                onChange={handleCustomerSearch}
                className="input-field"
              />
            </div>

            {/* Customers Table */}
            {customersLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Birth Date</th>
                    </tr>
                  </thead>
                    <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">{customer.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{customer.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{customer.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{formatDate(customer.birth)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No customers found</p>
              </div>
            )}
          </div>
        )}

        {/* Payments Section */}
        {activeSection === 'payments' && (
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Payments Management</h2>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search payments by ID or user ID..."
                value={paymentsSearch}
                onChange={(e) => setPaymentsSearch(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Payments Table */}
            {paymentsLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">User ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Method</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-800">{payment.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{payment.user_id}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">${payment.amount}</td>
                        <td className="px-6 py-4 text-sm text-gray-800 capitalize">{payment.method || 'automatic'}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="badge-active">{payment.status || 'approved'}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(payment.time)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No payments found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Employee Modal */}
      {showCreateEmployeeModal && (
        <CreateUserModal
          title="Create Employee"
          onSubmit={handleCreateEmployee}
          onClose={() => setShowCreateEmployeeModal(false)}
          role="employee"
        />
      )}

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <CreateUserModal
          title="Create Admin"
          onSubmit={handleCreateAdmin}
          onClose={() => setShowCreateAdminModal(false)}
          role="admin"
        />
      )}

      {/* Edit Customer Modal */}
      {showEditCustomerModal && selectedItem && (
        <EditCustomerModal
          customer={selectedItem}
          onSave={handleUpdateCustomer}
          onClose={() => {
            setShowEditCustomerModal(false)
            setSelectedItem(null)
          }}
        />
      )}

      {/* Edit Membership Modal */}
      {showEditMembershipModal && selectedItem && (
        <EditMembershipModal
          membership={selectedItem}
          onClose={() => {
            setShowEditMembershipModal(false)
            setSelectedItem(null)
          }}
          onSuccess={() => {
            fetchMemberships()
            setShowEditMembershipModal(false)
            setSelectedItem(null)
          }}
        />
      )}

      {/* Status Change Modal */}
      {showStatusChangeModal && (
        <StatusChangeModal
          status={statusChangeData.status}
          onConfirm={handleStatusChangeConfirm}
          onClose={() => {
            setShowStatusChangeModal(false)
            setStatusChangeData({ userId: null, status: null })
          }}
        />
      )}
    </div>
  )
}

// Create User Modal Component
const CreateUserModal = ({ title, onSubmit, onClose, role }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(email, password)
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              minLength="6"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create'}
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

// Edit Customer Modal Component
const EditCustomerModal = ({ customer, onSave, onClose }) => {
  const [name, setName] = useState(customer?.name || '')
  const [birth, setBirth] = useState(customer?.birth || '')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(customer.id, { name, birth })
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Customer</h3>
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

// Edit Membership Modal Component (reuses existing component)
import EditMembershipModal from '../components/EditMembershipModal'

// Status Change Modal Component
const StatusChangeModal = ({ status, onConfirm, onClose }) => {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirm(reason)
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600'
      case 'inactive':
        return 'text-red-600'
      case 'banned':
        return 'text-gray-600'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Change User Status</h3>
        <p className="text-gray-600 mb-6">
          You are about to change the user status to:{' '}
          <span className={`font-semibold capitalize ${getStatusColor(status)}`}>{status}</span>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Status Change <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-field"
              rows="4"
              placeholder="Please provide a detailed reason for this status change..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This reason will be logged and visible to the user.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Updating...' : 'Confirm Change'}
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

export default AdminDashboard
