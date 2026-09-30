

import { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { getCurrentUser } from './services/api'

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
  '/dashboard': 'Dashboard',
  '/products': 'Product Management',
  '/purchase': 'Purchase (Stock In)',
  '/billing': 'Billing (POS)',
  '/inventory': 'Inventory / Stock',
  '/expiry': 'Expiry Management',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports',
  '/returns': 'Returns / Credit Note',
  '/settings': 'Settings',
}

// ===============================
// PROTECTED ROUTES
// ===============================
function RequireAuth() {
  const user = getCurrentUser()
  const location = useLocation()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return <Outlet />
}

// ===============================
// DASHBOARD LAYOUT
// ===============================
function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const title = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-surface-bg">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ===============================
// APP ROUTES
// ===============================
export default function App() {
  return (
    <Routes>

      {/* =================================
          LOGIN
      ================================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* =================================
          PROTECTED APPLICATION
      ================================= */}
      <Route element={<RequireAuth />}>

        <Route element={<DashboardShell />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/purchase"
            element={<Purchase />}
          />

          <Route
            path="/billing"
            element={<Billing />}
          />

          <Route
            path="/inventory"
            element={<Inventory />}
          />

          <Route
            path="/expiry"
            element={<ExpiryManagement />}
          />

          <Route
            path="/suppliers"
            element={<Suppliers />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/returns"
            element={<Returns />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>

      </Route>

      {/* =================================
          WEBSITE START
          → LOGIN FIRST
      ================================= */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* =================================
          UNKNOWN URL
          → LOGIN
      ================================= */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />

    </Routes>
  )
}

