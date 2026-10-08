

import { useEffect, useRef, useState } from 'react'

import {
  Search,
  Plus,
  Trash2,
  CalendarDays,
  Phone,
  MapPin,
  PackagePlus,
  History,
  Save,
  UserRound,
  FileText,
} from 'lucide-react'

import {
  getProducts,
  getSuppliers,
  addPurchase,
  getSupplierTransactions,
} from '../services/api'

function normalizeDate(value) {
  if (!value) return ''

  const text = String(value).trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text
  }

  const date = new Date(text)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const emptyNewMedicine = {
  name: '',
  brand: '',
  category: '',
  batchNo: '',
  expiry: '',
  qty: 1,
  rate: '',
  salePrice: '',
  mrp: '',
}

export default function Purchase() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [supplierTransactions, setSupplierTransactions] = useState([])

  const [supplierId, setSupplierId] = useState(null)
  const [supplierName, setSupplierName] = useState('')
  const [supplierPhone, setSupplierPhone] = useState('')
  const [supplierAddress, setSupplierAddress] = useState('')

  const [invoiceNo, setInvoiceNo] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  )

  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])

  const [showNewMedicine, setShowNewMedicine] = useState(false)
  const [newMedicine, setNewMedicine] = useState(emptyNewMedicine)

  const [saving, setSaving] = useState(false)
  const [supplierMatched, setSupplierMatched] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const searchRef = useRef(null)

  /* =========================================================
     LOAD DATA
  ========================================================= */

  useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    try {
      const [productRows, supplierRows] = await Promise.all([
        getProducts(),
        getSuppliers(),
      ])

      setProducts(Array.isArray(productRows) ? productRows : [])
      setSuppliers(Array.isArray(supplierRows) ? supplierRows : [])
    } catch (error) {
      console.error('Purchase page loading failed:', error)
    }
  }

  /* =========================================================
     SUPPLIER SEARCH
  ========================================================= */

  function handleSupplierNameChange(value) {
    setSupplierName(value)

    const typedName = value.trim().toLowerCase()

    if (!typedName) {
      setSupplierId(null)
      setSupplierPhone('')
      setSupplierAddress('')
      setSupplierMatched(false)
      setSupplierTransactions([])
      return
    }

    const supplier = suppliers.find(
      (item) =>
        String(item.name || '').trim().toLowerCase() === typedName
    )

    if (supplier) {
      setSupplierId(supplier.id)
      setSupplierPhone(supplier.contact || '')
      setSupplierAddress(supplier.address || '')
      setSupplierMatched(true)

      loadSupplierTransactions(supplier.id)
    } else {
      setSupplierId(null)
      setSupplierPhone('')
      setSupplierAddress('')
      setSupplierMatched(false)
      setSupplierTransactions([])
    }
  }

  async function loadSupplierTransactions(id) {
    try {
      const rows = await getSupplierTransactions(id)

      setSupplierTransactions(
        Array.isArray(rows) ? rows : []
      )
    } catch (error) {
      console.error(
        'Supplier transaction loading failed:',
        error
      )

      setSupplierTransactions([])
    }
  }

  /* =========================================================
     MEDICINE SEARCH
  ========================================================= */

  const searchResults = search
    ? products
        .filter((product) =>
          [
            product.name,
            product.brand,
            product.code,
            product.barcode,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(search.toLowerCase())
        )
        .slice(0, 8)
    : []

  /* =========================================================
     ADD EXISTING MEDICINE
  ========================================================= */

  function addExistingMedicine(product) {
    const alreadyAdded = items.some(
      (item) => item.productId === product.id
    )

    if (alreadyAdded) {
      alert('This medicine is already added to the purchase.')
      return
    }

    setItems((previous) => [
      ...previous,
      {
        productId: product.id,
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        batchNo: product.batchNo || '',
        expiry: normalizeDate(product.expiry),
        qty: 1,
        rate: Number(product.purchasePrice || 0),
        salePrice: Number(product.salePrice || 0),
        mrp: Number(product.mrp || 0),
        isNew: false,
      },
    ])

    setSearch('')
  }

  /* =========================================================
     NEW MEDICINE FORM
  ========================================================= */

  function updateNewMedicine(field, value) {
    setNewMedicine((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function addNewMedicineToPurchase() {
    const name = newMedicine.name.trim()
    const qty = Number(newMedicine.qty)
    const rate = Number(newMedicine.rate)

    if (!name) {
      alert('Enter medicine name.')
      return
    }

    if (!qty || qty < 1) {
      alert('Enter a valid quantity.')
      return
    }

    if (!newMedicine.expiry) {
      alert('Enter expiry date.')
      return
    }

    if (!rate || rate < 0) {
      alert('Enter purchase rate.')
      return
    }

    setItems((previous) => [
      ...previous,
      {
        productId: null,
        name,
        brand: newMedicine.brand.trim(),
        category: newMedicine.category.trim(),
        batchNo: newMedicine.batchNo.trim(),
        expiry: normalizeDate(newMedicine.expiry),
        qty,
        rate,
        salePrice: Number(newMedicine.salePrice || 0),
        mrp: Number(newMedicine.mrp || 0),
        isNew: true,
      },
    ])

    setNewMedicine(emptyNewMedicine)
    setShowNewMedicine(false)
  }

  /* =========================================================
     ITEM UPDATE
  ========================================================= */

  function updateItem(index, field, value) {
    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    )
  }

  function removeItem(index) {
    setItems((previous) =>
      previous.filter((_, itemIndex) => itemIndex !== index)
    )
  }

  /* =========================================================
     TOTALS
  ========================================================= */

  const totalQty = items.reduce(
    (sum, item) => sum + Number(item.qty || 0),
    0
  )

  const totalAmount = items.reduce(
    (sum, item) =>
      sum +
      Number(item.qty || 0) *
        Number(item.rate || 0),
    0
  )

  /* =========================================================
     RESET
  ========================================================= */

  function resetForm() {
    setSupplierId(null)
    setSupplierName('')
    setSupplierPhone('')
    setSupplierAddress('')
    setSupplierMatched(false)

    setInvoiceNo('')
    setInvoiceDate(
      new Date().toISOString().slice(0, 10)
    )

    setSearch('')
    setItems([])

    setShowNewMedicine(false)
    setNewMedicine(emptyNewMedicine)
    setSupplierTransactions([])
    setValidationErrors({})
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  function validatePurchase() {
    const nextErrors = {}

    if (!supplierName.trim()) {
      nextErrors.supplierName = 'Supplier name is required.'
    }

    if (!supplierPhone.trim()) {
      nextErrors.supplierPhone = 'Supplier phone number is required.'
    } else if (supplierPhone.replace(/\D/g, '').length < 10) {
      nextErrors.supplierPhone = 'Enter a valid 10-digit phone number.'
    }

    if (!supplierAddress.trim()) {
      nextErrors.supplierAddress = 'Supplier address is required.'
    }

    if (!invoiceDate) {
      nextErrors.invoiceDate = 'Purchase date is required.'
    }

    if (!items.length) {
      nextErrors.items = 'Add at least one medicine to the purchase.'
    }

    items.forEach((item, index) => {
      if (!item.name?.trim()) {
        nextErrors[`item_${index}_name`] = 'Medicine name is required.'
      }

      if (!item.expiry) {
        nextErrors[`item_${index}_expiry`] = 'Expiry date is required.'
      }

      if (!Number(item.qty) || Number(item.qty) < 1) {
        nextErrors[`item_${index}_qty`] = 'Quantity must be at least 1.'
      }

      if (item.rate === '' || Number(item.rate) < 0) {
        nextErrors[`item_${index}_rate`] = 'Purchase rate is required.'
      }
    })

    setValidationErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  /* =========================================================
     SAVE PURCHASE
  ========================================================= */

  async function handleSave() {
    if (!validatePurchase()) {
      return
    }
    setSaving(true)

    try {
      const response = await addPurchase({
        supplierId,

        supplierName: supplierName.trim(),
        supplierPhone: supplierPhone.trim(),
        supplierAddress: supplierAddress.trim(),

        // Backend generates the final unique invoice number.
        invoiceDate: normalizeDate(invoiceDate),

        items: items.map((item) => ({
          productId: item.productId,

          name: item.name,
          brand: item.brand || '',
          category: item.category || '',

          batchNo: item.batchNo || '',
          expiry: normalizeDate(item.expiry),

          qty: Math.max(
            1,
            Math.trunc(Number(item.qty || 0))
          ),

          rate: Number(item.rate || 0),
          salePrice: Number(item.salePrice || 0),
          mrp: Number(item.mrp || 0),

          amount:
            Number(item.qty || 0) *
            Number(item.rate || 0),
        })),

        totalAmount,
      })

      const generatedInvoice =
        response?.invoiceNo ||
        response?.invoiceNumber ||
        response?.data?.invoiceNo ||
        ''

      setInvoiceNo(generatedInvoice)

      alert(
        generatedInvoice
          ? `Purchase saved successfully.\nInvoice: ${generatedInvoice}`
          : 'Purchase saved and stock updated.'
      )

      await loadInitialData()

      if (supplierId) {
        await loadSupplierTransactions(supplierId)
      } else {
        const freshSuppliers = await getSuppliers()

        const savedSupplier = freshSuppliers.find(
          (supplier) =>
            String(supplier.name || '')
              .trim()
              .toLowerCase() ===
            supplierName.trim().toLowerCase()
        )

        if (savedSupplier) {
          setSupplierId(savedSupplier.id)
          await loadSupplierTransactions(
            savedSupplier.id
          )
        }

        setSuppliers(freshSuppliers)
      }

      setItems([])
      setSearch('')
      setShowNewMedicine(false)
      setNewMedicine(emptyNewMedicine)

    } catch (error) {
      console.error(
        'Purchase save failed:',
        error
      )

      alert(
        error?.response?.data?.message ||
          'Failed to save purchase.'
      )
    } finally {
      setSaving(false)
    }
  }

  /* =========================================================
     INPUT STYLE
  ========================================================= */

  const inputClass = `
    w-full
    h-10
    rounded-lg
    border
    border-[#BFDFFF]
    bg-white
    px-3
    text-sm
    font-medium
    text-[#18365C]
    outline-none
    focus:border-[#1689E8]
    focus:ring-2
    focus:ring-[#1689E8]/10
  `

  return (
    <div className="relative min-h-full">
      <div className="space-y-3">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="px-1 sm:px-2 pt-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
                New Purchase
              </h2>

              <p className="text-xs text-[#7892AE] mt-1">
                Add supplier details, medicines and stock
              </p>
            </div>

            <div className="
              hidden
              sm:flex
              items-center
              gap-2
              px-3
              py-2
              rounded-lg
              bg-[#EFF8FF]
              border
              border-[#D7EBFF]
            ">
              <FileText
                size={16}
                className="text-[#1689E8]"
              />

              
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div className="
          grid
          grid-cols-1
          xl:grid-cols-[minmax(0,1fr)_300px]
          gap-3
        ">

          {/* ===================================================
              LEFT SECTION
          =================================================== */}

          <div className="
            bg-white
            rounded-xl
            border
            border-[#D7EBFF]
            shadow-[0_5px_20px_rgba(30,136,229,0.07)]
            p-3
            sm:p-4
            overflow-visible
          ">

            {/* =================================================
                SUPPLIER DETAILS
            ================================================= */}

            <div className="
              rounded-xl
              border
              border-[#D7EBFF]
              bg-[#F8FCFF]
              p-3
            ">

              <div className="
                flex
                items-center
                justify-between
                gap-2
                mb-3
              ">
                <div className="flex items-center gap-2">
                  <div className="
                    w-8
                    h-8
                    rounded-lg
                    bg-[#EAF6FF]
                    text-[#1689E8]
                    flex
                    items-center
                    justify-center
                  ">
                    <UserRound size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#18365C]">
                      Supplier Details
                    </p>

                    <p className="text-[10px] text-[#7892AE]">
                      Existing supplier details fill automatically
                    </p>
                  </div>
                </div>

                {supplierMatched && (
                  <span className="
                    px-2.5
                    py-1
                    rounded-full
                    bg-[#EAFBF3]
                    text-[#15966A]
                    text-[10px]
                    font-bold
                  ">
                    Existing Supplier
                  </span>
                )}

                {!supplierMatched &&
                  supplierName.trim() && (
                    <span className="
                      px-2.5
                      py-1
                      rounded-full
                      bg-[#FFF7E8]
                      text-[#D58A00]
                      text-[10px]
                      font-bold
                    ">
                      New Supplier
                    </span>
                  )}
              </div>

              <div className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-3
              ">

                {/* Supplier Name */}
                <div>
                  <label className="
                    block
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#45617F]
                    mb-1.5
                  ">
                    Supplier Name
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    required
                    list="supplier-list"
                    className={inputClass}
                    placeholder="Enter supplier name"
                    value={supplierName}
                    onChange={(event) =>
                      handleSupplierNameChange(
                        event.target.value
                      )
                    }
                  />

                  {validationErrors.supplierName && (
                    <p className="mt-1 text-[10px] font-semibold text-red-500">
                      {validationErrors.supplierName}
                    </p>
                  )}

                  <datalist id="supplier-list">
                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.name}
                      />
                    ))}
                  </datalist>
                </div>

                {/* Phone */}
                <div>
                  <label className="
                    block
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#45617F]
                    mb-1.5
                  ">
                    Supplier Phone
                    <span className="text-red-500"> *</span>
                  </label>

                  <div className="relative">
                    <Phone
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-[#1689E8]
                      "
                    />

                    <input
                      required
                      className={`${inputClass} pl-9`}
                      placeholder="Enter phone number"
                      value={supplierPhone}
                      onChange={(event) => {
                        setSupplierPhone(event.target.value)
                        setValidationErrors((previous) => ({
                          ...previous,
                          supplierPhone: '',
                        }))
                      }}
                    />
                  </div>
                  {validationErrors.supplierPhone && (
                    <p className="mt-1 text-[10px] font-semibold text-red-500">
                      {validationErrors.supplierPhone}
                    </p>
                  )}
                </div>

                {/* Invoice */}
                <div>
                  <label className="
                    block
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#45617F]
                    mb-1.5
                  ">
                    Invoice Number
                  </label>

                  <input
                    readOnly
                    className="
                      w-full
                      h-10
                      rounded-lg
                      border
                      border-[#BFDFFF]
                      bg-[#F5FAFF]
                      px-3
                      text-sm
                      font-bold
                      text-[#1689E8]
                      outline-none
                    "
                    value={
                      invoiceNo ||
                      'Generated automatically on save'
                    }
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="
                    block
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#45617F]
                    mb-1.5
                  ">
                    Supplier Address
                    <span className="text-red-500"> *</span>
                  </label>

                  <div className="relative">
                    <MapPin
                      size={15}
                      className="
                        absolute
                        left-3
                        top-3
                        text-[#1689E8]
                      "
                    />

                    <textarea
                      required
                      rows={2}
                      className="
                        w-full
                        rounded-lg
                        border
                        border-[#BFDFFF]
                        bg-white
                        pl-9
                        pr-3
                        py-2
                        text-sm
                        font-medium
                        text-[#18365C]
                        outline-none
                        resize-none
                        focus:border-[#1689E8]
                        focus:ring-2
                        focus:ring-[#1689E8]/10
                      "
                      placeholder="Enter supplier address"
                      value={supplierAddress}
                      onChange={(event) => {
                        setSupplierAddress(event.target.value)
                        setValidationErrors((previous) => ({
                          ...previous,
                          supplierAddress: '',
                        }))
                      }}
                    />
                  </div>
                  {validationErrors.supplierAddress && (
                    <p className="mt-1 text-[10px] font-semibold text-red-500">
                      {validationErrors.supplierAddress}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="
                    block
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-[#45617F]
                    mb-1.5
                  ">
                    Purchase Date
                  </label>

                  <div className="relative">
                    <input
                      required
                      type="date"
                      className={`${inputClass} pr-9`}
                      value={invoiceDate}
                      onChange={(event) =>
                        setInvoiceDate(
                          event.target.value
                        )
                      }
                    />

                    {validationErrors.invoiceDate && (
                      <p className="mt-1 text-[10px] font-semibold text-red-500">
                        {validationErrors.invoiceDate}
                      </p>
                    )}

                    <CalendarDays
                      size={16}
                      className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-[#1689E8]
                      "
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* =================================================
                MEDICINE SECTION
            ================================================= */}

            <div className="mt-4">

              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-2
                mb-2
              ">

                <div>
                  <p className="text-sm font-bold text-[#18365C]">
                    Purchase Medicines
                  </p>

                  <p className="text-[10px] text-[#7892AE]">
                    Search an existing medicine or add a new one
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowNewMedicine(
                      (value) => !value
                    )
                  }
                  className="
                    h-9
                    px-4
                    rounded-lg
                    bg-[#EFF8FF]
                    border
                    border-[#BFDFFF]
                    text-[#1689E8]
                    text-xs
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:bg-[#E5F4FF]
                  "
                >
                  <PackagePlus size={15} />
                  {showNewMedicine
                    ? 'Close New Medicine'
                    : 'Add New Medicine'}
                </button>

              </div>

              {/* Medicine Search */}
              <div className="
                flex
                flex-col
                sm:flex-row
                gap-2
              ">

                <div className="relative flex-1">

                  <Search
                    size={17}
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-[#173F70]
                    "
                  />

                  <input
                    ref={searchRef}
                    className="
                      w-full
                      h-10
                      rounded-full
                      border
                      border-[#B8DAFA]
                      bg-white
                      pl-10
                      pr-4
                      text-sm
                      font-medium
                      text-[#18365C]
                      placeholder:text-[#91A6BD]
                      outline-none
                      shadow-[0_3px_12px_rgba(22,137,232,0.08)]
                      focus:border-[#1689E8]
                      focus:ring-2
                      focus:ring-[#1689E8]/10
                    "
                    placeholder="Search medicine, brand or barcode..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />

                  {searchResults.length > 0 && (
                    <div className="
                      absolute
                      z-50
                      left-0
                      right-0
                      mt-1
                      overflow-hidden
                      rounded-lg
                      border
                      border-[#D6E9FA]
                      bg-white
                      shadow-xl
                    ">

                      {searchResults.map(
                        (product) => (
                          <button
                            type="button"
                            key={product.id}
                            onClick={() =>
                              addExistingMedicine(
                                product
                              )
                            }
                            className="
                              w-full
                              flex
                              items-center
                              justify-between
                              gap-3
                              px-3
                              py-2.5
                              text-left
                              hover:bg-[#EFF8FF]
                            "
                          >

                            <div>
                              <p className="
                                text-sm
                                font-semibold
                                text-[#18365C]
                              ">
                                {product.name}
                              </p>

                              <p className="
                                text-[10px]
                                text-[#7892AE]
                              ">
                                {product.brand || 'No brand'}
                                {' • '}
                                Stock: {product.stock}
                              </p>
                            </div>

                            <span className="
                              w-7
                              h-7
                              rounded-full
                              bg-[#E8F5FF]
                              text-[#1689E8]
                              flex
                              items-center
                              justify-center
                            ">
                              <Plus size={14} />
                            </span>

                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>

              {/* =================================================
                  NEW MEDICINE FORM
              ================================================= */}

              {showNewMedicine && (
                <div className="
                  mt-3
                  rounded-xl
                  border
                  border-[#BFDFFF]
                  bg-[#F8FCFF]
                  p-3
                ">

                  <div className="
                    flex
                    items-center
                    gap-2
                    mb-3
                  ">
                    <PackagePlus
                      size={17}
                      className="text-[#1689E8]"
                    />

                    <p className="
                      text-sm
                      font-bold
                      text-[#18365C]
                    ">
                      Add New Medicine
                    </p>
                  </div>

                  <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-4
                    gap-3
                  ">

                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">
                        Medicine Name <span className="text-red-500">*</span>
                      </label>
                    <input
                      required
                      className={inputClass}
                      placeholder="Enter medicine name"
                      value={newMedicine.name}
                      onChange={(event) =>
                        updateNewMedicine(
                          'name',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">Brand</label>
                    <input
                      className={inputClass}
                      placeholder="Enter brand"
                      value={newMedicine.brand}
                      onChange={(event) =>
                        updateNewMedicine(
                          'brand',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">Category</label>
                    <input
                      className={inputClass}
                      placeholder="Enter category"
                      value={newMedicine.category}
                      onChange={(event) =>
                        updateNewMedicine(
                          'category',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">Batch Number</label>
                    <input
                      className={inputClass}
                      placeholder="Enter batch number"
                      value={newMedicine.batchNo}
                      onChange={(event) =>
                        updateNewMedicine(
                          'batchNo',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                    <input
                      required
                      type="date"
                      className={inputClass}
                      value={newMedicine.expiry}
                      onChange={(event) =>
                        updateNewMedicine(
                          'expiry',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                    <input
                      required
                      type="number"
                      min="1"
                      className={inputClass}
                      placeholder="Enter quantity"
                      value={newMedicine.qty}
                      onChange={(event) =>
                        updateNewMedicine(
                          'qty',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">
                        Purchase Rate <span className="text-red-500">*</span>
                      </label>
                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      placeholder="Enter purchase rate"
                      value={newMedicine.rate}
                      onChange={(event) =>
                        updateNewMedicine(
                          'rate',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">Sale Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      placeholder="Enter sale price"
                      value={newMedicine.salePrice}
                      onChange={(event) =>
                        updateNewMedicine(
                          'salePrice',
                          event.target.value
                        )
                      }
                    />

                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#45617F] mb-1">MRP</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={inputClass}
                      placeholder="Enter MRP"
                      value={newMedicine.mrp}
                      onChange={(event) =>
                        updateNewMedicine(
                          'mrp',
                          event.target.value
                        )
                      }
                    />

                    </div>
                  </div>

                  <div className="
                    flex
                    justify-end
                    mt-3
                  ">
                    <button
                      type="button"
                      onClick={addNewMedicineToPurchase}
                      className="
                        h-9
                        px-5
                        rounded-lg
                        bg-gradient-to-r
                        from-[#1689E8]
                        to-[#1674E5]
                        text-white
                        text-xs
                        font-bold
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <Plus size={15} />
                      Add Medicine to Purchase
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                PURCHASE TABLE
            ================================================= */}

            <div className="
              mt-4
              rounded-lg
              border
              border-[#CBE5FA]
              overflow-hidden
              bg-white
            ">

              <div className="overflow-x-auto">

                <table className="
                  w-full
                  min-w-[900px]
                  text-xs
                  sm:text-sm
                ">

                  <thead>
                    <tr className="
                      bg-[#EFF8FF]
                      text-[#123B66]
                      border-b
                      border-[#D6E9FA]
                    ">

                      <th className="px-3 py-3 text-left font-bold">
                        Medicine
                      </th>

                      <th className="px-3 py-3 text-left font-bold">
                        Batch
                      </th>

                      <th className="px-3 py-3 text-left font-bold">
                        Expiry
                      </th>

                      <th className="px-3 py-3 text-left font-bold">
                        Qty
                      </th>

                      <th className="px-3 py-3 text-left font-bold">
                        Purchase Rate
                      </th>

                      <th className="px-3 py-3 text-right font-bold">
                        Amount
                      </th>

                      <th className="px-3 py-3 text-center">
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {items.map((item, index) => (
                      <tr
                        key={`${item.productId || 'new'}-${index}`}
                        className="
                          border-b
                          border-[#E5F1FB]
                          hover:bg-[#F8FCFF]
                        "
                      >

                        <td className="px-3 py-2.5">
                          <div className="min-w-[210px]">

                            <div className="
                              h-9
                              flex
                              items-center
                              rounded-md
                              border
                              border-[#C8E3FA]
                              px-2.5
                              font-semibold
                              text-[#18365C]
                            ">
                              {item.name}
                            </div>

                            {item.isNew && (
                              <span className="
                                inline-block
                                mt-1
                                text-[9px]
                                font-bold
                                text-[#1689E8]
                              ">
                                NEW MEDICINE
                              </span>
                            )}

                          </div>
                        </td>

                        <td className="px-3 py-2.5">
                          <input
                            className="
                              h-9
                              w-28
                              rounded-md
                              border
                              border-[#C8E3FA]
                              px-2
                              text-xs
                              font-medium
                              text-[#18365C]
                              outline-none
                              focus:border-[#1689E8]
                            "
                            value={item.batchNo || ''}
                            onChange={(event) =>
                              updateItem(
                                index,
                                'batchNo',
                                event.target.value
                              )
                            }
                          />
                        </td>

                        <td className="px-3 py-2.5">
                          <div>
                          <input
                            required
                            type="date"
                            className="
                              h-9
                              w-32
                              rounded-md
                              border
                              border-[#C8E3FA]
                              px-2
                              text-xs
                              font-medium
                              text-[#18365C]
                              outline-none
                              focus:border-[#1689E8]
                            "
                            value={item.expiry || ''}
                            onChange={(event) =>
                              updateItem(index, 'expiry', event.target.value)
                            }
                          />
                          {validationErrors[`item_${index}_expiry`] && (
                            <p className="mt-1 text-[9px] font-semibold text-red-500">
                              Required
                            </p>
                          )}
                          </div>
                        </td>

                        <td className="px-3 py-2.5">
                          <div>
                          <input
                            required
                            type="number"
                            min="1"
                            className="
                              h-9
                              w-20
                              rounded-md
                              border
                              border-[#C8E3FA]
                              px-2
                              text-xs
                              font-medium
                              text-[#18365C]
                              outline-none
                              focus:border-[#1689E8]
                            "
                            value={item.qty}
                            onChange={(event) =>
                              updateItem(index, 'qty', event.target.value)
                            }
                          />
                          {validationErrors[`item_${index}_qty`] && (
                            <p className="mt-1 text-[9px] font-semibold text-red-500">
                              Required
                            </p>
                          )}
                          </div>
                        </td>

                        <td className="px-3 py-2.5">
                          <div>
                          <input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            className="
                              h-9
                              w-24
                              rounded-md
                              border
                              border-[#C8E3FA]
                              px-2
                              text-xs
                              font-medium
                              text-[#18365C]
                              outline-none
                              focus:border-[#1689E8]
                            "
                            value={item.rate}
                            onChange={(event) =>
                              updateItem(index, 'rate', event.target.value)
                            }
                          />
                          {validationErrors[`item_${index}_rate`] && (
                            <p className="mt-1 text-[9px] font-semibold text-red-500">
                              Required
                            </p>
                          )}
                          </div>
                        </td>

                        <td className="
                          px-3
                          py-2.5
                          text-right
                        ">
                          <span className="
                            font-bold
                            text-[#123B66]
                          ">
                            ₹
                            {(
                              Number(item.qty || 0) *
                              Number(item.rate || 0)
                            ).toFixed(2)}
                          </span>
                        </td>

                        <td className="
                          px-3
                          py-2.5
                          text-center
                        ">
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(index)
                            }
                            className="
                              w-8
                              h-8
                              rounded-full
                              bg-[#FFF0F2]
                              text-[#EF4148]
                              flex
                              items-center
                              justify-center
                              mx-auto
                              hover:bg-[#EF4148]
                              hover:text-white
                            "
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>

                      </tr>
                    ))}

                    {items.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="
                            text-center
                            py-12
                            text-[#91A6BD]
                            font-medium
                          "
                        >
                          Search and add medicines to this purchase.
                          {validationErrors.items && (
                            <p className="mt-1 text-[10px] font-semibold text-red-500">
                              {validationErrors.items}
                            </p>
                          )}
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </div>

            {/* =================================================
                SAVE BUTTONS
            ================================================= */}

            <div className="
              flex
              flex-col-reverse
              sm:flex-row
              justify-end
              gap-2
              mt-4
            ">

              <button
                type="button"
                onClick={resetForm}
                className="
                  h-10
                  w-full
                  sm:w-[150px]
                  rounded-lg
                  border
                  border-[#EF4148]
                  bg-white
                  text-[#EF4148]
                  font-bold
                  text-sm
                  hover:bg-[#FFF2F3]
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="
                  h-10
                  w-full
                  sm:w-[190px]
                  rounded-lg
                  bg-gradient-to-r
                  from-[#1689E8]
                  to-[#1674E5]
                  text-white
                  font-bold
                  text-sm
                  shadow-[0_5px_15px_rgba(22,137,232,0.22)]
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:-translate-y-0.5
                  disabled:opacity-60
                "
              >
                <Save size={16} />
                {saving
                  ? 'Saving...'
                  : 'Save Purchase'}
              </button>

            </div>

            {/* =================================================
                PREVIOUS SUPPLIER TRANSACTIONS
            ================================================= */}

            {supplierName.trim() && (
              <div className="
                mt-5
                rounded-xl
                border
                border-[#D7EBFF]
                overflow-hidden
                bg-white
              ">

                <div className="
                  px-3
                  py-3
                  flex
                  items-center
                  justify-between
                  border-b
                  border-[#E5F1FB]
                  bg-[#F8FCFF]
                ">

                  <div className="flex items-center gap-2">

                    <div className="
                      w-8
                      h-8
                      rounded-lg
                      bg-[#EAF6FF]
                      text-[#1689E8]
                      flex
                      items-center
                      justify-center
                    ">
                      <History size={16} />
                    </div>

                    <div>
                      <p className="
                        text-sm
                        font-bold
                        text-[#18365C]
                      ">
                        Previous Supplier Transactions
                      </p>

                      <p className="
                        text-[10px]
                        text-[#7892AE]
                      ">
                        {supplierMatched
                          ? `Purchase history of ${supplierName}`
                          : 'No saved supplier selected'}
                      </p>
                    </div>

                  </div>

                  <span className="
                    px-2
                    py-1
                    rounded-full
                    bg-[#EAF6FF]
                    text-[#1689E8]
                    text-[10px]
                    font-bold
                  ">
                    {supplierTransactions.length}
                  </span>

                </div>

                {supplierTransactions.length > 0 ? (
                  <div className="overflow-x-auto">

                    <table className="
                      w-full
                      min-w-[650px]
                      text-xs
                    ">

                      <thead>
                        <tr className="
                          bg-white
                          border-b
                          border-[#E5F1FB]
                          text-[#56708F]
                        ">

                          <th className="px-3 py-2.5 text-left">
                            Invoice
                          </th>

                          <th className="px-3 py-2.5 text-left">
                            Date
                          </th>

                          <th className="px-3 py-2.5 text-left">
                            Items
                          </th>

                          <th className="px-3 py-2.5 text-left">
                            Quantity
                          </th>

                          <th className="px-3 py-2.5 text-right">
                            Amount
                          </th>

                        </tr>
                      </thead>

                      <tbody>

                        {supplierTransactions.map(
                          (transaction) => (
                            <tr
                              key={transaction.id}
                              className="
                                border-b
                                border-[#EEF5FB]
                                last:border-0
                                hover:bg-[#F8FCFF]
                              "
                            >

                              <td className="
                                px-3
                                py-2.5
                                font-bold
                                text-[#18365C]
                              ">
                                {transaction.invoiceNo}
                              </td>

                              <td className="
                                px-3
                                py-2.5
                                text-[#6B86A5]
                              ">
                                {transaction.date}
                              </td>

                              <td className="
                                px-3
                                py-2.5
                                text-[#6B86A5]
                              ">
                                {transaction.itemCount ??
                                  transaction.itemsCount ??
                                  transaction.items?.length ??
                                  transaction.item_quantity_count ??
                                  '-'}
                              </td>

                              <td className="
                                px-3
                                py-2.5
                                font-semibold
                                text-[#18365C]
                              ">
                                {transaction.itemQuantity || 0}
                              </td>

                              <td className="
                                px-3
                                py-2.5
                                text-right
                                font-bold
                                text-[#123B66]
                              ">
                                ₹
                                {Number(
                                  transaction.totalAmount || 0
                                ).toFixed(2)}
                              </td>

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                ) : (
                  <div className="
                    px-4
                    py-6
                    text-center
                    text-xs
                    text-[#91A6BD]
                  ">
                    {supplierMatched
                      ? 'No previous transaction found for this supplier.'
                      : 'Enter/select an existing supplier to see previous transactions.'}
                  </div>
                )}

              </div>
            )}

          </div>

          {/* ===================================================
              RIGHT SUMMARY
          =================================================== */}

          <div className="
            bg-white
            rounded-xl
            border
            border-[#D7EBFF]
            shadow-[0_5px_20px_rgba(30,136,229,0.07)]
            p-3
            h-fit
          ">

            <div className="
              rounded-xl
              border
              border-[#CDE8FB]
              bg-[#F8FCFF]
              p-3
            ">

              <p className="
                text-sm
                font-bold
                text-[#18365C]
                mb-3
              ">
                Purchase Summary
              </p>

              {/* Items */}
              <div className="
                flex
                items-center
                justify-between
                py-3
                border-b
                border-[#E1F0FB]
              ">

                <div className="flex items-center gap-2.5">

                  <div className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#7567F5]
                    text-white
                    flex
                    items-center
                    justify-center
                  ">
                    <PackagePlus size={17} />
                  </div>

                  <span className="
                    text-xs
                    font-semibold
                    text-[#56708F]
                  ">
                    Total Items
                  </span>

                </div>

                <span className="
                  text-lg
                  font-bold
                  text-[#123B66]
                ">
                  {items.length}
                </span>

              </div>

              {/* Quantity */}
              <div className="
                flex
                items-center
                justify-between
                py-3
                border-b
                border-[#E1F0FB]
              ">

                <div className="flex items-center gap-2.5">

                  <div className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#31C58A]
                    text-white
                    flex
                    items-center
                    justify-center
                  ">
                    #
                  </div>

                  <span className="
                    text-xs
                    font-semibold
                    text-[#56708F]
                  ">
                    Total Quantity
                  </span>

                </div>

                <span className="
                  text-lg
                  font-bold
                  text-[#123B66]
                ">
                  {totalQty}
                </span>

              </div>

              {/* Amount */}
              <div className="
                flex
                items-center
                justify-between
                py-3
              ">

                <div className="flex items-center gap-2.5">

                  <div className="
                    w-9
                    h-9
                    rounded-lg
                    bg-[#3B8BEA]
                    text-white
                    flex
                    items-center
                    justify-center
                    text-lg
                    font-bold
                  ">
                    ₹
                  </div>

                  <span className="
                    text-xs
                    font-semibold
                    text-[#56708F]
                  ">
                    Total Amount
                  </span>

                </div>

                <span className="
                  text-base
                  font-bold
                  text-[#123B66]
                ">
                  ₹ {totalAmount.toFixed(2)}
                </span>

              </div>

            </div>

            {/* Supplier Status */}
            <div className="
              mt-3
              rounded-xl
              border
              border-[#D7EBFF]
              p-3
              bg-white
            ">

              <p className="
                text-xs
                font-bold
                text-[#18365C]
                mb-2
              ">
                Supplier Status
              </p>

              <div className="
                flex
                items-center
                gap-2
              ">

                <div className={`
                  w-2.5
                  h-2.5
                  rounded-full
                  ${
                    supplierMatched
                      ? 'bg-[#22B77A]'
                      : supplierName.trim()
                        ? 'bg-[#F0A000]'
                        : 'bg-[#B6C4D3]'
                  }
                `} />

                <span className="
                  text-xs
                  text-[#56708F]
                ">
                  {supplierMatched
                    ? 'Supplier found in database'
                    : supplierName.trim()
                      ? 'New supplier — will be saved'
                      : 'Enter supplier name'}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}