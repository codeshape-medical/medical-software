

import { useEffect, useState } from 'react'
import { Search, Plus, Minus, Trash2, Printer, PauseCircle, X } from 'lucide-react'

import {
  getProducts,
  createBill,
  searchProducts,
  searchCustomersByPhone,
} from '../services/api'

/* ================= WHATSAPP ICON ================= */

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.05 0C5.48 0 .14 5.34.14 11.91c0 2.1.55 4.15 1.59 5.96L.04 24l6.27-1.64a11.87 11.87 0 0 0 5.73 1.47h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.24-6.17-3.43-8.44ZM12.05 21.8h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.88 9.88 0 0 1-1.51-5.28C2.17 6.44 6.6 2 12.06 2c2.64 0 5.12 1.03 6.98 2.9a9.86 9.86 0 0 1 2.9 7.01c0 5.46-4.44 9.89-9.89 9.89Zm5.43-7.4c-.3-.15-1.78-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.74-1.64-2.03-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.68-1.64-.93-2.24-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.28.3-1.04 1.02-1.04 2.5 0 1.48 1.07 2.91 1.22 3.11.15.2 2.1 3.21 5.09 4.5.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  )
}

/* ================= HELPERS ================= */

function getLoggedInUser() {
  const keys = ['user', 'loggedInUser', 'currentUser', 'userData', 'loginUser', 'authUser', 'mstore_user']

  for (const store of [sessionStorage, localStorage]) {
    for (const key of keys) {
      try {
        const value = store.getItem(key)
        if (!value) continue
        try {
          const p = JSON.parse(value)
          const name = p?.name || p?.username || p?.fullName || p?.user?.name || p?.user?.username
          if (name) return name
        } catch {
          if (value.trim()) return value
        }
      } catch {
        // ignore storage errors
      }
    }
  }
  return 'Staff'
}

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const inputCls =
  'w-full h-9 rounded-lg border border-[#D7E2ED] bg-[#FAFCFE] px-3 text-[12px] text-[#17212B] font-medium outline-none placeholder:text-[#8A97A6] focus:border-[#1689E8] focus:bg-white focus:shadow-[0_0_0_3px_rgba(22,137,232,0.10)]'
const labelCls = 'block text-[11px] font-bold text-[#526274] mb-1.5'
const cardCls = 'bg-white rounded-xl p-4 md:p-5 shadow-[0_4px_20px_rgba(15,35,60,0.07)]'

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 10)
}

function isValidIndianPhone(value) {
  return /^[6-9]\d{9}$/.test(normalizePhone(value))
}

