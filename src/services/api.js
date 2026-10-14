

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const http = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } })
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('mstore_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const unwrap = (data) => data?.data ?? data
const normalizeRole = (role) => String(role || '').trim().toLowerCase().replace(/[ -]+/g, '_')
export const isFullAccessUser = (user) => ['admin', 'super_admin', 'superadmin'].includes(normalizeRole(user?.role))
export function hasPermission(user, section, action = 'view') {
  if (!user) return false
  if (isFullAccessUser(user)) return true
  return user.permissions?.[section]?.[action] === true
}

export async function login({ username, password }) {
  const { data } = await http.post('/auth/login', { username, password })
  localStorage.setItem('mstore_token', data.token)
  localStorage.setItem('mstore_user', JSON.stringify(data.user))
  return data
}
export function logout() { localStorage.removeItem('mstore_token'); localStorage.removeItem('mstore_user') }
export function getCurrentUser() { try { const raw = localStorage.getItem('mstore_user'); return raw ? JSON.parse(raw) : null } catch { return null } }
export function getLoggedInUser() { return getCurrentUser() }
export async function getStaffOptions() { const { data } = await http.get('/auth/staff-options'); return unwrap(data) }
export async function getUsers() { const { data } = await http.get('/users'); return unwrap(data) }
export async function createUser(user) { const { data } = await http.post('/users', user); return unwrap(data) }
export async function updateUser(id, user) { const { data } = await http.put(`/users/${id}`, user); return unwrap(data) }

export async function getProducts() { const { data } = await http.get('/products'); return unwrap(data) }
export async function searchProducts(q) { const { data } = await http.get('/products/search', { params: { q } }); return unwrap(data) }
export async function addProduct(product) { const { data } = await http.post('/products', product); return unwrap(data) }
export async function updateProduct(id, updates) { const { data } = await http.put(`/products/${id}`, updates); return unwrap(data) }
export async function deleteProduct(id) { const { data } = await http.delete(`/products/${id}`); return unwrap(data) }
export async function getCustomers() { const { data } = await http.get('/customers'); return unwrap(data) }
export async function searchCustomersByPhone(phone) { const { data } = await http.get('/customers/search', { params: { phone } }); return unwrap(data) }
export async function getSupplierTransactions(supplierId) { const { data } = await http.get(`/suppliers/${supplierId}/transactions`); return unwrap(data) }
export async function getSuppliers() { const { data } = await http.get('/suppliers'); return unwrap(data) }
export async function addSupplier(supplier) { const { data } = await http.post('/suppliers', supplier); return unwrap(data) }
export async function getPurchases() { const { data } = await http.get('/purchases'); return unwrap(data) }
export async function addPurchase(purchase) { const { data } = await http.post('/purchases', purchase); return unwrap(data) }
export async function getBillByNumber(billNo) { const { data } = await http.get(`/bills/${encodeURIComponent(billNo)}`); return unwrap(data) }
export async function getBills() { const { data } = await http.get('/bills'); return unwrap(data) }
export async function createBill(bill) { const { data } = await http.post('/bills', bill); return unwrap(data) }
export async function createReturn(payload) { const { data } = await http.post('/returns', payload); return unwrap(data) }
export async function getDashboardStats() { const { data } = await http.get('/dashboard/stats'); return unwrap(data) }
export async function getReports(type, params = {}) { const { data } = await http.get(`/reports/${type}`, { params }); return unwrap(data) }
export async function getReportDetail(kind, id) { const { data } = await http.get(`/report-details/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`); return unwrap(data) }

const STORE_SETTINGS_KEY = 'mstore_settings'
export const STORE_SETTINGS_EVENT = 'mstore-settings-updated'

const DEFAULT_STORE_SETTINGS = {
  name: 'Narayan Hospital',
  subtitle: 'Medical Store',
  phone: '',
  email: '',
  address: '',
  gstin: '',
}

function normalizeStoreSettings(settings = {}) {
  return {
    ...DEFAULT_STORE_SETTINGS,
    ...settings,
    name: settings.name ?? DEFAULT_STORE_SETTINGS.name,
    subtitle: settings.subtitle ?? DEFAULT_STORE_SETTINGS.subtitle,
    phone: settings.phone ?? '',
    email: settings.email ?? '',
    address: settings.address ?? '',
    gstin: settings.gstin ?? '',
  }
}

function publishStoreSettings(settings) {
  const normalized = normalizeStoreSettings(settings)

  localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(normalized))

  window.dispatchEvent(
    new CustomEvent(STORE_SETTINGS_EVENT, {
      detail: normalized,
    })
  )

  return normalized
}

export function getCachedStoreSettings() {
  try {
    const saved = localStorage.getItem(STORE_SETTINGS_KEY)
    return saved
      ? normalizeStoreSettings(JSON.parse(saved))
      : DEFAULT_STORE_SETTINGS
  } catch {
    return DEFAULT_STORE_SETTINGS
  }
}

export async function getSettings() {
  const { data } = await http.get('/settings')
  return publishStoreSettings(unwrap(data) || {})
}

export async function updateSettings(settings) {
  const { data } = await http.put('/settings', settings)
  return publishStoreSettings(unwrap(data) || settings)
}
