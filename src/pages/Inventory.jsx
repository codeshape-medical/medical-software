
import { useEffect, useMemo, useState } from 'react'
import { Search, Eye, X, ChevronDown } from 'lucide-react'
import { getProducts } from '../services/api'
import { CATEGORIES } from '../data/dummyData'

function stockStatus(stock) {
  if (stock <= 15) {
    return {
      label: 'Critical',
      tone: 'bg-red-50 text-red-600 border border-red-200',
    }
  }

  if (stock <= 50) {
    return {
      label: 'Low',
      tone: 'bg-orange-50 text-orange-600 border border-orange-200',
    }
  }

  return {
    label: 'In Stock',
    tone: 'bg-green-50 text-green-600 border border-green-200',
  }
}

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [status, setStatus] = useState('All')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  /*
    SEARCH + FILTER
    Searches in:
    - Medicine Name
    - Code
    - Brand
    - Category
    - Batch Number
  */
  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase()

    return products.filter((p) => {
      const matchesSearch =
        !searchText ||
        String(p.name || '').toLowerCase().includes(searchText) ||
        
        String(p.brand || '').toLowerCase().includes(searchText) ||
        String(p.category || '').toLowerCase().includes(searchText) ||
        String(p.batchNo || '').toLowerCase().includes(searchText)

      const matchesCategory =
        category === 'All' || p.category === category

      const matchesStatus =
        status === 'All' ||
        stockStatus(Number(p.stock || 0)).label === status

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, search, category, status])

  function clearSearch() {
    setSearch('')
  }

  return (
    <div className="min-h-full bg-[#F4FAFF] p-2 sm:p-3 lg:p-4">

      {/* ================= PAGE ================= */}
      <div className="space-y-4">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
             <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
              Stock View
            </h2>

            <p className="text-sm text-[#6B86A5] mt-1">
              View and search your medicine inventory
            </p>
          </div>

         <div
  className="
    px-4 py-2
    rounded-xl
    bg-white
    border
    border-[#FFD54F]
    shadow-[0_0_10px_rgba(255,193,7,0.35),0_4px_18px_rgba(255,193,7,0.12)]
    transition-all
    duration-300
    hover:border-[#FFC107]
    hover:shadow-[0_0_18px_rgba(255,193,7,0.55),0_6px_22px_rgba(255,193,7,0.18)]
  "
>
  <span className="text-xs text-black">
    Total Medicines
  </span>

  <p className="text-lg font-bold text-[#FFD54F]">
    {products.length}
  </p>
</div>
        </div>

        {/* ================= MAIN CARD ================= */}
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-[#D6E9FA]
            shadow-[0_8px_30px_rgba(22,137,232,0.08)]
            overflow-hidden
          "
        >

          {/* ================= SEARCH AREA ================= */}
          <div className="p-4 sm:p-5 border-b border-[#E3F0FA]">

            <div className="flex flex-col lg:flex-row gap-3">

              {/* SEARCH */}
              <div className="relative flex-1">

                <Search
                  size={19}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#4D78A7]
                    pointer-events-none
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search medicine, code, brand, category..."
                  className="
                    w-full
                    h-12
                    rounded-full
                    border
                    border-[#B8DAFA]
                    bg-[#FBFDFF]
                    pl-11
                    pr-12
                    text-sm
                    font-medium
                    text-[#18365C]
                    placeholder:text-[#91A6BD]
                    outline-none
                    transition-all
                    duration-200
                    focus:border-[#1689E8]
                    focus:ring-4
                    focus:ring-[#1689E8]/10
                    hover:border-[#1689E8]
                    hover:shadow-[0_0_18px_rgba(22,137,232,0.12)]
                  "
                />

                {/* CLEAR SEARCH */}
                {search && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-8
                      h-8
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-[#6B86A5]
                      hover:bg-[#EAF5FF]
                      hover:text-[#1689E8]
                      transition
                    "
                    title="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* CATEGORY */}
              <div className="relative w-full lg:w-48">

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="
                    appearance-none
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#B8DAFA]
                    bg-white
                    px-4
                    pr-10
                    text-sm
                    font-semibold
                    text-[#18365C]
                    outline-none
                    cursor-pointer
                    transition
                    focus:border-[#1689E8]
                    focus:ring-4
                    focus:ring-[#1689E8]/10
                    hover:border-[#1689E8]
                  "
                >
                  <option value="All">
                    All Categories
                  </option>

                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#1689E8]
                  "
                />
              </div>

              {/* STATUS */}
              <div className="relative w-full lg:w-44">

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="
                    appearance-none
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[#B8DAFA]
                    bg-white
                    px-4
                    pr-10
                    text-sm
                    font-semibold
                    text-[#18365C]
                    outline-none
                    cursor-pointer
                    transition
                    focus:border-[#1689E8]
                    focus:ring-4
                    focus:ring-[#1689E8]/10
                    hover:border-[#1689E8]
                  "
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="In Stock">
                    In Stock
                  </option>

                  <option value="Low">
                    Low
                  </option>

                  <option value="Critical">
                    Critical
                  </option>
                </select>

                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-[#1689E8]
                  "
                />
              </div>
            </div>

            {/* SEARCH RESULT INFO */}
            <div className="flex items-center justify-between mt-3">

              <p className="text-xs sm:text-sm text-[#6B86A5]">
                {search ? (
                  <>
                    Search results for{' '}
                    <span className="font-semibold text-[#123B66]">
                      "{search}"
                    </span>
                  </>
                ) : (
                  'Showing all medicines'
                )}
              </p>

              <p className="text-xs sm:text-sm font-semibold text-[#123B66]">
                {filtered.length} item
                {filtered.length !== 1 ? 's' : ''}
              </p>

            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="p-3 sm:p-4">

            <div
              className="
                overflow-x-auto
                rounded-xl
                border
                border-[#D6E9FA]
              "
            >
              <table className="w-full min-w-[850px] text-sm">

                {/* TABLE HEADER */}
                <thead>
                  <tr
                    className="
                      bg-[#EFF8FF]
                      text-[#123B66]
                      border-b
                      border-[#D6E9FA]
                    "
                  >
                    <th className="px-4 py-3 text-left font-bold">
                      #
                    </th>

                 

                    <th className="px-4 py-3 text-left font-bold">
                      Medicine
                    </th>

                    <th className="px-4 py-3 text-left font-bold">
                      Brand
                    </th>

                    <th className="px-4 py-3 text-left font-bold">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-left font-bold">
                      MRP
                    </th>

                    <th className="px-4 py-3 text-left font-bold">
                      Status
                    </th>

                    <th className="px-4 py-3 text-center font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}
                <tbody>

                  {filtered.map((p, i) => {

                    const st = stockStatus(
                      Number(p.stock || 0)
                    )

                    return (
                      <tr
                        key={p.id}
                        className="
                          border-b
                          border-[#E7F2FA]
                          hover:bg-[#F7FCFF]
                          transition
                        "
                      >

                        <td className="px-4 py-3 text-[#6B86A5]">
                          {i + 1}
                        </td>

                        

                        <td className="px-4 py-3">
                          <span className="font-semibold text-[#18365C]">
                            {p.name}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-[#45617F]">
                          {p.brand}
                        </td>

                        <td className="px-4 py-3">

                          <span className="font-bold text-[#123B66]">
                            {p.stock}
                          </span>

                        </td>

                        <td className="px-4 py-3 font-semibold text-[#18365C]">
                          ₹{Number(p.mrp || 0).toFixed(2)}
                        </td>

                        <td className="px-4 py-3">

                          <span
                            className={`
                              inline-flex
                              items-center
                              px-3
                              py-1
                              rounded-full
                              text-xs
                              font-bold
                              ${st.tone}
                            `}
                          >
                            {st.label}
                          </span>

                        </td>

                        <td className="px-4 py-3 text-center">

                          <button
                            type="button"
                            onClick={() => setSelected(p)}
                            className="
                              w-9
                              h-9
                              rounded-full
                              bg-[#EAF5FF]
                              text-[#1689E8]
                              flex
                              items-center
                              justify-center
                              mx-auto
                              border
                              border-[#C7E5FB]
                              transition-all
                              duration-200
                              hover:bg-[#1689E8]
                              hover:text-white
                              hover:shadow-[0_0_16px_rgba(22,137,232,0.35)]
                              active:scale-95
                            "
                            title="View medicine"
                          >
                            <Eye size={16} />
                          </button>

                        </td>

                      </tr>
                    )
                  })}

                  {/* NO RESULTS */}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-14 text-center"
                      >

                        <div className="flex flex-col items-center">

                          <div
                            className="
                              w-14
                              h-14
                              rounded-full
                              bg-[#EFF8FF]
                              text-[#1689E8]
                              flex
                              items-center
                              justify-center
                              mb-3
                              shadow-[0_0_18px_rgba(22,137,232,0.15)]
                            "
                          >
                            <Search size={22} />
                          </div>

                          <p className="font-semibold text-[#123B66]">
                            No medicine found
                          </p>

                          <p className="text-sm text-[#91A6BD] mt-1">
                            Try another medicine name, code or brand
                          </p>

                          {search && (
                            <button
                              type="button"
                              onClick={clearSearch}
                              className="
                                mt-3
                                text-sm
                                font-semibold
                                text-[#1689E8]
                                hover:underline
                              "
                            >
                              Clear Search
                            </button>
                          )}

                        </div>

                      </td>
                    </tr>
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {selected && (
        <div
          className="
            fixed
            inset-0
            bg-[#061A3A]/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            z-50
            p-4
          "
          onClick={() => setSelected(null)}
        >

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-[#D6E9FA]
              shadow-[0_20px_60px_rgba(10,80,140,0.20)]
              p-5
              sm:p-6
              w-full
              max-w-md
              animate-[fadeIn_.2s_ease]
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="flex items-center justify-between mb-5">

              <div>
                <p className="text-xs font-semibold text-[#6B86A5]">
                  Medicine Details
                </p>

                <h3 className="text-lg font-bold text-[#123B66] mt-1">
                  {selected.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="
                  w-9
                  h-9
                  rounded-full
                  bg-[#F2F7FC]
                  text-[#6B86A5]
                  flex
                  items-center
                  justify-center
                  hover:bg-red-50
                  hover:text-red-500
                  transition
                "
              >
                <X size={18} />
              </button>

            </div>

            {/* DETAILS */}
            <div className="grid grid-cols-2 gap-3">

            
              <Detail
                label="Brand"
                value={selected.brand}
              />

              <Detail
                label="Category"
                value={selected.category}
              />

              <Detail
                label="Batch No"
                value={selected.batchNo}
              />

              <Detail
                label="Current Stock"
                value={selected.stock}
              />

              <Detail
                label="Expiry"
                value={selected.expiry}
              />

              <Detail
                label="Purchase Price"
                value={`₹${Number(
                  selected.purchasePrice || 0
                ).toFixed(2)}`}
              />

             <Detail
  label="Sales Rate"
  value={`₹${Number(
    selected.salePrice || 0
  ).toFixed(2)}`}
/>

<Detail
  label="MRP"
  value={`₹${Number(
    selected.mrp || 0
  ).toFixed(2)}`}
/>

            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="
                w-full
                h-11
                mt-5
                rounded-xl
                bg-[#1689E8]
                text-white
                font-bold
                text-sm
                shadow-[0_5px_18px_rgba(22,137,232,0.25)]
                hover:shadow-[0_7px_22px_rgba(22,137,232,0.35)]
                hover:-translate-y-0.5
                transition-all
              "
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  )
}

/* ================= DETAIL COMPONENT ================= */

function Detail({ label, value }) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[#E0EFFA]
        bg-[#F8FCFF]
        px-3
        py-3
      "
    >
      <p className="text-[11px] font-semibold text-[#7A93AD]">
        {label}
      </p>

      <p className="text-sm font-bold text-[#18365C] mt-1 truncate">
        {value}
      </p>
    </div>
  )
}