function cleanName(value) {
  return String(value ?? '').replace(/[^A-Za-z .'-]/g, '').slice(0, 100)
}

function cleanAddress(value) {
  return String(value ?? '').replace(/[<>]/g, '').slice(0, 250)
}

function cleanDiscount(value) {
  const text = String(value ?? '').replace(/[^0-9.]/g, '')
  const firstDot = text.indexOf('.')
  if (firstDot !== -1) {
    return text.slice(0, firstDot + 1) + text.slice(firstDot + 1).replace(/\./g, '')
  }
  return text
}

/* ================= BILLING ================= */

export default function Billing() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])

  // Medicine search (with suggestions)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Small search inside "Available Medicines"
  const [listSearch, setListSearch] = useState('')

  // Customer
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerSuggestions, setCustomerSuggestions] = useState([])

  // Discount
  const [discountType, setDiscountType] = useState('percent')
  const [discountValue, setDiscountValue] = useState(0)
  const [discountReason, setDiscountReason] = useState('')

  // Payment / bill
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [saving, setSaving] = useState(false)
  const [billNumber, setBillNumber] = useState('')
  const [billedBy, setBilledBy] = useState(getLoggedInUser())

  useEffect(() => {
    getProducts().then(setProducts)
    setBilledBy(getLoggedInUser())
  }, [])

  /* ===== live medicine suggestions (2+ letters) ===== */
  useEffect(() => {
    const value = search.trim()

    if (value.length < 2) {
      setSearchResults([])
      return
    }

    let active = true
    const timer = setTimeout(async () => {
      try {
        const rows = await searchProducts(value)
        if (active) setSearchResults(Array.isArray(rows) ? rows.slice(0, 8) : [])
      } catch (error) {
        console.error('Medicine search error:', error)
        if (active) {
          setSearchResults(
            products
              .filter((p) => `${p.name} ${p.brand || ''}`.toLowerCase().includes(value.toLowerCase()))
              .slice(0, 8)
          )
        }
      }
    }, 220)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [search, products])

  /* ===== customer phone autofill ===== */
  useEffect(() => {
    const phone = customerPhone.replace(/\D/g, '')

    if (phone.length < 3) {
      setCustomerSuggestions([])
      return
    }

    let active = true
    const timer = setTimeout(async () => {
      try {
        const rows = await searchCustomersByPhone(phone)
        if (!active) return

        setCustomerSuggestions(Array.isArray(rows) ? rows : [])

        const exact = rows?.find((c) => c.phone.replace(/\D/g, '') === phone)
        if (exact) {
          setCustomerName(exact.name || '')
          setCustomerAddress(exact.address || '')
        }
      } catch (error) {
        console.error('Customer search error:', error)
        if (active) setCustomerSuggestions([])
      }
    }, 220)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [customerPhone])

  /* ================= CART ================= */

  function addToCart(product) {
    if (!product?.id || !product?.name || !Number.isFinite(Number(product.salePrice)) || Number(product.salePrice) < 0) {
      alert('Invalid medicine data. Please select a valid medicine.')
      return
    }

    if (!Number.isFinite(Number(product.stock)) || Number(product.stock) <= 0) {
      alert('This medicine is out of stock.')
      return
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)

      if (existing) {
        if (existing.qty >= existing.maxStock) {
          alert('Maximum available stock reached.')
          return prev
        }
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.salePrice),
          qty: 1,
          maxStock: Number(product.stock),
        },
      ]
    })
  }

  // Used by the suggestion dropdown
  function pickSuggestion(product) {
    addToCart(product)
    setSearch('')
    setSearchResults([])
    setShowSuggestions(false)
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId !== id) return item
        const newQty = item.qty + delta
        if (newQty < 1) return item
        if (newQty > item.maxStock) {
          alert('Maximum available stock reached.')
          return item
        }
        return { ...item, qty: newQty }
      })
    )
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((item) => item.productId !== id))
  }

  function clearBill() {
    setCart([])
    setCustomerName('')
    setCustomerPhone('')
    setCustomerAddress('')
    setDiscountType('percent')
    setDiscountValue(0)
    setDiscountReason('')
    setPaymentMethod('Cash')
    setCustomerSuggestions([])
    setSearch('')
    setBillNumber('')
  }

  /* ================= TOTALS ================= */

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0)
  const enteredDiscount = Number(discountValue) || 0

  let discountAmt = discountType === 'percent' ? (subtotal * enteredDiscount) / 100 : enteredDiscount
  discountAmt = Math.min(Math.max(discountAmt, 0), subtotal)

  const grandTotal = Math.max(0, subtotal - discountAmt)

  /* ================= BILL DATA ================= */

  function generateBillNumber() {
    return `CC-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
  }

  function getDateTime() {
    const now = new Date()
    return {
      date: now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  function validateBill() {
    if (!cart.length) return alert('Please add at least one medicine.'), false

    if (!customerName.trim()) return alert('Please enter customer name.'), false
    if (customerName.trim().length < 2) return alert('Customer name must contain at least 2 characters.'), false
    if (!/^[A-Za-z][A-Za-z .'-]*$/.test(customerName.trim()))
      return alert('Customer name can contain only letters, spaces, apostrophe and hyphen.'), false

    if (!customerPhone.trim()) return alert('Please enter customer phone number.'), false
    if (!isValidIndianPhone(customerPhone))
      return alert('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.'), false

    if (!customerAddress.trim()) return alert('Please enter customer address.'), false
    if (customerAddress.trim().length < 5) return alert('Please enter a valid customer address.'), false

    if (!['percent', 'rupees'].includes(discountType))
      return alert('Invalid discount type.'), false

    if (!Number.isFinite(enteredDiscount) || enteredDiscount < 0)
      return alert('Please enter a valid discount.'), false

    if (discountType === 'percent' && enteredDiscount > 100)
      return alert('Percentage discount cannot exceed 100%.'), false

    if (discountType === 'rupees' && enteredDiscount > subtotal)
      return alert('Discount cannot be greater than subtotal.'), false

    if (discountAmt > 0) {
      if (!discountReason.trim())
        return alert('Please enter the reason for the discount.'), false
      if (discountReason.trim().length < 3)
        return alert('Discount reason must contain at least 3 characters.'), false
    }

    if (!['Cash', 'Online', 'Check'].includes(paymentMethod))
      return alert('Please select a valid payment method.'), false

    for (const item of cart) {
      if (!item.productId || !item.name) return alert('Invalid medicine in the bill.'), false
      if (!Number.isInteger(Number(item.qty)) || Number(item.qty) < 1)
        return alert(`Invalid quantity for ${item.name}.`), false
      if (!Number.isFinite(Number(item.price)) || Number(item.price) < 0)
        return alert(`Invalid price for ${item.name}.`), false
      if (!Number.isFinite(Number(item.maxStock)) || Number(item.qty) > Number(item.maxStock))
        return alert(`Quantity for ${item.name} exceeds available stock.`), false
    }

    if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(grandTotal) || grandTotal < 0)
      return alert('Invalid bill amount. Please check the bill items.'), false

    return true
  }

  function getBillData(number) {
    const dt = getDateTime()

    return {
      billNumber: number,
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        address: customerAddress.trim(),
      },
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: Number(item.price),
        amount: Number(item.price) * Number(item.qty),
      })),
      subtotal,
      discountType,
      discountValue: enteredDiscount,
      discountAmount: discountAmt,
      discountReason: discountAmt > 0 ? discountReason.trim() : '',
      tax: 0,
      grandTotal,
      date: dt.date,
      time: dt.time,
      billedBy,
      paymentMethod,
    }
  }

  /* ================= SAVE BILL ================= */

  async function saveBillToBackend() {
    if (!validateBill()) return null

    setSaving(true)

    try {
      const newBillNumber = billNumber || generateBillNumber()
      const bill = getBillData(newBillNumber)

      const response = await createBill({
        billNumber: bill.billNumber,
        customer: bill.customer,
        customerName: bill.customer.name,
        customerPhone: bill.customer.phone,
        customerAddress: bill.customer.address,
        items: bill.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          qty: item.qty,
          quantity: item.qty,
          price: item.price,
          amount: item.amount,
        })),
        subtotal: bill.subtotal,
        discountType: bill.discountType,
        discountValue: bill.discountValue,
        discountAmount: bill.discountAmount,
        discountReason: bill.discountReason,
        tax: 0,
        grandTotal: bill.grandTotal,
        billedBy: bill.billedBy,
        paymentMethod: bill.paymentMethod,
      })

      const backendBillNumber =
        response?.billNumber ||
        response?.bill?.billNumber ||
        response?.data?.billNumber ||
        newBillNumber

      setBillNumber(backendBillNumber)
      getProducts().then(setProducts).catch(() => {})

      return { ...bill, billNumber: backendBillNumber }
    } catch (error) {
      console.error('Save bill error:', error)
      alert(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to save the bill. Please try again.'
      )
      return null
    } finally {
      setSaving(false)
    }
  }

  function discountLabelOf(bill) {
    return bill.discountType === 'percent'
      ? `Discount (${bill.discountValue}%)`
      : `Discount (₹${bill.discountValue.toFixed(2)})`
  }

  /* ================= PRINT BILL ================= */

  async function printBill() {
    if (!validateBill()) return

    const bill = await saveBillToBackend()
    if (!bill) return

    const itemsHTML = bill.items
      .map(
        (item, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${esc(item.name)}</td>
            <td style="text-align:center">${item.qty}</td>
            <td style="text-align:right">₹${Number(item.price).toFixed(2)}</td>
            <td style="text-align:right">₹${Number(item.amount).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    const reasonHTML = bill.discountReason
      ? `<div class="total-row">
           <span class="muted">Discount Reason</span>
           <strong style="text-align:right;max-width:60%">${esc(bill.discountReason)}</strong>
         </div>`
      : ''

    const printWindow = window.open('', '_blank', 'width=900,height=1000,left=0,top=0')

    if (!printWindow) {
      alert('Please allow pop-ups to print the bill.')
      return
    }

    const detail = (label, value) => `
      <div class="detail-row"><span class="muted">${label}</span><strong>${esc(value)}</strong></div>`

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>City Care Hospital - Bill</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 20px; background: #f5f7fa; font-family: Arial, Helvetica, sans-serif; color: #17212b; }
            .receipt { width: 100%; max-width: 430px; margin: auto; background: #fff; padding: 24px; border-radius: 14px; box-shadow: 0 5px 25px rgba(0,0,0,.10); }
            .header { text-align: center; padding-bottom: 15px; border-bottom: 2px dashed #d8dee7; }
            .logo { width: 62px; height: 62px; object-fit: contain; border-radius: 50%; margin-bottom: 8px; }
            .hospital { font-size: 21px; font-weight: 800; color: #071a36; margin: 0; }
            .store { font-size: 12px; color: #64748b; margin-top: 4px; }
            .bill-title { display: inline-block; margin-top: 12px; padding: 5px 14px; border-radius: 20px; background: #071a36; color: #e8d5a8; font-size: 11px; font-weight: bold; }
            .details { margin: 16px 0; font-size: 12px; }
            .detail-row { display: flex; justify-content: space-between; gap: 15px; margin: 5px 0; }
            .detail-row strong { text-align: right; }
            .muted { color: #64748b; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
            th { text-align: left; background: #071a36; color: #fff; padding: 8px 5px; }
            td { padding: 9px 5px; border-bottom: 1px solid #edf0f4; }
            .totals { margin-top: 15px; padding-top: 12px; border-top: 2px dashed #d8dee7; }
            .total-row { display: flex; justify-content: space-between; gap: 15px; margin: 7px 0; font-size: 13px; }
            .grand { margin-top: 10px; padding: 12px; background: #eef6fd; border-radius: 8px; font-size: 18px; font-weight: 800; color: #071a36; }
            .footer { text-align: center; margin-top: 22px; padding-top: 14px; border-top: 1px dashed #d8dee7; font-size: 10px; color: #64748b; }
            @media print {
              @page { size: A4 portrait; margin: 10mm; }
              html, body { width: 100%; min-height: 100%; margin: 0; padding: 0; background: #fff; }
              .receipt { width: 100%; max-width: 100%; margin: 0 auto; background: #fff; box-shadow: none; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <img src="/images/logo.png" class="logo" alt="City Care Hospital" />
              <p class="hospital">City Care Hospital</p>
              <p class="store">Medical Store</p>
              <span class="bill-title">MEDICAL STORE BILL</span>
            </div>

            <div class="details">
              ${detail('Bill No.', bill.billNumber)}
              ${detail('Date', bill.date)}
              ${detail('Time', bill.time)}
              ${detail('Customer', bill.customer.name)}
              ${detail('Phone', bill.customer.phone)}
              ${detail('Address', bill.customer.address)}
              ${detail('Payment', bill.paymentMethod)}
              ${detail('Billed By', bill.billedBy)}
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Medicine</th>
                  <th style="text-align:center">Qty</th>
                  <th style="text-align:right">Rate</th>
                  <th style="text-align:right">Amount</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
            </table>

            <div class="totals">
              <div class="total-row"><span class="muted">Subtotal</span><strong>₹${bill.subtotal.toFixed(2)}</strong></div>
              <div class="total-row"><span class="muted">${discountLabelOf(bill)}</span><strong>-₹${bill.discountAmount.toFixed(2)}</strong></div>
              ${reasonHTML}
              <div class="total-row"><span class="muted">Tax</span><strong>₹0.00</strong></div>
              <div class="grand">
                <div style="display:flex;justify-content:space-between">
                  <span>Grand Total</span>
                  <span>₹${bill.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <strong>Thank you for choosing City Care Hospital</strong><br />
              Please keep this bill for your records.
            </div>
          </div>

          <script>
            window.onload = function () { window.print() }
            window.onafterprint = function () { window.close() }
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  /* ================= WHATSAPP ================= */

  async function sendWhatsApp() {
    if (!validateBill()) return

    const bill = await saveBillToBackend()
    if (!bill) return

    const billText = [
      '*CITY CARE HOSPITAL*',
      '*Medical Store Bill*',
      '',
      `Bill No: ${bill.billNumber}`,
      `Date: ${bill.date}`,
      `Time: ${bill.time}`,
      '',
      `Customer: ${bill.customer.name}`,
      `Phone: ${bill.customer.phone}`,
      `Address: ${bill.customer.address}`,
      '',
      '*Items:*',
      ...bill.items.map((item, i) => `${i + 1}. ${item.name} × ${item.qty} — ₹${item.amount.toFixed(2)}`),
      '',
      `Subtotal: ₹${bill.subtotal.toFixed(2)}`,
      `${discountLabelOf(bill)}: -₹${bill.discountAmount.toFixed(2)}`,
      ...(bill.discountReason ? [`Discount Reason: ${bill.discountReason}`] : []),
      'Tax: ₹0.00',
      `*Grand Total: ₹${bill.grandTotal.toFixed(2)}*`,
      '',
      `Payment: ${bill.paymentMethod}`,
      `Billed By: ${bill.billedBy}`,
      '',
      'Thank you for choosing City Care Hospital.',
    ].join('\n')

    const whatsappNumber = '9192500048457'

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(billText)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  /* ================= SAVE / HOLD ================= */

  async function handleHold() {
    if (!validateBill()) return

    const bill = await saveBillToBackend()
    if (!bill) return

    alert(`Bill ${bill.billNumber} saved successfully.`)
    clearBill()
  }

  /* ================= AVAILABLE MEDICINES LIST ================= */

  const listQuery = listSearch.trim().toLowerCase()
  const visibleProducts = listQuery
    ? products
        .filter((p) => `${p.name} ${p.brand || ''}`.toLowerCase().includes(listQuery))
        .slice(0, 30)
    : products.slice(0, 8)

  /* ================= UI ================= */

  return (
    <div className="w-full min-h-full bg-[#F5F8FC] p-3 md:p-4">
      <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight mb-4">Billing</h2>

      {/* ================= CUSTOMER DETAILS ================= */}

      <div className={`${cardCls} mb-4`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[17px] font-bold text-[#071A36]">Customer Details</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Enter customer information for this bill</p>
          </div>

          <div className="px-3 py-1 rounded-full bg-[#EAF6FF] text-[#1689E8] text-[10px] font-bold">
            Billed By: {billedBy}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(cleanName(e.target.value))}
              placeholder="Enter customer name"
              maxLength={100}
              autoComplete="name"
              className={inputCls}
            />
          </div>

          <div className="relative">
            <label className={labelCls}>Phone Number</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(normalizePhone(e.target.value))}
              placeholder="Enter phone number"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel"
              className={inputCls}
            />

            {customerSuggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 mt-1 overflow-hidden rounded-lg border border-[#D6E9FA] bg-white shadow-lg">
                {customerSuggestions.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setCustomerPhone(customer.phone || '')
                      setCustomerName(customer.name || '')
                      setCustomerAddress(customer.address || '')
                      setCustomerSuggestions([])
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-[#EFF8FF] border-b border-[#EEF4F9] last:border-0"
                  >
                    <p className="text-xs font-semibold text-[#17212B]">{customer.name}</p>
                    <p className="text-[10px] text-[#6B86A5]">{customer.phone}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>Address</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(cleanAddress(e.target.value))}
              placeholder="Enter customer address"
              maxLength={250}
              autoComplete="street-address"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* ================= MEDICINE INPUT WITH SUGGESTIONS ================= */}

      <div className="relative mb-4">
        <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1689E8] pointer-events-none" />

        <input
          className="w-full h-10 rounded-lg border border-[#BFD9EA] bg-white pl-10 pr-9 text-[13px] text-[#111] font-medium outline-none placeholder:text-[#6B7785] transition-all focus:border-[#1689E8] focus:shadow-[0_0_0_3px_rgba(22,137,232,0.10)]"
          placeholder="Type 2-3 letters of the medicine name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchResults.length > 0) {
              e.preventDefault()
              pickSuggestion(searchResults[0])
            }
            if (e.key === 'Escape') setShowSuggestions(false)
          }}
          autoFocus
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
          >
            <X size={16} />
          </button>
        )}

        {showSuggestions && search.trim().length >= 2 && (
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto rounded-lg border border-[#D6E9FA] bg-white shadow-lg">
            {searchResults.length === 0 ? (
              <p className="px-3 py-3 text-xs text-slate-400">No medicine found for "{search.trim()}"</p>
            ) : (
              searchResults.map((product) => {
                const out = Number(product.stock) <= 0
                return (
                  <button
                    key={product.id}
                    type="button"
                    disabled={out}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickSuggestion(product)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 text-left border-b border-[#EEF4F9] last:border-0 hover:bg-[#EFF8FF] disabled:opacity-50 disabled:hover:bg-white"
                  >
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-[#17212B] truncate">{product.name}</span>
                      <span className={`block text-[10px] font-semibold ${out ? 'text-[#EF4148]' : Number(product.stock) <= 20 ? 'text-[#EF4148]' : 'text-[#19A86B]'}`}>
                        {out ? 'Out of stock' : `Stock: ${product.stock}`}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-[#071A36] shrink-0">
                      ₹{Number(product.salePrice).toFixed(2)}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* ================= MAIN BILLING AREA ================= */}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-4">
        {/* ================= CURRENT BILL (LEFT) ================= */}

        <div className={`${cardCls} flex flex-col min-h-[500px] min-w-0`}>
          <div className="flex items-center justify-between pb-3">
            <div>
              <h2 className="text-[17px] font-bold text-[#071A36]">Current Bill</h2>
              <p className="text-[10px] text-slate-400">{customerName || 'No customer yet'}</p>
            </div>

            <button
              onClick={clearBill}
              className="px-3 py-1.5 rounded-md border border-[#F2BFC3] bg-[#FFF2F3] text-[#D9363E] text-xs font-bold hover:bg-[#EF4148] hover:text-white transition-all"
            >
              Clear
            </button>
          </div>

          {/* Bill items */}
          <div className="flex-1 overflow-y-auto min-h-[180px] max-h-[310px]">
            {cart.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead>
                    <tr className="bg-[#F3F8FD]">
                      <th className="px-2 py-2 text-[10px] text-left text-[#526274]">#</th>
                      <th className="px-2 py-2 text-[10px] text-left text-[#526274]">Item Name</th>
                      <th className="px-2 py-2 text-[10px] text-center text-[#526274]">Qty</th>
                      <th className="px-2 py-2 text-[10px] text-right text-[#526274]">Rate</th>
                      <th className="px-2 py-2 text-[10px] text-right text-[#526274]">Amount</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={item.productId} className="border-b border-[#EEF2F6]">
                        <td className="px-2 py-3 text-[11px] text-slate-500">{index + 1}</td>

                        <td className="px-2 py-3">
                          <p className="text-[11px] font-semibold text-[#17212B] max-w-[125px] truncate">{item.name}</p>
                        </td>

                        <td className="px-2 py-3">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => changeQty(item.productId, -1)}
                              className="w-5 h-5 rounded bg-[#EDF2F7] flex items-center justify-center text-[#526274] hover:bg-[#DCE5EF]"
                            >
                              <Minus size={10} />
                            </button>

                            <span className="w-5 text-center text-[11px] font-bold">{item.qty}</span>

                            <button
                              onClick={() => changeQty(item.productId, 1)}
                              className="w-5 h-5 rounded bg-[#EAF3FF] text-[#1689E8] flex items-center justify-center hover:bg-[#1689E8] hover:text-white"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </td>

                        <td className="px-2 py-3 text-[11px] text-right">₹{item.price.toFixed(2)}</td>

                        <td className="px-2 py-3 text-[11px] font-bold text-right">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </td>

                        <td className="px-2 py-3">
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-[#EF4148] hover:text-red-700"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#EEF6FD] text-[#1689E8] flex items-center justify-center mb-3">
                  <ShoppingCartIcon />
                </div>
                <p className="text-sm font-semibold text-[#526274]">Cart is empty</p>
                <p className="text-[11px] text-slate-400 mt-1">Search a medicine above or pick one from the list</p>
              </div>
            )}
          </div>

          {/* Totals */}
          <div className="border-t border-[#E7EDF3] mt-3 pt-3 space-y-2">
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>Subtotal :</span>
              <span className="font-semibold text-[#17212B]">₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-[#64748B]">
              <span>Discount :</span>

              <div className="flex items-center gap-1.5">
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value)}
                  className="h-7 rounded-md bg-[#F7F9FB] border border-[#DCE4EC] px-1.5 text-[10px] font-bold text-[#17212B] outline-none focus:border-[#1689E8]"
                >
                  <option value="percent">%</option>
                  <option value="rupees">₹</option>
                </select>

                <input
                  type="number"
                  min="0"
                  max={discountType === 'percent' ? 100 : subtotal}
                  value={discountValue}
                  inputMode="decimal"
                  onChange={(e) => setDiscountValue(cleanDiscount(e.target.value))}
                  className="w-20 h-7 text-right rounded-md bg-[#F7F9FB] border border-[#DCE4EC] px-2 text-xs outline-none focus:border-[#1689E8]"
                />
              </div>
            </div>

            {/* Discount reason: appears only when a discount is applied */}
            {discountAmt > 0 && (
              <div>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value.replace(/[<>]/g, '').slice(0, 120))}
                  placeholder="Reason for discount (required)"
                  maxLength={120}
                  className={`w-full h-8 rounded-md bg-[#F7F9FB] border px-2 text-xs outline-none focus:border-[#1689E8] ${
                    discountReason.trim() ? 'border-[#DCE4EC]' : 'border-[#F2BFC3]'
                  }`}
                />
              </div>
            )}

            <div className="flex justify-between text-xs text-[#64748B]">
              <span>Discount Amount :</span>
              <span className="font-semibold text-[#D9363E]">-₹{discountAmt.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xs text-[#64748B]">
              <span>Tax :</span>
              <span className="font-semibold text-[#17212B]">₹0.00</span>
            </div>

            <div className="flex justify-between items-center text-xs text-[#64748B]">
              <span>Payment :</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-7 min-w-[105px] rounded-md bg-[#F7F9FB] border border-[#DCE4EC] px-2 text-[10px] font-bold text-[#17212B] outline-none focus:border-[#1689E8]"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Check">Check</option>
              </select>
            </div>

            <div className="mt-2 px-4 py-3 rounded-lg bg-[#F0F6FC] flex justify-between items-center">
              <span className="text-sm font-bold text-[#17212B]">Grand Total :</span>
              <span className="text-xl font-extrabold text-[#071A36]">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            <button
              onClick={handleHold}
              disabled={saving}
              className="bg-[#EDF6FD] text-[#1689E8] rounded-lg flex flex-col items-center justify-center gap-1.5 min-h-[58px] text-[11px] font-bold border border-[#CDE4FA] hover:bg-[#DDEFFF] transition-all disabled:opacity-50"
            >
              <PauseCircle size={19} />
              {saving ? 'Saving...' : 'Save Bill'}
            </button>

            <button
              onClick={printBill}
              disabled={saving}
              className="bg-[#1689E8] text-white rounded-lg flex flex-col items-center justify-center gap-1.5 min-h-[58px] text-[11px] font-bold shadow-[0_4px_14px_rgba(22,137,232,0.25)] hover:bg-[#0877D1] transition-all disabled:opacity-50"
            >
              <Printer size={19} />
              {saving ? 'Saving...' : 'Print Bill'}
            </button>

            <button
              onClick={sendWhatsApp}
              disabled={saving}
              className="bg-[#19B879] text-white rounded-lg flex flex-col items-center justify-center gap-1.5 min-h-[58px] text-[11px] font-bold shadow-[0_4px_14px_rgba(25,184,121,0.25)] hover:bg-[#119E67] transition-all disabled:opacity-50"
            >
              <WhatsAppIcon size={19} />
              {saving ? 'Saving...' : 'WhatsApp Bill'}
            </button>
          </div>
        </div>

        {/* ================= AVAILABLE MEDICINES (RIGHT) ================= */}

        <div className={`${cardCls} min-w-0`}>
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div>
              <h2 className="text-[17px] font-bold text-[#071A36]">Available Medicines</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">Select medicine to add to current bill</p>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#EAF6FF] text-[#1689E8] text-[10px] font-bold">
              {products.length} Products
            </span>
          </div>

          {/* Small search inside the list */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A97A6] pointer-events-none" />
            <input
              type="text"
              value={listSearch}
              onChange={(e) => setListSearch(e.target.value)}
              placeholder="Search in this list..."
              className="w-full h-8 rounded-md border border-[#D7E2ED] bg-[#FAFCFE] pl-8 pr-8 text-[12px] outline-none placeholder:text-[#8A97A6] focus:border-[#1689E8] focus:bg-white"
            />
            {listSearch && (
              <button
                type="button"
                onClick={() => setListSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
            <table className="w-full min-w-[460px]">
              <thead className="sticky top-0">
                <tr className="bg-[#F3F8FD] text-left">
                  <th className="px-3 py-2.5 text-[12px] font-bold text-[#526274] rounded-l-lg">#</th>
                  <th className="px-3 py-2.5 text-[12px] font-bold text-[#526274]">Name</th>
                  <th className="px-3 py-2.5 text-[12px] font-bold text-[#526274]">Stock</th>
                  <th className="px-3 py-2.5 text-[12px] font-bold text-[#526274]">Price</th>
                  <th className="px-3 py-2.5 text-[12px] font-bold text-[#526274] text-center rounded-r-lg">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product, index) => (
                  <tr key={product.id} className="border-b border-[#EEF2F6] hover:bg-[#F8FBFE] transition-colors">
                    <td className="px-3 py-2.5 text-xs text-slate-500">{index + 1}</td>

                    <td className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-[#17212B]">{product.name}</p>
                    </td>

                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-bold ${product.stock <= 20 ? 'text-[#EF4148]' : 'text-[#19A86B]'}`}>
                        {product.stock}
                      </span>
                    </td>

                    <td className="px-3 py-2.5 text-xs font-medium text-[#17212B]">
                      ₹{Number(product.salePrice).toFixed(2)}
                    </td>

                    <td className="px-3 py-2.5 text-center">
                      <button
                        onClick={() => addToCart(product)}
                        className="w-8 h-8 rounded-md bg-[#1689E8] text-white inline-flex items-center justify-center shadow-[0_3px_10px_rgba(22,137,232,0.25)] hover:bg-[#0877D1] transition-all"
                        title="Add medicine"
                      >
                        <Plus size={17} />
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-xs text-slate-400">
                      No medicines match "{listSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================= EMPTY CART ICON ================= */

function ShoppingCartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="19" cy="20" r="1" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
    </svg>
  )
}