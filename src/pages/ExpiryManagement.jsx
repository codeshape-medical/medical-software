
import { useEffect, useState } from 'react'

import { Download, Eye, X, ChevronDown } from 'lucide-react'

import { getProducts } from '../services/api'

const CATEGORIES = [
  'Analgesic',
  'Antibiotic',
  'Antacid',
  'Diabetic',
  'Supplement',
  'Antiseptic',
  'Cardiac',
]

const TABS = ['Expiring Soon', 'Expired Items', 'Expiry Report']

function statusTone(status) {
  if (status === 'Expired') {
    return 'bg-red-50 text-red-600 border border-red-200'
  }

  if (status === 'Valid') {
    return 'bg-green-50 text-green-600 border border-green-200'
  }

  return 'bg-orange-50 text-orange-600 border border-orange-200'
}

/* =========================================================
   EXPIRY DATE HELPERS
========================================================= */

function parseExpiryDate(value) {
  if (!value) return null

  const text = String(value).trim()

  // MM-YYYY
  let match = text.match(/^(\d{1,2})-(\d{4})$/)

  if (match) {
    const month = Number(match[1])
    const year = Number(match[2])

    return new Date(year, month - 1, 1)
  }

  // MM/YYYY
  match = text.match(/^(\d{1,2})\/(\d{4})$/)

  if (match) {
    const month = Number(match[1])
    const year = Number(match[2])

    return new Date(year, month - 1, 1)
  }

  // YYYY-MM
  match = text.match(/^(\d{4})-(\d{1,2})$/)

  if (match) {
    const year = Number(match[1])
    const month = Number(match[2])

    return new Date(year, month - 1, 1)
  }

  // Normal date
  const date = new Date(text)

  if (!Number.isNaN(date.getTime())) {
    return date
  }

  return null
}

/* =========================================================
   DISPLAY DATE
========================================================= */

function formatExpiryDate(value) {
  const date = parseExpiryDate(value)

  if (!date) return value || '-'

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

/* =========================================================
   EXCEL DATE
========================================================= */

function excelExpiryDate(value) {
  const date = parseExpiryDate(value)

  if (!date) return value || ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  /*
    Keep the exact full date visible in Excel.
    Example:
    01-10-2026
  */

  return `="${day}-${month}-${year}"`
}

/* =========================================================
   RANGE CHECK
========================================================= */

function isWithinRange(expiryDate, range) {
  const date = parseExpiryDate(expiryDate)

  if (!date) return false

  const now = new Date()

  const currentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  if (range === 'Next 1 Month') {
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    )

    return date >= currentMonth && date <= end
  }

  if (range === 'Next 3 Months') {
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 3,
      1
    )

    return date >= currentMonth && date <= end
  }

  if (range === 'Next 6 Months') {
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 6,
      1
    )

    return date >= currentMonth && date <= end
  }

  return true
}

/* =========================================================
   EXPIRED CHECK
========================================================= */

function isExpired(expiryDate) {
  const date = parseExpiryDate(expiryDate)

  if (!date) return false

  const now = new Date()

  const currentMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  return date < currentMonth
}

/* =========================================================
   EXPIRY STATUS
========================================================= */

