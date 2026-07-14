import api from './api'

export const authService = {
  register: (email, password) =>
    api.post('/auth/register', { email, password }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  logout: () =>
    api.delete('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh'),

  deleteMe: (status_reason) =>
    api.delete('/auth/me', { data: { status_reason } }),

  getMe: () =>
    api.get('/auth/'),
}

export const customerService = {
  getAll: () =>
    api.get('/customer'),

  search: (search) =>
    api.get(`/customer/search/${search}`),

  create: (data) =>
    api.post('/customer', data),

  update: (id, data) =>
    api.patch('/customer', data),

  delete: (id) =>
    api.delete('/customer', { data: { id } }),
}

export const membershipService = {
  getAll: () =>
    api.get('/membership'),

  getMe: () =>
    api.get('/membership/me'),

  create: (data) =>
    api.post('/membership', data),

  changeStatus: () =>
    api.patch('/membership/status'),

  changeType: () =>
    api.patch('/membership/type'),
}

export const paymentService = {
  getAll: () =>
    api.get('/payments'),

  getMyPayments: () =>
    api.get('/payments'),

  create: (data) =>
    api.post('/payments', data),
}

export const adminService = {
  // Users
  getAllUsers: () =>
    api.get('/admin'),

  registerEmployee: (email, password) =>
    api.post('/admin/register/employee', { email, password }),

  registerAdmin: (email, password) =>
    api.post('/admin/register', { email, password }),

  setUserStatus: (userId, status, reason) =>
    api.patch('/admin/setUserStatus', { user_id: userId, status, status_reason: reason }),

  // Customers - Admin view (all customers)
  getAllCustomers: () =>
    api.get('/admin/customers'),

  searchCustomer: (search) =>
    api.get(`/admin/findcustomer/${search}`),

  updateCustomer: (id, data) =>
    api.patch(`/customer/${id}`, data),

  // Memberships - Admin view (all memberships)
  getAllMemberships: () =>
    api.get('/admin/memberships'),

  // Membership management - Admin
  changeMembershipStatus: (membershipId) =>
    api.patch('/admin/updatemembership/status', { membership_id: membershipId }),

  changeMembershipType: (membershipId) =>
    api.patch('/admin/updatemembership/type', { membership_id: membershipId }),

  // Payments - Admin view (all payments)
  getAllPayments: () =>
    api.get('/admin/payments'),
}
