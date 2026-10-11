import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('mstore_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const unwrap = (data) => data?.data ?? data

export async function login({ username, password }) {
  const { data } = await http.post('/auth/login', { username, password })
  localStorage.setItem('mstore_token', data.token)
  localStorage.setItem('mstore_user', JSON.stringify(data.user))
  return data
}

export function logout() {
  localStorage.removeItem('mstore_token')
  localStorage.removeItem('mstore_user')
}

export function getCurrentUser() {
  const raw = localStorage.getItem('mstore_user')
  return raw ? JSON.parse(raw) : null
}

// Kept for compatibility with existing pages/components that may import these helpers.
export function getLoggedInUser() {
  return getCurrentUser()
}

export async function getProducts() {
  const { data } = await http.get('/products')
  return unwrap(data)
}

export async function searchProducts(q) {
  const { data } = await http.get('/products/search', { params: { q } })
  return unwrap(data)
}

export async function addProduct(product) {
  const { data } = await http.post('/products', product)
  return unwrap(data)
}

export async function updateProduct(id, updates) {
  const { data } = await http.put(`/products/${id}`, updates)
  return unwrap(data)
}

export async function deleteProduct(id) {
  const { data } = await http.delete(`/products/${id}`)
  return unwrap(data)
}

export async function getCustomers() {
  const { data } = await http.get('/customers')
  return unwrap(data)
}

export async function searchCustomersByPhone(phone) {
  const { data } = await http.get('/customers/search', { params: { phone } })
  return unwrap(data)
}

export async function getSupplierTransactions(supplierId) {
  const { data } = await http.get(`/suppliers/${supplierId}/transactions`)
  return unwrap(data)
}

export async function getSuppliers() {
  const { data } = await http.get('/suppliers')
  return unwrap(data)
}

export async function addSupplier(supplier) {
  const { data } = await http.post('/suppliers', supplier)
  return unwrap(data)
}

export async function getPurchases() {
  const { data } = await http.get('/purchases')
  return unwrap(data)
}

export async function addPurchase(purchase) {
  const { data } = await http.post('/purchases', purchase)
  return unwrap(data)
}

export async function getBillByNumber(billNo) {
  const { data } = await http.get(`/bills/${encodeURIComponent(billNo)}`)
  return unwrap(data)
}

export async function getBills() {
  const { data } = await http.get('/bills')
  return unwrap(data)
}

export async function createBill(bill) {
  const { data } = await http.post('/bills', bill)
  return unwrap(data)
}

export async function createReturn(payload) {
  const { data } = await http.post('/returns', payload)
  return unwrap(data)
}

export async function getDashboardStats() {
  const { data } = await http.get('/dashboard/stats')
  return unwrap(data)
}

export async function getReports(type, params = {}) {
  const { data } = await http.get(`/reports/${type}`, { params })
  return unwrap(data)
}

export async function getReportDetail(kind, id) {
  const { data } = await http.get(
    `/report-details/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`
  )

  return unwrap(data)
}

export async function getSettings() {
  const { data } = await http.get('/settings')
  return unwrap(data)
}

export async function updateSettings(settings) {
  const { data } = await http.put('/settings', settings)
  return unwrap(data)
}
