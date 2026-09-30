import { useState } from 'react'
import {
  Search,
  RotateCcw,
  FileText,
  User,
  Phone,
  CreditCard,
  IndianRupee,
  Package,
  AlertCircle,
  CheckCircle2,
  ArrowLeftRight,
} from 'lucide-react'

import {
  getBillByNumber,
  createReturn,
} from '../services/api'

export default function Returns() {
  const [billNo, setBillNo] = useState('')
  const [foundBill, setFoundBill] = useState(null)
  const [returnItems, setReturnItems] = useState([])
  const [reason, setReason] = useState('')
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSearch() {
    const value = billNo.trim()

    if (!value) {
      return alert('Enter the sale ID / bill number.')
    }

    setSearching(true)

    try {
      const bill = await getBillByNumber(value)

      setFoundBill(bill)

      setReturnItems(
        (bill.items || []).map((it) => ({
          ...it,
          returnQty: 0,
        }))
      )
    } catch (error) {
      setFoundBill(null)
      setReturnItems([])

      alert(
        error?.response?.data?.message ||
          'Sale ID not found.'
      )
    } finally {
      setSearching(false)
    }
  }

  function updateReturnQty(idx, val) {
    setReturnItems((prev) =>
      prev.map((it, i) =>
        i === idx
          ? {
              ...it,
              returnQty: Math.min(
                it.qty,
                Math.max(0, Number(val))
              ),
            }
          : it
      )
    )
  }

  const refundTotal = returnItems.reduce(
    (sum, it) =>
      sum +
      it.returnQty * Number(it.price || 0),
    0
  )

  const selectedItems = returnItems.filter(
    (item) => Number(item.returnQty) > 0
  ).length

  async function handleCreateCreditNote() {
    if (!foundBill) return

    if (!refundTotal) {
      return alert(
        'Select at least one item quantity to return.'
      )
    }

    setSaving(true)

    try {
      const response = await createReturn({
        billNo: foundBill.billNo,
        reason,
        items: returnItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          returnQty: item.returnQty,
          price: item.price,
        })),
      })

      alert(
        `Credit note ${
          response.returnNo || ''
        } created for ₹${refundTotal.toFixed(
          2
        )}. Stock has been restored.`
      )

      setFoundBill(null)
      setReturnItems([])
      setBillNo('')
      setReason('')
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to create credit note.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-full space-y-5 pb-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1689E8] shadow-lg shadow-blue-200">
            <RotateCcw
              size={22}
              strokeWidth={2.2}
              className="text-white"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#071A36] sm:text-2xl">
              Returns / Credit Note
            </h2>

            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Process medicine returns and restore stock
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#D9E9F7] bg-white px-4 py-2.5 shadow-sm">
          <ArrowLeftRight
            size={16}
            className="text-[#1689E8]"
          />

          <span className="text-xs font-semibold text-slate-600">
            Return Management
          </span>
        </div>
      </div>

      {/* SEARCH CARD */}
      <div className="overflow-hidden rounded-2xl border border-[#D9E9F7] bg-white shadow-[0_8px_30px_rgba(7,26,54,0.06)]">

        <div className="border-b border-[#E7F0F7] bg-gradient-to-r from-[#F5FBFF] to-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E7F5FF]">
              <Search
                size={18}
                className="text-[#1689E8]"
              />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#071A36]">
                Find Sale
              </h3>

              <p className="text-xs text-slate-500">
                Search using the sale ID or bill number
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">

            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold text-[#071A36]">
                Sale ID / Bill Number
              </label>

              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1689E8]"
                />

                <input
                  className="w-full rounded-xl border border-[#D6E6F2] bg-[#FBFDFF] py-3 pl-10 pr-4 text-sm font-medium text-[#071A36] outline-none transition placeholder:text-slate-400 focus:border-[#1689E8] focus:bg-white focus:ring-4 focus:ring-[#1689E8]/10"
                  placeholder="Enter sale ID e.g. CC-20260927-0001..."
                  value={billNo}
                  onChange={(e) =>
                    setBillNo(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    handleSearch()
                  }
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={searching}
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#1689E8] px-7 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-[#0875CB] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Search size={17} />

              {searching
                ? 'Finding...'
                : 'Find Sale'}
            </button>
          </div>
        </div>
      </div>

      {/* SALE DETAILS */}
      {foundBill && (
        <>
          <div className="overflow-hidden rounded-2xl border border-[#D9E9F7] bg-white shadow-[0_8px_30px_rgba(7,26,54,0.06)]">

            {/* DARK HEADER */}
            <div className="flex flex-col gap-3 border-b border-[#E7F0F7] bg-gradient-to-r from-[#071A36] to-[#0C2D55] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <FileText
                    size={19}
                    className="text-white"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                    Sale Details
                  </p>

                  <p className="text-sm font-bold text-white">
                    {foundBill.billNo}
                  </p>
                </div>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-lg bg-emerald-500/15 px-3 py-1.5">
                <CheckCircle2
                  size={15}
                  className="text-emerald-300"
                />

                <span className="text-xs font-semibold text-emerald-200">
                  Sale Found
                </span>
              </div>
            </div>

            {/* SALE INFORMATION */}
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-5">

              <InfoBox
                icon={<FileText size={16} />}
                label="Sale ID"
                value={foundBill.billNo}
              />

              <InfoBox
                icon={<User size={16} />}
                label="Customer"
                value={
                  foundBill.customerName || '-'
                }
              />

              <InfoBox
                icon={<Phone size={16} />}
                label="Phone"
                value={
                  foundBill.customerPhone || '-'
                }
              />

              <InfoBox
                icon={<CreditCard size={16} />}
                label="Payment"
                value={
                  foundBill.paymentMethod || '-'
                }
              />

              <div className="rounded-xl border border-[#CFE7FA] bg-[#F4FAFF] p-3.5">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#DFF1FF]">
                    <IndianRupee
                      size={14}
                      className="text-[#1689E8]"
                    />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Grand Total
                  </span>
                </div>

                <p className="text-base font-extrabold text-[#1689E8]">
                  ₹
                  {Number(
                    foundBill.grandTotal || 0
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="overflow-hidden rounded-2xl border border-[#D9E9F7] bg-white shadow-[0_8px_30px_rgba(7,26,54,0.06)]">

            <div className="flex flex-col gap-3 border-b border-[#E7F0F7] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF6FF]">
                  <Package
                    size={18}
                    className="text-[#1689E8]"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#071A36]">
                    Select Items to Return
                  </h3>

                  <p className="text-xs text-slate-500">
                    Enter the quantity you want to return
                  </p>
                </div>
              </div>

              <div className="w-fit rounded-full bg-[#EAF6FF] px-3 py-1.5 text-xs font-bold text-[#1689E8]">
                {selectedItems} item
                {selectedItems !== 1 ? 's' : ''}{' '}
                selected
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">

                <thead>
                  <tr className="border-b border-[#E6EEF5] bg-[#F8FBFD]">

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Item
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Billed Qty
                    </th>

                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Price
                    </th>

                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Return Qty
                    </th>

                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Refund Amount
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {returnItems.map((it, idx) => {
                    const amount =
                      it.returnQty *
                      Number(it.price || 0)

                    const selected =
                      Number(it.returnQty) > 0

                    return (
                      <tr
                        key={`${it.productId}-${idx}`}
                        className={`border-b border-[#EEF3F7] transition ${
                          selected
                            ? 'bg-[#F3FAFF]'
                            : 'hover:bg-[#FBFDFF]'
                        }`}
                      >

                        {/* ITEM */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                selected
                                  ? 'bg-[#DDF2FF] text-[#1689E8]'
                                  : 'bg-[#F1F5F8] text-slate-500'
                              }`}
                            >
                              <Package size={16} />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#071A36]">
                                {it.name}
                              </p>

                              {it.productId && (
                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  Product ID:{' '}
                                  {it.productId}
                                </p>
                              )}
                            </div>

                          </div>
                        </td>

                        {/* BILLED QTY */}
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex min-w-9 justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-700">
                            {it.qty}
                          </span>
                        </td>

                        {/* PRICE */}
                        <td className="px-4 py-4 text-right">
                          <span className="text-sm font-semibold text-[#071A36]">
                            ₹
                            {Number(
                              it.price || 0
                            ).toFixed(2)}
                          </span>
                        </td>

                        {/* RETURN QTY */}
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <input
                              type="number"
                              min="0"
                              max={it.qty}
                              className={`h-9 w-20 rounded-lg border bg-white px-2 text-center text-sm font-bold outline-none transition focus:ring-4 focus:ring-[#1689E8]/10 ${
                                selected
                                  ? 'border-[#1689E8] text-[#1689E8]'
                                  : 'border-[#D6E4EE] text-[#071A36]'
                              }`}
                              value={it.returnQty}
                              onChange={(e) =>
                                updateReturnQty(
                                  idx,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </td>

                        {/* REFUND */}
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`text-sm font-extrabold ${
                              selected
                                ? 'text-[#1689E8]'
                                : 'text-slate-400'
                            }`}
                          >
                            ₹{amount.toFixed(2)}
                          </span>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {returnItems.length === 0 && (
              <div className="p-10 text-center">
                <Package
                  size={30}
                  className="mx-auto mb-2 text-slate-300"
                />

                <p className="text-sm font-semibold text-slate-500">
                  No items found in this sale
                </p>
              </div>
            )}
          </div>

          {/* BOTTOM SECTION */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">

            {/* RETURN REASON */}
            <div className="rounded-2xl border border-[#D9E9F7] bg-white p-5 shadow-[0_8px_30px_rgba(7,26,54,0.06)]">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5E8]">
                  <AlertCircle
                    size={18}
                    className="text-orange-500"
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#071A36]">
                    Return Reason
                  </h3>

                  <p className="text-xs text-slate-500">
                    Add a note for this return
                  </p>
                </div>

              </div>

              <textarea
                className="min-h-[120px] w-full resize-none rounded-xl border border-[#D6E6F2] bg-[#FBFDFF] p-3.5 text-sm font-medium text-[#071A36] outline-none transition placeholder:text-slate-400 focus:border-[#1689E8] focus:bg-white focus:ring-4 focus:ring-[#1689E8]/10"
                rows={4}
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="e.g. Damaged packaging, wrong medicine dispensed..."
              />
            </div>

            {/* REFUND SUMMARY */}
            <div className="overflow-hidden rounded-2xl border border-[#BFE1FA] bg-white shadow-[0_8px_30px_rgba(22,137,232,0.10)]">

              <div className="bg-gradient-to-br from-[#071A36] to-[#0C315D] p-5">

                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-200">
                  Refund Summary
                </p>

                <div className="mt-3 flex items-end justify-between">

                  <div>
                    <p className="text-xs text-blue-100">
                      Total refund
                    </p>

                    <p className="mt-1 text-3xl font-extrabold text-white">
                      ₹{refundTotal.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    <IndianRupee
                      size={22}
                      className="text-white"
                    />
                  </div>

                </div>
              </div>

              <div className="space-y-3 p-5">

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Selected items
                  </span>

                  <span className="font-bold text-[#071A36]">
                    {selectedItems}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Stock action
                  </span>

                  <span className="font-bold text-emerald-600">
                    Stock Restored
                  </span>
                </div>

                <div className="border-t border-[#E8EFF4] pt-4">

                  <button
                    onClick={
                      handleCreateCreditNote
                    }
                    disabled={
                      saving || !refundTotal
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1689E8] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#0875CB] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    <CheckCircle2 size={17} />

                    {saving
                      ? 'Creating Credit Note...'
                      : 'Create Credit Note'}
                  </button>

                </div>

                <p className="text-center text-[10px] leading-4 text-slate-400">
                  Creating the credit note will restore
                  the returned quantity to inventory.
                </p>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* =======================================================
   INFORMATION BOX
======================================================= */

function InfoBox({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#E1ECF3] bg-[#FBFDFF] p-3.5">

      <div className="mb-2 flex items-center gap-2">

        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF6FF] text-[#1689E8]">
          {icon}
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </span>

      </div>

      <p
        className="truncate text-sm font-bold text-[#071A36]"
        title={value}
      >
        {value}
      </p>

    </div>
  )
}