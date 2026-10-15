

import { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { getCurrentUser, hasPermission } from './services/api'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Purchase from './pages/Purchase'
import Billing from './pages/Billing'
import Inventory from './pages/Inventory'
import ExpiryManagement from './pages/ExpiryManagement'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import Returns from './pages/Returns'
import Settings from './pages/Settings'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard', '/products': 'Product Management',
  '/purchase': 'Purchase (Stock In)', '/billing': 'Billing (POS)',
  '/inventory': 'Inventory / Stock', '/expiry': 'Expiry Management',
  '/suppliers': 'Suppliers', '/reports': 'Reports',
  '/returns': 'Returns / Credit Note', '/settings': 'Settings',
}

function RequireAuth() {
  const user = getCurrentUser()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

function PermissionRoute({ section, children }) {
  const user = getCurrentUser()
  if (!hasPermission(user, section, 'view')) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-surface-bg">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route element={<DashboardShell />}>
          <Route path="/dashboard" element={<PermissionRoute section="dashboard"><Dashboard /></PermissionRoute>} />
          <Route path="/products" element={<PermissionRoute section="products"><Products /></PermissionRoute>} />
          <Route path="/purchase" element={<PermissionRoute section="purchase"><Purchase /></PermissionRoute>} />
          <Route path="/billing" element={<PermissionRoute section="billing"><Billing /></PermissionRoute>} />
          <Route path="/inventory" element={<PermissionRoute section="inventory"><Inventory /></PermissionRoute>} />
          <Route path="/expiry" element={<PermissionRoute section="expiry"><ExpiryManagement /></PermissionRoute>} />
          <Route path="/suppliers" element={<PermissionRoute section="suppliers"><Suppliers /></PermissionRoute>} />
          <Route path="/reports" element={<PermissionRoute section="reports"><Reports /></PermissionRoute>} />
          <Route path="/returns" element={<PermissionRoute section="returns"><Returns /></PermissionRoute>} />
          <Route path="/settings" element={<PermissionRoute section="settings"><Settings /></PermissionRoute>} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