function getExpiryStatus(expiryDate) {
  if (!expiryDate) return 'Unknown'

  if (isExpired(expiryDate)) {
    return 'Expired'
  }

  if (isWithinRange(expiryDate, 'Next 6 Months')) {
    return 'Expiring Soon'
  }

  return 'Valid'
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ExpiryManagement() {
  const [tab, setTab] = useState(TABS[0])
  const [range, setRange] = useState('Next 3 Months')
  const [category, setCategory] = useState('All Categories')
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getProducts()
      .then((products) => {
        setRows(
          (Array.isArray(products) ? products : []).map((product) => ({
            ...product,
            productId: product.id,
            stock: Number(product.stock || 0),
          }))
        )
      })
      .catch(() => setRows([]))
  }, [])

  /* =======================================================
     FILTER DATA
  ======================================================== */

  const filteredRows = rows.filter((row) => {
    /* ---------------- CATEGORY ---------------- */

    const matchesCategory =
      category === 'All Categories' ||
      !row.category ||
      row.category === category

    /* ---------------- TAB ---------------- */

    let matchesTab = true

    if (tab === 'Expired Items') {
      matchesTab = isExpired(row.expiry)
    }

    if (tab === 'Expiring Soon') {
      matchesTab =
        !isExpired(row.expiry) &&
        isWithinRange(row.expiry, range)
    }

    if (tab === 'Expiry Report') {
      matchesTab = true
    }

    return matchesCategory && matchesTab
  })

  /* =======================================================
     EXPORT EXCEL
  ======================================================== */

  function exportExcel() {
    /*
      Include every column.
      UTF-8 BOM makes Excel read the CSV correctly.
    */

    const header = [
      '#',
      'Medicine Name',
      'Batch No',
      'Expiry Date',
      'Stock',
      'Status',
    ]

    const csvRows = filteredRows.map((r, index) => [
      index + 1,
      r.name || '',
      r.batchNo || '',
      excelExpiryDate(r.expiry),
      r.stock ?? '',
      getExpiryStatus(r.expiry),
    ])

    const csv = [
      header,
      ...csvRows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? '')

            /*
              Escape commas, quotes and new lines.
            */

            return `"${text.replace(/"/g, '""')}"`
          })
          .join(',')
      )
      .join('\r\n')

    /*
      Excel UTF-8 BOM
    */

    const blob = new Blob(
      ['\uFEFF', csv],
      {
        type: 'text/csv;charset=utf-8;',
      }
    )

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url

    a.download = `expiry-${tab
      .toLowerCase()
      .replace(/\s+/g, '-')}.csv`

    document.body.appendChild(a)

    a.click()

    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  }

  /* =======================================================
     RESET FILTERS
  ======================================================== */

  function resetFilters() {
    setRange('Next 3 Months')
    setCategory('All Categories')
    setTab('Expiring Soon')
  }

  return (
    <div className="relative min-h-full">
      <div className="space-y-4">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between gap-3 flex-wrap">

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
              Expiry Management
            </h2>

            <p className="text-xs sm:text-sm text-[#6B86A5] mt-1">
              Monitor medicine expiry and stock status
            </p>
          </div>

          {/* EXPORT */}

          <button
            onClick={exportExcel}
            className="
              h-9
              sm:h-10
              px-3
              sm:px-4
              rounded-lg
              bg-gradient-to-r
              from-[#1689E8]
              to-[#1674E5]
              text-white
              text-xs
              sm:text-sm
              font-semibold
              flex
              items-center
              gap-2
              border
              border-[#1689E8]
              shadow-[0_5px_18px_rgba(22,137,232,0.22)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_7px_22px_rgba(22,137,232,0.35)]
            "
          >
            <Download size={15} />
            Export Excel
          </button>
        </div>

        {/* =================================================
            MAIN CARD
        ================================================== */}

        <div
          className="
            bg-white
            rounded-xl
            border
            border-[#CBE7FB]
            shadow-[0_5px_25px_rgba(22,137,232,0.08)]
            overflow-hidden
          "
        >

          {/* =================================================
              TABS
          ================================================== */}

          <div
            className="
              px-3
              sm:px-4
              pt-2
              border-b
              border-[#DDEFFC]
              bg-[#FBFDFF]
            "
          >
            <div className="flex items-center gap-1 overflow-x-auto">

              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`
                    relative
                    px-3
                    sm:px-4
                    py-2.5
                    text-xs
                    sm:text-sm
                    font-semibold
                    whitespace-nowrap
                    transition-all
                    duration-200
                    ${
                      tab === t
                        ? `
                          text-[#1674E5]
                          after:absolute
                          after:left-0
                          after:right-0
                          after:bottom-[-1px]
                          after:h-[2px]
                          after:bg-[#1689E8]
                          after:shadow-[0_0_8px_rgba(22,137,232,0.65)]
                        `
                        : `
                          text-[#6B86A5]
                          hover:text-[#1674E5]
                        `
                    }
                  `}
                >
                  {t}
                </button>
              ))}

            </div>
          </div>

          {/* =================================================
              FILTER SECTION
          ================================================== */}

          <div className="p-3 sm:p-4">

            <div className="flex flex-wrap items-center justify-between gap-3">

              <div className="flex flex-wrap items-center gap-2">

                {/* RANGE */}

                <div className="relative">

                  <select
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                    disabled={tab === 'Expired Items'}
                    className="
                      appearance-none
                      h-9
                      w-[145px]
                      sm:w-[160px]
                      rounded-lg
                      border
                      border-[#C7E4FA]
                      bg-white
                      px-3
                      pr-8
                      text-xs
                      sm:text-sm
                      font-medium
                      text-[#18365C]
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#1689E8]
                      focus:border-[#1689E8]
                      focus:ring-2
                      focus:ring-[#1689E8]/10
                      disabled:bg-[#F4F8FC]
                      disabled:text-[#9AAFC5]
                    "
                  >
                    <option>Next 1 Month</option>
                    <option>Next 3 Months</option>
                    <option>Next 6 Months</option>
                  </select>

                  <ChevronDown
                    size={14}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-[#47749F]
                    "
                  />

                </div>

                {/* CATEGORY */}

                <div className="relative">

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="
                      appearance-none
                      h-9
                      w-[145px]
                      sm:w-[160px]
                      rounded-lg
                      border
                      border-[#C7E4FA]
                      bg-white
                      px-3
                      pr-8
                      text-xs
                      sm:text-sm
                      font-medium
                      text-[#18365C]
                      outline-none
                      transition-all
                      duration-200
                      hover:border-[#1689E8]
                      focus:border-[#1689E8]
                      focus:ring-2
                      focus:ring-[#1689E8]/10
                    "
                  >
                    <option>All Categories</option>

                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <ChevronDown
                    size={14}
                    className="
                      pointer-events-none
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-[#47749F]
                    "
                  />

                </div>

                {/* RESET */}

                <button
                  onClick={resetFilters}
                  className="
                    h-9
                    px-3
                    rounded-lg
                    border
                    border-[#C7E4FA]
                    bg-white
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#47749F]
                    transition-all
                    duration-200
                    hover:border-[#1689E8]
                    hover:text-[#1689E8]
                    hover:bg-[#F4FAFF]
                  "
                >
                  Reset
                </button>

              </div>

              {/* RESULT COUNT */}

              <div
                className="
                  px-3
                  h-9
                  flex
                  items-center
                  rounded-lg
                  bg-[#EFF8FF]
                  border
                  border-[#CBE7FB]
                  text-xs
                  font-semibold
                  text-[#1674E5]
                "
              >
                {filteredRows.length} Items
              </div>

            </div>

            {/* =================================================
                TABLE
            ================================================== */}

            <div
              className="
                mt-4
                rounded-xl
                border
                border-[#CBE7FB]
                overflow-hidden
                bg-white
                shadow-[0_3px_18px_rgba(22,137,232,0.05)]
              "
            >

              <div className="overflow-x-auto">

                <table className="w-full min-w-[700px] text-xs sm:text-sm">

                  {/* HEADER */}

                  <thead>
                    <tr
                      className="
                        bg-[#EFF8FF]
                        border-b
                        border-[#CBE7FB]
                        text-[#123B66]
                      "
                    >
                      <th className="px-3 py-3 text-center font-bold text-xs">
                        #
                      </th>

                      <th className="px-3 py-3 text-left font-bold text-xs">
                        Medicine Name
                      </th>

                      <th className="px-3 py-3 text-left font-bold text-xs">
                        Batch No
                      </th>

                      <th className="px-3 py-3 text-left font-bold text-xs">
                        Expiry Date
                      </th>

                      <th className="px-3 py-3 text-center font-bold text-xs">
                        Stock
                      </th>

                      <th className="px-3 py-3 text-center font-bold text-xs">
                        Status
                      </th>

                      <th className="px-3 py-3 text-center font-bold text-xs">
                        Action
                      </th>
                    </tr>
                  </thead>

                  {/* BODY */}

                  <tbody>

                    {filteredRows.map((r, i) => {
                      const expiryStatus = getExpiryStatus(r.expiry)

                      return (
                        <tr
                          key={r.productId || i}
                          className="
                            border-b
                            border-[#E5F1FB]
                            hover:bg-[#F8FCFF]
                            transition-all
                            duration-150
                          "
                        >

                          {/* # */}

                          <td
                            className="
                              px-3
                              py-3
                              text-center
                              text-xs
                              font-medium
                              text-[#6B86A5]
                            "
                          >
                            {i + 1}
                          </td>

                          {/* MEDICINE */}

                          <td
                            className="
                              px-3
                              py-3
                              font-semibold
                              text-[#123B66]
                              text-xs
                              sm:text-sm
                            "
                          >
                            {r.name}
                          </td>

                          {/* BATCH */}

                          <td
                            className="
                              px-3
                              py-3
                              text-xs
                              font-medium
                              text-[#45617F]
                            "
                          >
                            {r.batchNo || '-'}
                          </td>

                          {/* EXPIRY */}

                          <td
                            className="
                              px-3
                              py-3
                              text-xs
                              font-medium
                              text-[#45617F]
                            "
                          >
                            {formatExpiryDate(r.expiry)}
                          </td>

                          {/* STOCK */}

                          <td className="px-3 py-3 text-center">

                            <span
                              className={`
                                text-xs
                                font-bold
                                ${
                                  expiryStatus === 'Expired'
                                    ? 'text-red-600'
                                    : r.stock <= 15
                                      ? 'text-red-500'
                                      : 'text-orange-500'
                                }
                              `}
                            >
                              {r.stock}
                            </span>

                          </td>

                          {/* STATUS */}

                          <td className="px-3 py-3 text-center">

                            <span
                              className={`
                                inline-flex
                                items-center
                                justify-center
                                px-2.5
                                py-1
                                rounded-md
                                text-[11px]
                                font-semibold
                                ${statusTone(expiryStatus)}
                              `}
                            >
                              {expiryStatus}
                            </span>

                          </td>

                          {/* ACTION */}

                          <td className="px-3 py-3 text-center">

                            <button
                              onClick={() => setSelected(r)}
                              title="View Details"
                              className="
                                w-8
                                h-8
                                rounded-full
                                bg-[#EFF8FF]
                                border
                                border-[#CBE7FB]
                                text-[#1689E8]
                                flex
                                items-center
                                justify-center
                                mx-auto
                                transition-all
                                duration-200
                                hover:bg-[#1689E8]
                                hover:text-white
                                hover:border-[#1689E8]
                                hover:shadow-[0_0_14px_rgba(22,137,232,0.30)]
                              "
                            >
                              <Eye size={15} />
                            </button>

                          </td>

                        </tr>
                      )
                    })}

                    {/* EMPTY */}

                    {filteredRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="
                            text-center
                            py-10
                            text-[#91A6BD]
                            text-xs
                            sm:text-sm
                            font-medium
                          "
                        >
                          No items found for the selected filters.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            DETAILS MODAL
        ================================================== */}

        {selected && (

          <div
            className="
              fixed
              inset-0
              z-50
              bg-[#071D42]/40
              backdrop-blur-sm
              flex
              items-center
              justify-center
              p-4
            "
            onClick={() => setSelected(null)}
          >

            <div
              className="
                w-full
                max-w-md
                bg-white
                rounded-xl
                border
                border-[#CBE7FB]
                shadow-[0_15px_50px_rgba(22,137,232,0.20)]
                p-5
              "
              onClick={(e) => e.stopPropagation()}
            >

              {/* MODAL HEADER */}

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h3 className="text-base sm:text-lg font-bold text-[#123B66]">
                    Medicine Details
                  </h3>

                  <p className="text-xs text-[#6B86A5] mt-1">
                    {selected.name}
                  </p>

                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-red-50
                    text-red-500
                    flex
                    items-center
                    justify-center
                    transition-all
                    hover:bg-red-500
                    hover:text-white
                  "
                >
                  <X size={15} />
                </button>

              </div>

              {/* DETAILS GRID */}

              <div className="grid grid-cols-2 gap-2.5">

                <div
                  className="
                    rounded-lg
                    border
                    border-[#D8ECFB]
                    bg-[#F8FCFF]
                    p-3
                  "
                >
                  <p className="text-[10px] text-[#7893AE]">
                    Medicine Name
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-[#123B66] mt-1">
                    {selected.name}
                  </p>
                </div>

                <div
                  className="
                    rounded-lg
                    border
                    border-[#D8ECFB]
                    bg-[#F8FCFF]
                    p-3
                  "
                >
                  <p className="text-[10px] text-[#7893AE]">
                    Batch No
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-[#123B66] mt-1">
                    {selected.batchNo || '-'}
                  </p>
                </div>

                <div
                  className="
                    rounded-lg
                    border
                    border-[#D8ECFB]
                    bg-[#F8FCFF]
                    p-3
                  "
                >
                  <p className="text-[10px] text-[#7893AE]">
                    Expiry Date
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-[#123B66] mt-1">
                    {formatExpiryDate(selected.expiry)}
                  </p>
                </div>

                <div
                  className="
                    rounded-lg
                    border
                    border-[#D8ECFB]
                    bg-[#F8FCFF]
                    p-3
                  "
                >
                  <p className="text-[10px] text-[#7893AE]">
                    Stock
                  </p>

                  <p className="text-xs sm:text-sm font-semibold text-[#123B66] mt-1">
                    {selected.stock}
                  </p>
                </div>

                <div
                  className="
                    col-span-2
                    rounded-lg
                    border
                    border-[#D8ECFB]
                    bg-[#F8FCFF]
                    p-3
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div>

                    <p className="text-[10px] text-[#7893AE]">
                      Status
                    </p>

                    <span
                      className={`
                        inline-flex
                        mt-1
                        px-2.5
                        py-1
                        rounded-md
                        text-[11px]
                        font-semibold
                        ${statusTone(getExpiryStatus(selected.expiry))}
                      `}
                    >
                      {getExpiryStatus(selected.expiry)}
                    </span>

                  </div>

                  <Eye
                    size={18}
                    className="text-[#1689E8]"
                  />

                </div>

              </div>

              {/* CLOSE */}

              <button
                onClick={() => setSelected(null)}
                className="
                  w-full
                  h-9
                  mt-4
                  rounded-lg
                  bg-gradient-to-r
                  from-[#1689E8]
                  to-[#1674E5]
                  text-white
                  text-xs
                  sm:text-sm
                  font-semibold
                  shadow-[0_5px_18px_rgba(22,137,232,0.22)]
                  hover:shadow-[0_7px_22px_rgba(22,137,232,0.32)]
                  transition-all
                "
              >
                Close
              </button>

            </div>

          </div>

        )}

      </div>
    </div>
  )
}
