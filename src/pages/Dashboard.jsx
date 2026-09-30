
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import {
  IndianRupee,
  Package,
  AlertTriangle,
  CalendarClock,
  Layers,
  Users2,
  Tags,
  Ban,
  FilePlus2,
  PackagePlus,
  ShoppingCart,
  FileBarChart,
} from 'lucide-react'

import { getDashboardStats } from '../services/api'


/* ================= STAT CARD ================= */

function StatCard({ icon: Icon, label, value, type }) {
  const styles = {
    green: {
      card: 'bg-[#EEF9F4] border border-[#18B878]/60 shadow-[0_0_12px_rgba(24,184,120,0.22)] hover:shadow-[0_0_20px_rgba(24,184,120,0.35)]',
      icon: 'bg-[#18B878] text-white',
      label: 'text-[#65726D]',
      value: 'text-[#17221E]',
    },

    blue: {
      card: 'bg-[#EEF6FD] border border-[#1689E8]/60 shadow-[0_0_12px_rgba(22,137,232,0.22)] hover:shadow-[0_0_20px_rgba(22,137,232,0.35)]',
      icon: 'bg-[#1689E8] text-white',
      label: 'text-[#65727D]',
      value: 'text-[#17212A]',
    },

    orange: {
      card: 'bg-[#FFF3DE] border border-[#F3A315]/65 shadow-[0_0_12px_rgba(243,163,21,0.24)] hover:shadow-[0_0_20px_rgba(243,163,21,0.38)]',
      icon: 'bg-[#F3A315] text-white',
      label: 'text-[#776E5D]',
      value: 'text-[#312A1E]',
    },

    red: {
      card: 'bg-[#FFF0F1] border border-[#EF4148]/60 shadow-[0_0_12px_rgba(239,65,72,0.22)] hover:shadow-[0_0_20px_rgba(239,65,72,0.35)]',
      icon: 'bg-[#EF4148] text-white',
      label: 'text-[#776466]',
      value: 'text-[#302124]',
    },
  }

  const style = styles[type]

  return (
    <div
      className={`
        ${style.card}
        rounded-xl
        px-4
        py-3.5
        flex
        items-center
        gap-3
        min-h-[78px]
        transition-all
        duration-300
        hover:-translate-y-[1px]
      `}
    >
      <div
        className={`
          ${style.icon}
          w-11
          h-11
          rounded-lg
          flex
          items-center
          justify-center
          shrink-0
          shadow-[0_0_10px_currentColor]
        `}
      >
        <Icon size={21} strokeWidth={2.2} />
      </div>

      <div className="min-w-0">
        <p className={`text-[11px] font-medium ${style.label}`}>
          {label}
        </p>

        <p
          className={`
            mt-0.5
            text-[17px]
            font-bold
            ${style.value}
            truncate
          `}
        >
          {value}
        </p>
      </div>
    </div>
  )
}


/* ================= STOCK SUMMARY ================= */

function SummaryRow({ icon: Icon, label, value, type }) {
  const colors = {
    purple: {
      icon: 'bg-[#7B2FE2]',
      glow: 'hover:shadow-[0_0_12px_rgba(123,47,226,0.18)]',
    },
    green: {
      icon: 'bg-[#19B879]',
      glow: 'hover:shadow-[0_0_12px_rgba(25,184,121,0.18)]',
    },
    orange: {
      icon: 'bg-[#F2A315]',
      glow: 'hover:shadow-[0_0_12px_rgba(242,163,21,0.18)]',
    },
    red: {
      icon: 'bg-[#EF4148]',
      glow: 'hover:shadow-[0_0_12px_rgba(239,65,72,0.18)]',
    },
  }

  const style = colors[type]

  return (
    <div
      className={`
        flex
        items-center
        justify-between
        py-2.5
        rounded-lg
        px-1
        transition-all
        duration-200
        ${style.glow}
      `}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={`
            ${style.icon}
            w-7
            h-7
            rounded-md
            flex
            items-center
            justify-center
            shrink-0
            text-white
            shadow-[0_0_8px_currentColor]
          `}
        >
          <Icon size={14} strokeWidth={2.2} />
        </div>

        <span className="text-[12px] font-medium text-[#56616F] truncate">
          {label}
        </span>
      </div>

      <span className="text-[13px] font-bold text-[#17212B] ml-3">
        {value}
      </span>
    </div>
  )
}


/* ================= QUICK ACTION ================= */

