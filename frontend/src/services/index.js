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

  deleteMe: () =>
    api.delete('/auth/me'),
}

export const customerService = {
  getAll: () =>
    api.get('/customer'),

  search: (search) =>
    api.get(`/customer/search/${search}`),

  create: (data) =>
    api.post('/customer', data),

  update: (id, data) =>
    api.patch(`/customer/${id}`, data),

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
