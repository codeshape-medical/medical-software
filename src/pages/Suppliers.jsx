import { useEffect, useState } from 'react'

import {
  Plus,
  Search,
  Phone,
  X,
  Building2,
  MapPin,
} from 'lucide-react'

import { getSuppliers, addSupplier } from '../services/api'

const emptyForm = {
  name: '',
  contact: '',
  address: '',
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [phoneError, setPhoneError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const data = await getSuppliers()
      setSuppliers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load suppliers:', error)
      setSuppliers([])
    }
  }

  const filtered = suppliers.filter((s) =>
    (s.name || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  function handlePhoneChange(value) {
    // Only allow digits
    const digits = value.replace(/\D/g, '').slice(0, 10)

    setForm({
      ...form,
      contact: digits,
    })

    if (!digits) {
      setPhoneError('Phone number is required.')
    } else if (digits.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.')
    } else {
      setPhoneError('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const supplierName = form.name.trim()
    const phone = form.contact.trim()
    const address = form.address.trim()

    if (!supplierName) {
      alert('Supplier name is required.')
      return
    }

    if (!phone) {
      setPhoneError('Phone number is required.')
      return
    }

    if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Phone number must be exactly 10 digits.')
      return
    }

    setSaving(true)

    try {
      // This saves the supplier in the database
      // through the existing POST /suppliers API.
      await addSupplier({
        name: supplierName,
        contact: phone,
        address,
      })

      alert('Supplier added successfully.')

      setForm(emptyForm)
      setPhoneError('')
      setShowForm(false)

      // Reload from database so the new supplier
      // immediately appears in the supplier list.
      await load()
    } catch (error) {
      console.error('Failed to add supplier:', error)

      alert(
        error?.response?.data?.message ||
          'Failed to add supplier. Please try again.'
      )
    } finally {
      setSaving(false)
    }
  }

  function closeForm() {
    if (saving) return

    setShowForm(false)
    setForm(emptyForm)
    setPhoneError('')
  }

  return (
    <div className="min-h-full space-y-5 pb-8">

      {/* HEADER */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5FF]">
            <Building2
              size={20}
              className="text-[#1689E8]"
              strokeWidth={2.2}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#071A36] sm:text-2xl">
              Suppliers
            </h2>

            <p className="mt-0.5 text-[11px] font-medium text-[#555555] sm:text-xs">
              Manage medicine suppliers and supplier information
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="
            flex h-10 w-full items-center justify-center gap-2
            rounded-xl bg-[#1689E8]
            px-4 text-xs font-bold text-white
            shadow-[0_5px_16px_rgba(22,137,232,0.25)]
            transition-all
            hover:bg-[#1178D0]
            sm:w-auto
          "
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Supplier
        </button>

      </div>

      {/* SEARCH */}

      <div
        className="
          rounded-2xl
          border border-[#D8EAF7]
          bg-white
          p-4
          shadow-[0_5px_22px_rgba(7,26,54,0.05)]
        "
      >

        <div className="mb-2.5 flex items-center gap-2">
          <Search
            size={15}
            className="text-[#1689E8]"
          />

          <span className="text-[11px] font-bold text-[#071A36]">
            Search Suppliers
          </span>
        </div>

        <div className="relative w-full max-w-md">

          <Search
            size={16}
            className="
              absolute left-3.5 top-1/2
              -translate-y-1/2
              text-[#1689E8]
            "
          />

          <input
            className="
              h-10 w-full
              rounded-xl
              border border-[#C9DCEB]
              bg-[#FBFDFF]
              pl-10 pr-4
              text-xs font-medium text-[#111111]
              outline-none
              placeholder:text-[#777777]
              transition-all
              focus:border-[#1689E8]
              focus:bg-white
              focus:ring-4
              focus:ring-[#1689E8]/10
            "
            placeholder="Search by supplier name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

      </div>

      {/* SUPPLIER COUNT */}

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-bold text-[#071A36]">
            Supplier List
          </p>

          <p className="mt-0.5 text-[10px] font-medium text-[#666666]">
            {filtered.length} supplier
            {filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="
              flex items-center gap-1.5
              rounded-lg
              bg-[#F1F7FC]
              px-2.5 py-1.5
              text-[10px] font-bold
              text-[#1689E8]
              hover:bg-[#E6F3FC]
            "
          >
            <X size={12} />
            Clear
          </button>
        )}

      </div>

      {/* SUPPLIER CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {filtered.map((s, index) => {

          const styles = [
            {
              border: 'border-[#1689E8]',
              glow: 'shadow-[0_5px_20px_rgba(22,137,232,0.10)]',
              iconBg: 'bg-[#EAF5FF]',
              icon: 'text-[#1689E8]',
            },
            {
              border: 'border-[#19B879]',
              glow: 'shadow-[0_5px_20px_rgba(25,184,121,0.10)]',
              iconBg: 'bg-[#EAFBF5]',
              icon: 'text-[#19B879]',
            },
            {
              border: 'border-[#F2A315]',
              glow: 'shadow-[0_5px_20px_rgba(242,163,21,0.10)]',
              iconBg: 'bg-[#FFF7E8]',
              icon: 'text-[#F2A315]',
            },
            {
              border: 'border-[#8B5CF6]',
              glow: 'shadow-[0_5px_20px_rgba(139,92,246,0.10)]',
              iconBg: 'bg-[#F4EEFF]',
              icon: 'text-[#8B5CF6]',
            },
            {
              border: 'border-[#EF4148]',
              glow: 'shadow-[0_5px_20px_rgba(239,65,72,0.10)]',
              iconBg: 'bg-[#FFF0F1]',
              icon: 'text-[#EF4148]',
            },
            {
              border: 'border-[#06A6A6]',
              glow: 'shadow-[0_5px_20px_rgba(6,166,166,0.10)]',
              iconBg: 'bg-[#EAFBFB]',
              icon: 'text-[#06A6A6]',
            },
          ]

          const style = styles[index % styles.length]

          return (
            <div
              key={s.id}
              className={`
                group overflow-hidden rounded-2xl
                border ${style.border}
                bg-white ${style.glow}
                transition-all duration-200
                hover:-translate-y-1
                hover:shadow-lg
              `}
            >

              {/* CARD TOP */}

              <div className="p-4">

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`
                        flex h-11 w-11 shrink-0
                        items-center justify-center
                        rounded-xl ${style.iconBg}
                      `}
                    >
                      <Building2
                        size={20}
                        className={style.icon}
                        strokeWidth={2.1}
                      />
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-bold text-[#071A36]">
                        {s.name || 'Unnamed Supplier'}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#19B879]" />

                        <span className="text-[10px] font-semibold text-[#666666]">
                          Active Supplier
                        </span>
                      </div>

                    </div>

                  </div>

                  <div className="rounded-lg bg-[#F4F8FB] px-2 py-1">
                    <span className="text-[9px] font-bold uppercase tracking-wide text-[#777777]">
                      Supplier
                    </span>
                  </div>

                </div>

                {/* CONTACT */}

                <div className="mt-5">

                  <div className="flex items-center gap-2.5">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EAFBF5]">

                      <Phone
                        size={14}
                        className="text-[#19B879]"
                        strokeWidth={2.3}
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[9px] font-bold uppercase tracking-wide text-[#999999]">
                        Contact
                      </p>

                      <p className="truncate text-xs font-semibold text-[#222222]">
                        {s.contact || 'Not provided'}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* ADDRESS */}

              <div
                className="
                  border-t border-[#E6EEF4]
                  bg-[#FBFDFF]
                  px-4 py-3.5
                "
              >

                <div className="flex items-start gap-2.5">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F1F5F8]">

                    <MapPin
                      size={14}
                      className="text-[#555555]"
                      strokeWidth={2.2}
                    />

                  </div>

                  <div className="min-w-0">

                    <p className="text-[9px] font-bold uppercase tracking-wide text-[#999999]">
                      Address
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium leading-4 text-[#333333]">
                      {s.address || 'Address not provided'}
                    </p>

                  </div>

                </div>

              </div>

            </div>
          )
        })}

        {/* EMPTY STATE */}

        {filtered.length === 0 && (
          <div
            className="
              col-span-full
              rounded-2xl
              border border-[#D8EAF7]
              bg-white
              px-5 py-14
              text-center
              shadow-[0_5px_20px_rgba(7,26,54,0.05)]
            "
          >

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF5FF]">

              <Building2
                size={25}
                className="text-[#1689E8]"
              />

            </div>

            <p className="mt-4 text-sm font-bold text-[#071A36]">
              No suppliers found
            </p>

            <p className="mt-1 text-[11px] font-medium text-[#666666]">
              {search
                ? 'Try searching with a different supplier name.'
                : 'Add your first supplier to get started.'}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="
                  mt-4 inline-flex items-center gap-2
                  rounded-lg bg-[#1689E8]
                  px-4 py-2
                  text-[11px] font-bold text-white
                  hover:bg-[#1178D0]
                "
              >
                <Plus size={14} />
                Add Supplier
              </button>
            )}

          </div>
        )}

      </div>

      {/* ADD SUPPLIER MODAL */}

      {showForm && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-[#071A36]/45
            p-4
            backdrop-blur-[3px]
          "
          onClick={closeForm}
        >

          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-[500px]
              max-h-[92vh]
              overflow-hidden
              rounded-2xl
              border border-[#BFDDF5]
              bg-white
              shadow-[0_25px_70px_rgba(7,26,54,0.28)]
            "
          >

            {/* MODAL HEADER */}

            <div className="bg-gradient-to-r from-[#071A36] to-[#0C315D] px-5 py-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1689E8] shadow-lg shadow-blue-900/30">

                    <Building2
                      size={19}
                      className="text-white"
                    />

                  </div>

                  <div>

                    <h3 className="text-sm font-bold text-white">
                      Add Supplier
                    </h3>

                    <p className="mt-0.5 text-[10px] font-medium text-blue-100">
                      Enter supplier information
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="
                    flex h-8 w-8 items-center justify-center
                    rounded-lg text-white
                    hover:bg-white/10
                    disabled:opacity-50
                  "
                >
                  <X size={17} />
                </button>

              </div>

            </div>

            {/* FORM */}

            <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5">

              {/* NAME */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-[#071A36]">
                  Supplier Name *
                </label>

                <input
                  required
                  className="
                    h-10 w-full
                    rounded-xl
                    border border-[#C9DCEB]
                    bg-[#FBFDFF]
                    px-3
                    text-xs font-medium text-[#111111]
                    outline-none
                    placeholder:text-[#888888]
                    focus:border-[#1689E8]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#1689E8]/10
                  "
                  placeholder="Enter supplier name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />

              </div>

              {/* CONTACT */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-[#071A36]">
                  Contact *
                </label>

                <div className="relative">

                  <Phone
                    size={14}
                    className="
                      absolute left-3 top-1/2
                      -translate-y-1/2
                      text-[#1689E8]
                    "
                  />

                  <input
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className={`
                      h-10 w-full
                      rounded-xl
                      border
                      ${phoneError
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-[#C9DCEB] focus:border-[#1689E8]'
                      }
                      bg-[#FBFDFF]
                      pl-9 pr-3
                      text-xs font-medium text-[#111111]
                      outline-none
                      placeholder:text-[#888888]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#1689E8]/10
                    `}
                    placeholder="Enter 10-digit phone number"
                    value={form.contact}
                    onChange={(e) =>
                      handlePhoneChange(e.target.value)
                    }
                  />

                </div>

                {phoneError && (
                  <p className="mt-1.5 text-[10px] font-semibold text-red-500">
                    {phoneError}
                  </p>
                )}

                {!phoneError && form.contact.length === 10 && (
                  <p className="mt-1.5 text-[10px] font-semibold text-[#19B879]">
                    Valid 10-digit phone number
                  </p>
                )}

              </div>

              {/* ADDRESS */}

              <div>

                <label className="mb-1.5 block text-[11px] font-bold text-[#071A36]">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={14}
                    className="
                      absolute left-3 top-3
                      text-[#1689E8]
                    "
                  />

                  <textarea
                    rows={4}
                    className="
                      w-full resize-none
                      rounded-xl
                      border border-[#C9DCEB]
                      bg-[#FBFDFF]
                      py-2.5 pl-9 pr-3
                      text-xs font-medium text-[#111111]
                      outline-none
                      placeholder:text-[#888888]
                      focus:border-[#1689E8]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#1689E8]/10
                    "
                    placeholder="Enter supplier address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        address: e.target.value,
                      })
                    }
                  />

                </div>

              </div>

            </div>

            {/* FOOTER */}

            <div
              className="
                flex flex-col-reverse gap-2
                border-t border-[#E1ECF3]
                bg-[#F8FBFE]
                p-4
                sm:flex-row sm:justify-end
              "
            >

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="
                  h-10 rounded-xl
                  border border-[#C9DCEB]
                  bg-white px-5
                  text-xs font-bold text-[#333333]
                  hover:bg-[#F1F6FA]
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || !!phoneError || form.contact.length !== 10}
                className="
                  flex h-10 items-center justify-center gap-2
                  rounded-xl
                  bg-[#1689E8]
                  px-5
                  text-xs font-bold text-white
                  shadow-[0_5px_15px_rgba(22,137,232,0.25)]
                  hover:bg-[#1178D0]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Plus size={15} />
                {saving ? 'Saving...' : 'Save Supplier'}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  )
}