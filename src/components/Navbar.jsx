
import { useState } from 'react'
import { Search, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../services/api'

export default function Navbar({ onMenuClick }) {
  const user = getCurrentUser()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const time = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  const searchRoutes = [
    // TODAY SALES MUST COME BEFORE GENERAL SALES
    {
      keywords: [
        'today sale',
        'today sales',
        'sales today',
        'sale today',
        'today sale report',
        'today sales report',
      ],
      path: '/reports',
      section: 'today-sales',
    },

    // Dashboard
    {
      keywords: ['dashboard', 'home', 'main'],
      path: '/dashboard',
    },

    // Billing
    {
      keywords: ['bill', 'billing', 'pos'],
      path: '/billing',
    },

    // Products
    {
      keywords: ['product', 'products', 'medicine', 'medicines'],
      path: '/products',
    },

    // Purchase
    {
      keywords: ['purchase', 'purchases', 'buy'],
      path: '/purchase',
    },

    // Inventory / Stock
    {
      keywords: ['stock', 'inventory', 'inventories'],
      path: '/inventory',
    },

    // Expiry
    {
      keywords: ['expiry', 'expired', 'expiration'],
      path: '/expiry',
    },

    // Suppliers
    {
      keywords: ['supplier', 'suppliers', 'vendor', 'vendors'],
      path: '/suppliers',
    },

    // Reports
    {
      keywords: ['report', 'reports', 'analytics'],
      path: '/reports',
    },

    // Returns
    {
      keywords: ['return', 'returns', 'credit', 'credit note'],
      path: '/returns',
    },

    // Settings
    {
      keywords: ['setting', 'settings', 'configuration'],
      path: '/settings',
    },
  ]

  const findRoute = (value) => {
    const text = value.trim().toLowerCase()

    if (!text) return null

    /*
      First check exact/multi-word matches.
      This makes "today sale" go to Today Sales
      instead of normal Sales/Billing.
    */
    const exactMatch = searchRoutes.find((item) =>
      item.keywords.some((keyword) => text === keyword)
    )

    if (exactMatch) {
      return exactMatch
    }

    /*
      Then check whether the entered text contains
      one of the keywords.
    */
    const containsMatch = searchRoutes.find((item) =>
      item.keywords.some(
        (keyword) =>
          text.includes(keyword) || keyword.includes(text)
      )
    )

    return containsMatch || null
  }

  const handleSearch = (e) => {
    const value = e.target.value

    setSearch(value)

    const matchedRoute = findRoute(value)

    if (!matchedRoute) return

    /*
      If already on the same page, don't unnecessarily
      navigate again.
    */
    const currentPath = window.location.pathname

    if (currentPath !== matchedRoute.path) {
      if (matchedRoute.section) {
        navigate(
          `${matchedRoute.path}?section=${matchedRoute.section}`
        )
      } else {
        navigate(matchedRoute.path)
      }
    } else if (matchedRoute.section) {
      /*
        If already on Reports, update the section.
      */
      navigate(
        `${matchedRoute.path}?section=${matchedRoute.section}`
      )
    }
  }

  return (
    <header className="h-16 shrink-0 bg-[#071A36] border-b border-[#173153] flex items-center justify-between px-4 md:px-6">

      {/* Left Side */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Mobile Menu */}
        <button
          className="
            md:hidden
            text-white
            hover:text-[#E8D5A8]
            transition-colors
            shrink-0
          "
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">

          <Search
            size={17}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#071A36]
              pointer-events-none
            "
          />

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search section..."
            className="
              w-full
              h-10
              bg-white
              border
              border-white
              rounded-full
              pl-11
              pr-4
              text-sm
              text-[#071A36]
              placeholder:text-slate-400
              outline-none
              shadow-sm
              transition-all
              duration-200
              focus:ring-2
              focus:ring-[#E8D5A8]
              focus:border-[#E8D5A8]
            "
          />

        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5 ml-4 shrink-0">

        {/* User */}
        <div className="flex items-center gap-2">

          <div
            className="
              w-8
              h-8
              rounded-full
              bg-[#1689E8]
              text-[#071A36]
              flex
              items-center
              justify-center
              text-xs
              font-bold
            "
          >
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>

          <span className="hidden md:inline text-sm font-medium text-white">
            {user?.name || 'Store Admin'}
          </span>

        </div>

        {/* Date & Time */}
        <div className="hidden md:block text-right leading-tight">

          <p className="text-[11px] font-medium text-white">
            {today}
          </p>

          <p className="text-[10px] text-white mt-0.5">
            {time}
          </p>

        </div>

      </div>
    </header>
  )
}