function QuickAction({ icon: Icon, label, type, onClick }) {
  const styles = {
    green: {
      box: 'bg-[#EAF8F1] border border-[#18B878]/60 shadow-[0_0_10px_rgba(24,184,120,0.18)] hover:shadow-[0_0_18px_rgba(24,184,120,0.32)] hover:border-[#18B878]',
      icon: 'bg-[#18B878] text-white',
      text: 'text-[#168456]',
    },

    purple: {
      box: 'bg-[#F6EEFD] border border-[#792CE0]/60 shadow-[0_0_10px_rgba(121,44,224,0.18)] hover:shadow-[0_0_18px_rgba(121,44,224,0.32)] hover:border-[#792CE0]',
      icon: 'bg-[#792CE0] text-white',
      text: 'text-[#7024C7]',
    },

    blue: {
      box: 'bg-[#EDF6FD] border border-[#1689E8]/60 shadow-[0_0_10px_rgba(22,137,232,0.18)] hover:shadow-[0_0_18px_rgba(22,137,232,0.32)] hover:border-[#1689E8]',
      icon: 'bg-[#1689E8] text-white',
      text: 'text-[#1475C5]',
    },

    red: {
      box: 'bg-[#FFF0F1] border border-[#EF4148]/60 shadow-[0_0_10px_rgba(239,65,72,0.18)] hover:shadow-[0_0_18px_rgba(239,65,72,0.32)] hover:border-[#EF4148]',
      icon: 'bg-[#EF4148] text-white',
      text: 'text-[#D9363E]',
    },
  }

  const style = styles[type]

  return (
    <button
      onClick={onClick}
      className={`
        ${style.box}
        w-full
        flex
        items-center
        justify-center
        gap-3
        min-h-[58px]
        px-5
        rounded-lg
        transition-all
        duration-300
        hover:-translate-y-[1px]
      `}
    >
      <span
        className={`
          ${style.icon}
          w-8
          h-8
          rounded-md
          flex
          items-center
          justify-center
          shrink-0
          shadow-[0_0_9px_currentColor]
        `}
      >
        <Icon size={16} strokeWidth={2.5} />
      </span>

      <span className={`text-[13px] font-semibold ${style.text}`}>
        {label}
      </span>
    </button>
  )
}


/* ================= DASHBOARD ================= */

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getDashboardStats().then(setStats)
  }, [])

  if (!stats) {
    return (
      <div className="min-h-full w-full flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-sm text-[#64748B]">
          Loading dashboard...
        </div>
      </div>
    )
  }

  const fmt = (n) => `₹ ${Number(n || 0).toLocaleString('en-IN')}`

  return (
    <div className="min-h-full w-full bg-[#F8FAFC] p-3 sm:p-4 md:p-5">

      {/* ================= TOP STAT CARDS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">

        <StatCard
          icon={IndianRupee}
          label="Today Sales"
          value={fmt(stats.todaySales)}
          type="green"
        />

        <StatCard
          icon={Package}
          label="Total Products"
          value={stats.totalProducts.toLocaleString('en-IN')}
          type="blue"
        />

        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={`${stats.lowStockCount} Items`}
          type="orange"
        />

        <StatCard
          icon={CalendarClock}
          label="Expiring Soon"
          value={`${stats.expiringSoonCount} Items`}
          type="red"
        />

      </div>


      {/* ================= MIDDLE AREA ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 mt-3.5">

        {/* Monthly Sales */}

        <div className="xl:col-span-2 bg-white rounded-xl p-4 md:p-5 shadow-[0_0_12px_rgba(22,137,232,0.08)]">

          <p className="text-sm font-semibold text-[#17212B] mb-4">
            Monthly Sales
          </p>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.monthlySales}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E9F2"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                  fill: '#8792A8',
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                  fill: '#8792A8',
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />

              <Tooltip
                formatter={(v) => fmt(v)}
                cursor={{
                  fill: '#F3F5FA',
                }}
              />

              <Bar
                dataKey="value"
                fill="#1689E8"
                radius={[4, 4, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>


        {/* Stock Summary */}

        <div className="bg-white rounded-xl p-4 md:p-5 shadow-[0_0_12px_rgba(123,47,226,0.08)]">

          <p className="text-sm font-semibold text-[#17212B] mb-2">
            Stock Summary
          </p>

          <SummaryRow
            icon={Layers}
            label="Total Stock Value"
            value={fmt(stats.totalStockValue)}
            type="purple"
          />

          <SummaryRow
            icon={Users2}
            label="Total Suppliers"
            value={stats.totalSuppliers}
            type="green"
          />

          <SummaryRow
            icon={Tags}
            label="Total Categories"
            value={stats.totalCategories}
            type="orange"
          />

          <SummaryRow
            icon={Ban}
            label="Expired Items"
            value={stats.expiredItems}
            type="red"
          />

        </div>

      </div>


      {/* ================= QUICK ACTIONS ================= */}

      <div className="bg-white rounded-xl p-4 md:p-5 mt-3.5 shadow-[0_0_12px_rgba(22,137,232,0.08)]">

        <p className="text-sm font-semibold text-[#17212B] mb-4">
          Quick Actions
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">

          <QuickAction
            icon={FilePlus2}
            label="New Bill (POS)"
            type="green"
            onClick={() => navigate('/billing')}
          />

          <QuickAction
            icon={PackagePlus}
            label="Add Medicine"
            type="purple"
            onClick={() => navigate('/products')}
          />

          <QuickAction
            icon={ShoppingCart}
            label="New Purchase"
            type="blue"
            onClick={() => navigate('/purchase')}
          />

          <QuickAction
            icon={FileBarChart}
            label="Expiry Report"
            type="red"
            onClick={() => navigate('/expiry')}
          />

        </div>

      </div>

    </div>
  )
}