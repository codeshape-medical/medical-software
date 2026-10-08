

// import { useEffect, useState } from 'react'

// import {
//   Plus,
//   Search,
//   Filter,
//   Pencil,
//   Trash2,
//   X,
//   Package,
//   IndianRupee,
//   AlertTriangle,
//   CalendarClock,
//   Link,
//   Tag,
//   Building2,
//   Barcode,
//   CalendarDays,
// } from 'lucide-react'

// import {
//   getProducts,
//   addProduct,
//   updateProduct,
//   deleteProduct,
// } from '../services/api'

// import { CATEGORIES } from '../data/dummyData'

// const emptyForm = {
//   name: '',
//   brand: '',
//   category: CATEGORIES[0],
//   hsn: '',
//   purchasePrice: '',
//   salePrice: '',
//   mrp: '',
//   stock: '',
//   expiry: '',
//   barcode: '',
// }

// /* ================= SUMMARY BOX ================= */

// function SummaryBox({ icon: Icon, label, value, tone, change }) {
//   const tones = {
//     purple: {
//       box: `
//         bg-purple-50
//         border-purple-300
//         hover:border-purple-400
//         hover:shadow-[0_0_22px_rgba(123,47,226,0.28)]
//       `,
//       icon: 'bg-[#7B2FE2]',
//       value: 'text-[#17212B]',
//       change: 'text-[#7B2FE2]',
//     },

//     green: {
//       box: `
//         bg-emerald-50
//         border-emerald-300
//         hover:border-emerald-400
//         hover:shadow-[0_0_22px_rgba(25,184,121,0.28)]
//       `,
//       icon: 'bg-[#19B879]',
//       value: 'text-[#17212B]',
//       change: 'text-emerald-600',
//     },

//     orange: {
//       box: `
//         bg-orange-50
//         border-orange-300
//         hover:border-orange-400
//         hover:shadow-[0_0_22px_rgba(242,163,21,0.28)]
//       `,
//       icon: 'bg-[#F2A315]',
//       value: 'text-[#17212B]',
//       change: 'text-orange-600',
//     },

//     red: {
//       box: `
//         bg-red-50
//         border-red-300
//         hover:border-red-400
//         hover:shadow-[0_0_22px_rgba(239,65,72,0.28)]
//       `,
//       icon: 'bg-[#EF4148]',
//       value: 'text-[#17212B]',
//       change: 'text-red-600',
//     },
//   }

//   const style = tones[tone]

//   return (
//     <div
//       className={`
//         rounded-xl
//         px-4
//         py-3.5
//         min-h-[90px]
//         flex
//         items-center
//         justify-between
//         border
//         transition-all
//         duration-300
//         ${style.box}
//       `}
//     >
//       <div className="flex items-center gap-3 min-w-0">
//         <div
//           className={`
//             w-10
//             h-10
//             rounded-xl
//             flex
//             items-center
//             justify-center
//             shrink-0
//             text-white
//             shadow-[0_0_12px_currentColor]
//             ${style.icon}
//           `}
//         >
//           <Icon size={20} strokeWidth={2.2} />
//         </div>

//         <div className="min-w-0">
//           <p className="text-[11px] md:text-xs font-medium text-[#56616F] mb-0.5 truncate">
//             {label}
//           </p>

//           <p
//             className={`
//               text-base
//               md:text-lg
//               font-bold
//               ${style.value}
//               truncate
//             `}
//           >
//             {value}
//           </p>
//         </div>
//       </div>

//       {change && (
//         <span
//           className={`
//             hidden
//             sm:block
//             ml-2
//             text-[10px]
//             font-bold
//             whitespace-nowrap
//             ${style.change}
//           `}
//         >
//           {change}
//         </span>
//       )}
//     </div>
//   )
// }

// export default function Products() {
//   const [products, setProducts] = useState([])
//   const [search, setSearch] = useState('')
//   const [page, setPage] = useState(1)

//   // list | form
//   const [view, setView] = useState('list')
//   const [editingId, setEditingId] = useState(null)
//   const [form, setForm] = useState(emptyForm)

//   const perPage = 8

//   useEffect(() => {
//     loadProducts()
//   }, [])

//   function loadProducts() {
//     getProducts().then(setProducts)
//   }

//   const filtered = products.filter((p) =>
//     [p.name, p.brand, p.code]
//       .join(' ')
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   )

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filtered.length / perPage)
//   )

//   const paged = filtered.slice(
//     (page - 1) * perPage,
//     page * perPage
//   )

//   function openAddForm() {
//     setForm(emptyForm)
//     setEditingId(null)
//     setView('form')
//   }

//   function openEditForm(product) {
//     setForm({
//       name: product.name,
//       brand: product.brand,
//       category: product.category,
//       hsn: product.hsn,
//       purchasePrice: product.purchasePrice,
//       salePrice: product.salePrice,
//       mrp: product.mrp,
//       stock: product.stock,
//       expiry: product.expiry,
//       barcode: product.barcode || '',
//     })

//     setEditingId(product.id)
//     setView('form')
//   }

//   function closeForm() {
//     setView('list')
//     setEditingId(null)
//     setForm(emptyForm)
//   }

//   async function handleDelete(id) {
//     if (!confirm('Delete this medicine? This cannot be undone.')) {
//       return
//     }

//     await deleteProduct(id)
//     loadProducts()
//   }

//   async function handleSubmit(e) {
//     e.preventDefault()

//     const payload = {
//       ...form,
//       purchasePrice: Number(form.purchasePrice),
//       salePrice: Number(form.salePrice),
//       mrp: Number(form.mrp),
//       stock: Number(form.stock),
//     }

//     if (editingId) {
//       await updateProduct(editingId, payload)
//     } else {
//       await addProduct(payload)
//     }

//     loadProducts()
//     closeForm()
//   }

//   /* ================= SUMMARY DATA ================= */

//   const totalProducts = products.length

//   const totalStock = products.reduce(
//     (sum, product) =>
//       sum + Number(product.stock || 0),
//     0
//   )

//   const totalStockValue = products.reduce(
//     (sum, product) =>
//       sum +
//       Number(product.purchasePrice || 0) *
//         Number(product.stock || 0),
//     0
//   )

//   const lowStock = products.filter(
//     (product) =>
//       Number(product.stock || 0) <= 20
//   ).length

//   const expiringSoon = products.filter((product) => {
//     if (!product.expiry) return false

//     const expiryDate = new Date(product.expiry)
//     const today = new Date()

//     const difference =
//       (expiryDate - today) /
//       (1000 * 60 * 60 * 24)

//     return difference >= 0 && difference <= 90
//   }).length

//   return (
//     <div className="relative min-h-full">

//       {/* ================= MAIN DASHBOARD ================= */}

//       <div className="space-y-5">

//         {/* ================= HEADER ================= */}

//         <div className="flex items-center justify-between gap-3 flex-wrap">

//           <div>
//             <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
//               Products / Medicines
//             </h2>

//             <p className="text-sm text-slate-500 mt-1">
//               Manage medicines, stock and product details
//             </p>
//           </div>

//           <button
//             onClick={openAddForm}
//             className="
//               bg-blue-600
//               hover:bg-blue-700
//               text-white
//               px-5
//               py-2.5
//               rounded-lg
//               font-semibold
//               text-sm
//               flex
//               items-center
//               gap-2
//               shadow-lg
//               shadow-blue-500/20
//               transition-all
//             "
//           >
//             <Plus size={17} />
//             Add Product
//           </button>

//         </div>

//         {/* ================= SUMMARY BOXES ================= */}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

//           <SummaryBox
//             icon={Package}
//             label="Total Products"
//             value={totalProducts.toLocaleString('en-IN')}
//             tone="purple"
//             change="↑ 12%"
//           />

//           <SummaryBox
//             icon={IndianRupee}
//             label="Total Stock Value"
//             value={`₹ ${totalStockValue.toLocaleString('en-IN')}`}
//             tone="green"
//             change="↑ 8%"
//           />

//           <SummaryBox
//             icon={AlertTriangle}
//             label="Low Stock Items"
//             value={`${lowStock} Items`}
//             tone="orange"
//             change="↑ 5%"
//           />

//           <SummaryBox
//             icon={CalendarClock}
//             label="Expiring Soon"
//             value={`${expiringSoon} Items`}
//             tone="red"
//             change="↓ 2%"
//           />

//         </div>

//         {/* ================= PRODUCTS TABLE ================= */}

//         <div
//           className="
//             bg-white
//             rounded-xl
//             shadow-sm
//             border
//             border-blue-100
//             overflow-hidden
//           "
//         >

//           {/* ================= SEARCH ================= */}

//           <div className="p-4 border-b border-blue-50">

//             <div className="flex items-center gap-3 flex-wrap">

//               {/* Search Bar */}

//               <div
//                 className="
//                   relative
//                   w-full
//                   sm:w-[360px]
//                   md:w-[400px]
//                   transition-all
//                   duration-300
//                   group
//                 "
//               >

//                 <Search
//                   size={17}
//                   className="
//                     absolute
//                     left-4
//                     top-1/2
//                     -translate-y-1/2
//                     text-blue-500
//                     transition-all
//                     duration-300
//                     group-hover:text-blue-600
//                   "
//                 />

//                 <input
//                   className="
//                     w-full
//                     h-10
//                     pl-10
//                     pr-4
//                     rounded-full
//                     border
//                     border-blue-200
//                     bg-blue-50/30
//                     text-sm
//                     text-slate-800
//                     placeholder:text-slate-400
//                     outline-none
//                     transition-all
//                     duration-300

//                     hover:border-blue-300
//                     hover:bg-blue-50/50
//                     hover:shadow-[0_0_16px_rgba(37,99,235,0.16)]

//                     focus:border-blue-400
//                     focus:bg-white
//                     focus:ring-2
//                     focus:ring-blue-100
//                     focus:shadow-[0_0_18px_rgba(37,99,235,0.20)]
//                   "
//                   placeholder="Search medicine, brand or code..."
//                   value={search}
//                   onChange={(e) => {
//                     setSearch(e.target.value)
//                     setPage(1)
//                   }}
//                 />

//               </div>

//               {/* Filter Button */}

//               <button
//                 className="
//                   h-10
//                   px-5
//                   rounded-full
//                   border
//                   border-blue-200
//                   bg-white
//                   text-blue-700
//                   font-medium
//                   text-sm
//                   flex
//                   items-center
//                   justify-center
//                   gap-2
//                   hover:bg-blue-50
//                   hover:border-blue-300
//                   hover:shadow-[0_0_16px_rgba(37,99,235,0.18)]
//                   transition-all
//                   duration-300
//                   shrink-0
//                 "
//               >
//                 <Filter size={16} />

//                 <span>
//                   Filter
//                 </span>
//               </button>

//             </div>

//           </div>

//           {/* ================= TABLE ================= */}

//           <div className="overflow-x-auto">

//             <table className="w-full text-sm">

//               <thead>
//                 <tr className="bg-blue-50/70 text-navy-900">

//                   <th className="px-4 py-3 text-left font-semibold">
//                     #
//                   </th>

                  

//                   <th className="px-4 py-3 text-left font-semibold">
//                     Name
//                   </th>

//                   <th className="px-4 py-3 text-left font-semibold">
//                     Brand
//                   </th>

//                   <th className="px-4 py-3 text-left font-semibold">
//                     Category
//                   </th>

//                   <th className="px-4 py-3 text-left font-semibold">
//                     Stock
//                   </th>

//                   <th className="px-4 py-3 text-left font-semibold">
//                     MRP
//                   </th>

//                   <th className="px-4 py-3 text-left font-semibold">
//                     Action
//                   </th>

//                 </tr>
//               </thead>

//               <tbody>

//                 {paged.map((p, i) => (
//                   <tr
//                     key={p.id}
//                     className="
//                       border-b
//                       border-blue-50
//                       hover:bg-blue-50/40
//                       transition
//                     "
//                   >

//                     <td className="px-4 py-3 text-slate-600">
//                       {(page - 1) * perPage + i + 1}
//                     </td>

                   

//                     <td className="px-4 py-3 font-medium text-navy-900">
//                       {p.name}
//                     </td>

//                     <td className="px-4 py-3 text-slate-600">
//                       {p.brand}
//                     </td>

//                     <td className="px-4 py-3 text-slate-600">
//                       {p.category}
//                     </td>

//                     <td className="px-4 py-3">

//                       <span
//                         className={
//                           Number(p.stock) <= 20
//                             ? 'text-red-500 font-bold'
//                             : 'text-emerald-600 font-bold'
//                         }
//                       >
//                         {p.stock}
//                       </span>

//                     </td>

//                     <td className="px-4 py-3 font-medium text-navy-900">
//                       ₹{Number(p.mrp).toFixed(2)}
//                     </td>

//                     <td className="px-4 py-3">

//                       <div className="flex items-center gap-2">

//                         <button
//                           onClick={() => openEditForm(p)}
//                           className="
//                             w-8
//                             h-8
//                             rounded-full
//                             bg-blue-50
//                             text-blue-600
//                             flex
//                             items-center
//                             justify-center
//                             hover:bg-blue-600
//                             hover:text-white
//                             transition
//                           "
//                           title="Edit"
//                         >
//                           <Pencil size={14} />
//                         </button>

//                         <button
//                           onClick={() => handleDelete(p.id)}
//                           className="
//                             w-8
//                             h-8
//                             rounded-full
//                             bg-red-50
//                             text-red-500
//                             flex
//                             items-center
//                             justify-center
//                             hover:bg-red-500
//                             hover:text-white
//                             transition
//                           "
//                           title="Delete"
//                         >
//                           <Trash2 size={14} />
//                         </button>

//                       </div>

//                     </td>

//                   </tr>
//                 ))}

//                 {paged.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="text-center py-10 text-slate-500"
//                     >
//                       No products found.
//                     </td>
//                   </tr>
//                 )}

//               </tbody>

//             </table>

//           </div>

//           {/* ================= PAGINATION ================= */}

//           <div
//             className="
//               flex
//               items-center
//               justify-between
//               gap-3
//               px-4
//               py-4
//               text-sm
//               text-slate-500
//               border-t
//               border-blue-50
//               flex-wrap
//             "
//           >

//             <span>
//               Showing{' '}
//               {paged.length
//                 ? (page - 1) * perPage + 1
//                 : 0}{' '}
//               to{' '}
//               {Math.min(
//                 page * perPage,
//                 filtered.length
//               )}{' '}
//               of {filtered.length} products
//             </span>

//             <div className="flex items-center gap-1">

//               {Array.from(
//                 { length: totalPages },
//                 (_, i) => i + 1
//               ).map((n) => (

//                 <button
//                   key={n}
//                   onClick={() => setPage(n)}
//                   className={`
//                     w-8
//                     h-8
//                     rounded-lg
//                     text-xs
//                     font-semibold
//                     transition

//                     ${
//                       page === n
//                         ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
//                         : 'text-slate-600 hover:bg-blue-50'
//                     }
//                   `}
//                 >
//                   {n}
//                 </button>

//               ))}

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* =========================================================
//           ADD / EDIT MEDICINE MODAL
//           ========================================================= */}

//       {view === 'form' && (

//         <div
//           className="
//             fixed
//             inset-0
//             z-[100]
//             flex
//             items-center
//             justify-center
//             p-4
//           "
//         >

//           {/* Background blur + overlay */}

//           <div
//             className="
//               absolute
//               inset-0
//               bg-navy-950/35
//               backdrop-blur-[5px]
//             "
//             onClick={closeForm}
//           />

//           {/* Form Modal */}

//           <div
//             className="
//               relative
//               w-full
//               max-w-[650px]
//               max-h-[92vh]
//               overflow-y-auto
//               rounded-2xl
//               bg-white
//               border-2
//               border-blue-500
//               shadow-[0_20px_70px_rgba(37,99,235,0.35)]
//               animate-[modalIn_.2s_ease-out]
//             "
//           >

//             {/* Blue Header */}

//             <div
//               className="
//                 relative
//                 overflow-hidden
//                 bg-gradient-to-r
//                 from-blue-700
//                 via-blue-600
//                 to-cyan-500
//                 px-5
//                 py-4
//                 text-white
//               "
//             >

//               {/* Decorative glow */}

//               <div
//                 className="
//                   absolute
//                   -right-12
//                   -top-16
//                   w-48
//                   h-48
//                   rounded-full
//                   bg-white/10
//                 "
//               />

//               <div
//                 className="
//                   absolute
//                   right-16
//                   -bottom-20
//                   w-40
//                   h-40
//                   rounded-full
//                   bg-white/10
//                 "
//               />

//               <div className="relative flex items-center justify-between">

//                 <div className="flex items-center gap-3">

//                   <div
//                     className="
//                       w-10
//                       h-10
//                       rounded-xl
//                       bg-white/15
//                       border
//                       border-white/25
//                       flex
//                       items-center
//                       justify-center
//                     "
//                   >
//                     <Package size={21} />
//                   </div>

//                   <div>

//                     <h3 className="text-lg font-bold">
//                       {editingId
//                         ? 'Edit Medicine'
//                         : 'Add New Medicine'}
//                     </h3>

//                     <p className="text-xs text-blue-100">
//                       {editingId
//                         ? 'Update the medicine details'
//                         : 'Fill in the details to add a new product'}
//                     </p>

//                   </div>

//                 </div>

//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="
//                     w-8
//                     h-8
//                     rounded-full
//                     bg-white/10
//                     hover:bg-white/20
//                     flex
//                     items-center
//                     justify-center
//                     transition
//                   "
//                 >
//                   <X size={18} />
//                 </button>

//               </div>

//             </div>

//             {/* Form */}

//             <form
//               onSubmit={handleSubmit}
//               className="p-5 md:p-6"
//             >

//               <div className="grid sm:grid-cols-2 gap-4">

//                 {/* Medicine Name */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Medicine Name{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <Link
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       required
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="Paracetamol 500mg"
//                       value={form.name}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           name: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* Category */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Category{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <Tag
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <select
//                       required
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       value={form.category}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           category: e.target.value,
//                         })
//                       }
//                     >

//                       {CATEGORIES.map((c) => (
//                         <option key={c} value={c}>
//                           {c}
//                         </option>
//                       ))}

//                     </select>

//                   </div>

//                 </div>

//                 {/* Brand */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Brand Name
//                   </label>

//                   <div className="relative">

//                     <Building2
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="Crocin"
//                       value={form.brand}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           brand: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* HSN */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     HSN Code
//                   </label>

//                   <div className="relative">

//                     <Barcode
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         text-slate-800
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="300490"
//                       value={form.hsn}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           hsn: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* Purchase Price */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Purchase Price{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <IndianRupee
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       required
//                       type="number"
//                       step="0.01"
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="10.00"
//                       value={form.purchasePrice}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           purchasePrice: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* Sale Price */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Sale Price{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <IndianRupee
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       required
//                       type="number"
//                       step="0.01"
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="12.00"
//                       value={form.salePrice}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           salePrice: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* MRP */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     MRP{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <IndianRupee
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       required
//                       type="number"
//                       step="0.01"
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="15.00"
//                       value={form.mrp}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           mrp: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* Stock */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Opening Stock{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <Package
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       required
//                       type="number"
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="250"
//                       value={form.stock}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           stock: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* Expiry */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Expiry Date{' '}
//                     <span className="text-red-500">*</span>
//                   </label>

//                   <div className="relative">

//                     <CalendarDays
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       required
//                       type="date"
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       value={form.expiry}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           expiry: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* Barcode */}

//                 <div>

//                   <label className="block text-xs font-semibold text-navy-900 mb-1.5">
//                     Barcode (Optional)
//                   </label>

//                   <div className="relative">

//                     <Barcode
//                       size={15}
//                       className="
//                         absolute
//                         left-3
//                         top-1/2
//                         -translate-y-1/2
//                         text-blue-500
//                       "
//                     />

//                     <input
//                       className="
//                         w-full
//                         h-10
//                         pl-9
//                         pr-3
//                         rounded-lg
//                         border
//                         border-blue-200
//                         bg-white
//                         text-sm
//                         outline-none
//                         focus:border-blue-500
//                         focus:ring-2
//                         focus:ring-blue-100
//                       "
//                       placeholder="1234567890"
//                       value={form.barcode}
//                       onChange={(e) =>
//                         setForm({
//                           ...form,
//                           barcode: e.target.value,
//                         })
//                       }
//                     />

//                   </div>

//                 </div>

//               </div>

//               {/* Buttons */}

//               <div
//                 className="
//                   flex
//                   gap-3
//                   pt-5
//                   mt-5
//                   border-t
//                   border-blue-100
//                 "
//               >

//                 <button
//                   type="button"
//                   onClick={closeForm}
//                   className="
//                     flex-1
//                     h-11
//                     rounded-lg
//                     border
//                     border-blue-200
//                     bg-white
//                     text-blue-700
//                     font-semibold
//                     text-sm
//                     hover:bg-blue-50
//                     transition
//                   "
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="
//                     flex-1
//                     h-11
//                     rounded-lg
//                     bg-blue-600
//                     hover:bg-blue-700
//                     text-white
//                     font-semibold
//                     text-sm
//                     shadow-lg
//                     shadow-blue-500/25
//                     transition
//                   "
//                 >
//                   {editingId
//                     ? 'Update Medicine'
//                     : 'Save Medicine'}
//                 </button>

//               </div>

//             </form>

//           </div>

//         </div>

//       )}

//       {/* Modal animation */}

//       <style>
//         {`
//           @keyframes modalIn {
//             from {
//               opacity: 0;
//               transform: translateY(12px) scale(0.97);
//             }

//             to {
//               opacity: 1;
//               transform: translateY(0) scale(1);
//             }
//           }
//         `}
//       </style>

//     </div>
//   )
// }


import { useEffect, useState } from 'react'

import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  X,
  Package,
  IndianRupee,
  AlertTriangle,
  CalendarClock,
  Link,
  Tag,
  Building2,
  Barcode,
  CalendarDays,
} from 'lucide-react'

import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../services/api'

import { CATEGORIES } from '../data/dummyData'

const emptyForm = {
  name: '',
  brand: '',
  category: CATEGORIES[0],
  hsn: '',
  purchasePrice: '',
  salePrice: '',
  mrp: '',
  stock: '',
  expiry: '',
  barcode: '',
}

/* ================= SUMMARY BOX ================= */

function SummaryBox({ icon: Icon, label, value, tone, change }) {
  const tones = {
    purple: {
      box: `
        bg-purple-50
        border-purple-300
        hover:border-purple-400
        hover:shadow-[0_0_22px_rgba(123,47,226,0.28)]
      `,
      icon: 'bg-[#7B2FE2]',
      value: 'text-[#17212B]',
      change: 'text-[#7B2FE2]',
    },

    green: {
      box: `
        bg-emerald-50
        border-emerald-300
        hover:border-emerald-400
        hover:shadow-[0_0_22px_rgba(25,184,121,0.28)]
      `,
      icon: 'bg-[#19B879]',
      value: 'text-[#17212B]',
      change: 'text-emerald-600',
    },

    orange: {
      box: `
        bg-orange-50
        border-orange-300
        hover:border-orange-400
        hover:shadow-[0_0_22px_rgba(242,163,21,0.28)]
      `,
      icon: 'bg-[#F2A315]',
      value: 'text-[#17212B]',
      change: 'text-orange-600',
    },

    red: {
      box: `
        bg-red-50
        border-red-300
        hover:border-red-400
        hover:shadow-[0_0_22px_rgba(239,65,72,0.28)]
      `,
      icon: 'bg-[#EF4148]',
      value: 'text-[#17212B]',
      change: 'text-red-600',
    },
  }

  const style = tones[tone]

  return (
    <div
      className={`
        rounded-xl
        px-4
        py-3.5
        min-h-[90px]
        flex
        items-center
        justify-between
        border
        transition-all
        duration-300
        ${style.box}
      `}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`
            w-10
            h-10
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            text-white
            shadow-[0_0_12px_currentColor]
            ${style.icon}
          `}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] md:text-xs font-medium text-[#56616F] mb-0.5 truncate">
            {label}
          </p>

          <p
            className={`
              text-base
              md:text-lg
              font-bold
              ${style.value}
              truncate
            `}
          >
            {value}
          </p>
        </div>
      </div>

      {change && (
        <span
          className={`
            hidden
            sm:block
            ml-2
            text-[10px]
            font-bold
            whitespace-nowrap
            ${style.change}
          `}
        >
          {change}
        </span>
      )}
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')
  const [expiryFilter, setExpiryFilter] = useState('All')

  // list | form
  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const perPage = 8

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const data = await getProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts([])
    }
  }

  function toDateInputValue(value) {
    if (!value) return ''

    const text = String(value).trim()

    // PostgreSQL DATE / ISO timestamp: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss...
    const isoMatch = text.match(/^(\\d{4})-(\\d{2})-(\\d{2})/)
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`
    }

    // DD-MM-YYYY
    const dmyMatch = text.match(/^(\\d{2})-(\\d{2})-(\\d{4})$/)
    if (dmyMatch) {
      return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`
    }

    // DD/MM/YYYY
    const slashMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (slashMatch) {
      return `${slashMatch[3]}-${slashMatch[2]}-${slashMatch[1]}`
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  function normalizeDateForDatabase(value) {
    return toDateInputValue(value) || null
  }

  function getExpiryStatus(value) {
    const dateText = toDateInputValue(value)
    if (!dateText) return 'none'

    const expiry = new Date(`${dateText}T23:59:59`)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (expiry < today) return 'expired'

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffDays <= 90) return 'soon'
    return 'valid'
  }

  const filtered = products.filter((p) => {
    const searchText = [p.name, p.brand, p.code, p.barcode, p.category]
      .join(' ')
      .toLowerCase()

    const matchesSearch = searchText.includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === 'All' || p.category === categoryFilter

    const stock = Number(p.stock || 0)

    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'In Stock' && stock > 20) ||
      (stockFilter === 'Low Stock' && stock > 0 && stock <= 20) ||
      (stockFilter === 'Out of Stock' && stock <= 0)

    const expiryStatus = getExpiryStatus(p.expiry)

    const matchesExpiry =
      expiryFilter === 'All' || expiryStatus === expiryFilter

    return matchesSearch && matchesCategory && matchesStock && matchesExpiry
  })

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / perPage)
  )

  const paged = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  )

  function openAddForm() {
    setForm(emptyForm)
    setEditingId(null)
    setView('form')
  }

  function openEditForm(product) {
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      hsn: product.hsn,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      mrp: product.mrp,
      stock: product.stock,
      expiry: toDateInputValue(product.expiry),
      barcode: product.barcode || '',
    })

    setEditingId(product.id)
    setView('form')
  }

  function closeForm() {
    setView('list')
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this medicine? This cannot be undone.')) {
      return
    }

    await deleteProduct(id)
    loadProducts()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const name = String(form.name || '').trim()
    const purchasePrice = Number(form.purchasePrice)
    const salePrice = Number(form.salePrice)
    const mrp = Number(form.mrp)
    const stock = Number(form.stock)
    const expiry = normalizeDateForDatabase(form.expiry)

    if (!name) {
      alert('Please enter medicine name.')
      return
    }

    if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
      alert('Please enter a valid purchase price.')
      return
    }

    if (!Number.isFinite(salePrice) || salePrice < 0) {
      alert('Please enter a valid sale price.')
      return
    }

    if (!Number.isFinite(mrp) || mrp < 0) {
      alert('Please enter a valid MRP.')
      return
    }

    if (!Number.isFinite(stock) || stock < 0) {
      alert('Please enter a valid stock quantity.')
      return
    }

    if (!expiry) {
      alert('Please select a valid expiry date.')
      return
    }

    if (salePrice > mrp) {
      alert('Sale price cannot be greater than MRP.')
      return
    }

    const payload = {
      ...form,
      name,
      purchasePrice,
      salePrice,
      mrp,
      stock,
      expiry,
      barcode: String(form.barcode || '').trim(),
      hsn: String(form.hsn || '').trim(),
      brand: String(form.brand || '').trim(),
    }

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await addProduct(payload)
      }

      await loadProducts()
      closeForm()
    } catch (error) {
      console.error('Product save failed:', error)
      alert(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Unable to save product. Please try again.'
      )
    }
  }

  /* ================= SUMMARY DATA ================= */

  const totalProducts = products.length

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  )

  const totalStockValue = products.reduce(
    (sum, product) =>
      sum +
      Number(product.purchasePrice || 0) *
        Number(product.stock || 0),
    0
  )

  const lowStock = products.filter(
    (product) =>
      Number(product.stock || 0) <= 20
  ).length

  const expiringSoon = products.filter((product) => {
    if (!product.expiry) return false

    const expiryDate = new Date(product.expiry)
    const today = new Date()

    const difference =
      (expiryDate - today) /
      (1000 * 60 * 60 * 24)

    return difference >= 0 && difference <= 90
  }).length

  return (
    <div className="relative min-h-full">

      {/* ================= MAIN DASHBOARD ================= */}

      <div className="space-y-5">

        {/* ================= HEADER ================= */}

        <div className="flex items-center justify-between gap-3 flex-wrap">

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
              Products / Medicines
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage medicines, stock and product details
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-5
              py-2.5
              rounded-lg
              font-semibold
              text-sm
              flex
              items-center
              gap-2
              shadow-lg
              shadow-blue-500/20
              transition-all
            "
          >
            <Plus size={17} />
            Add Product
          </button>

        </div>

        {/* ================= SUMMARY BOXES ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <SummaryBox
            icon={Package}
            label="Total Products"
            value={totalProducts.toLocaleString('en-IN')}
            tone="purple"
            change="↑ 12%"
          />

          <SummaryBox
            icon={IndianRupee}
            label="Total Stock Value"
            value={`₹ ${totalStockValue.toLocaleString('en-IN')}`}
            tone="green"
            change="↑ 8%"
          />

          <SummaryBox
            icon={AlertTriangle}
            label="Low Stock Items"
            value={`${lowStock} Items`}
            tone="orange"
            change="↑ 5%"
          />

          <SummaryBox
            icon={CalendarClock}
            label="Expiring Soon"
            value={`${expiringSoon} Items`}
            tone="red"
            change="↓ 2%"
          />

        </div>

        {/* ================= PRODUCTS TABLE ================= */}

        <div
          className="
            bg-white
            rounded-xl
            shadow-sm
            border
            border-blue-100
            overflow-hidden
          "
        >

          {/* ================= SEARCH ================= */}

          <div className="p-4 border-b border-blue-50">

            <div className="flex items-center gap-3 flex-wrap">

              {/* Search Bar */}

              <div
                className="
                  relative
                  w-full
                  sm:w-[360px]
                  md:w-[400px]
                  transition-all
                  duration-300
                  group
                "
              >

                <Search
                  size={17}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-blue-500
                    transition-all
                    duration-300
                    group-hover:text-blue-600
                  "
                />

                <input
                  className="
                    w-full
                    h-10
                    pl-10
                    pr-4
                    rounded-full
                    border
                    border-blue-200
                    bg-blue-50/30
                    text-sm
                    text-slate-800
                    placeholder:text-slate-400
                    outline-none
                    transition-all
                    duration-300

                    hover:border-blue-300
                    hover:bg-blue-50/50
                    hover:shadow-[0_0_16px_rgba(37,99,235,0.16)]

                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                    focus:shadow-[0_0_18px_rgba(37,99,235,0.20)]
                  "
                  placeholder="Search medicine, brand or code..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                />

              </div>

              {/* Filter Button */}

              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className={`
                  h-10
                  px-5
                  rounded-full
                  border
                  border-blue-200
                  bg-white
                  text-blue-700
                  font-medium
                  text-sm
                  flex
                  items-center
                  justify-center
                  gap-2
                  hover:bg-blue-50
                  hover:border-blue-300
                  hover:shadow-[0_0_16px_rgba(37,99,235,0.18)]
                  transition-all
                  duration-300
                  shrink-0
                  ${showFilters ? 'bg-blue-50 border-blue-400 shadow-[0_0_16px_rgba(37,99,235,0.18)]' : ''}
                `}
              >
                <Filter size={16} />

                <span>
                  Filter
                </span>
              </button>

            </div>

            {showFilters && (
              <div className="mt-3 p-3 rounded-xl border border-blue-100 bg-blue-50/40">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <div>
                    <label className="block text-[11px] font-semibold text-[#123B66] mb-1">
                      Category
                    </label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => {
                        setCategoryFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-blue-200 bg-white text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="All">All Categories</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#123B66] mb-1">
                      Stock
                    </label>
                    <select
                      value={stockFilter}
                      onChange={(e) => {
                        setStockFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-blue-200 bg-white text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="All">All Stock</option>
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#123B66] mb-1">
                      Expiry
                    </label>
                    <select
                      value={expiryFilter}
                      onChange={(e) => {
                        setExpiryFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-blue-200 bg-white text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="All">All Expiry</option>
                      <option value="valid">Valid</option>
                      <option value="soon">Expiring Soon</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('All')
                      setStockFilter('All')
                      setExpiryFilter('All')
                      setPage(1)
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ================= TABLE ================= */}

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-blue-50/70 text-navy-900">

                  <th className="px-4 py-3 text-left font-semibold">
                    #
                  </th>

                  

                  <th className="px-4 py-3 text-left font-semibold">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Brand
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Category
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Stock
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    MRP
                  </th>

                  <th className="px-4 py-3 text-left font-semibold">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {paged.map((p, i) => (
                  <tr
                    key={p.id}
                    className="
                      border-b
                      border-blue-50
                      hover:bg-blue-50/40
                      transition
                    "
                  >

                    <td className="px-4 py-3 text-slate-600">
                      {(page - 1) * perPage + i + 1}
                    </td>

                   

                    <td className="px-4 py-3 font-medium text-navy-900">
                      {p.name}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {p.brand}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {p.category}
                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={
                          Number(p.stock) <= 20
                            ? 'text-red-500 font-bold'
                            : 'text-emerald-600 font-bold'
                        }
                      >
                        {p.stock}
                      </span>

                    </td>

                    <td className="px-4 py-3 font-medium text-navy-900">
                      ₹{Number(p.mrp).toFixed(2)}
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex items-center gap-2">

                        <button
                          onClick={() => openEditForm(p)}
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-600
                            hover:text-white
                            transition
                          "
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="
                            w-8
                            h-8
                            rounded-full
                            bg-red-50
                            text-red-500
                            flex
                            items-center
                            justify-center
                            hover:bg-red-500
                            hover:text-white
                            transition
                          "
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

                {paged.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-slate-500"
                    >
                      No products found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

          {/* ================= PAGINATION ================= */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
              px-4
              py-4
              text-sm
              text-slate-500
              border-t
              border-blue-50
              flex-wrap
            "
          >

            <span>
              Showing{' '}
              {paged.length
                ? (page - 1) * perPage + 1
                : 0}{' '}
              to{' '}
              {Math.min(
                page * perPage,
                filtered.length
              )}{' '}
              of {filtered.length} products
            </span>

            <div className="flex items-center gap-1">

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((n) => (

                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`
                    w-8
                    h-8
                    rounded-lg
                    text-xs
                    font-semibold
                    transition

                    ${
                      page === n
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-600 hover:bg-blue-50'
                    }
                  `}
                >
                  {n}
                </button>

              ))}

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          ADD / EDIT MEDICINE MODAL
          ========================================================= */}

      {view === 'form' && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            p-4
          "
        >

          {/* Background blur + overlay */}

          <div
            className="
              absolute
              inset-0
              bg-navy-950/35
              backdrop-blur-[5px]
            "
            onClick={closeForm}
          />

          {/* Form Modal */}

          <div
            className="
              relative
              w-full
              max-w-[650px]
              max-h-[92vh]
              overflow-y-auto
              rounded-2xl
              bg-white
              border-2
              border-blue-500
              shadow-[0_20px_70px_rgba(37,99,235,0.35)]
              animate-[modalIn_.2s_ease-out]
            "
          >

            {/* Blue Header */}

            <div
              className="
                relative
                overflow-hidden
                bg-gradient-to-r
                from-blue-700
                via-blue-600
                to-cyan-500
                px-5
                py-4
                text-white
              "
            >

              {/* Decorative glow */}

              <div
                className="
                  absolute
                  -right-12
                  -top-16
                  w-48
                  h-48
                  rounded-full
                  bg-white/10
                "
              />

              <div
                className="
                  absolute
                  right-16
                  -bottom-20
                  w-40
                  h-40
                  rounded-full
                  bg-white/10
                "
              />

              <div className="relative flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-white/15
                      border
                      border-white/25
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Package size={21} />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold">
                      {editingId
                        ? 'Edit Medicine'
                        : 'Add New Medicine'}
                    </h3>

                    <p className="text-xs text-blue-100">
                      {editingId
                        ? 'Update the medicine details'
                        : 'Fill in the details to add a new product'}
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-white/10
                    hover:bg-white/20
                    flex
                    items-center
                    justify-center
                    transition
                  "
                >
                  <X size={18} />
                </button>

              </div>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-5 md:p-6"
            >

              <div className="grid sm:grid-cols-2 gap-4">

                {/* Medicine Name */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Medicine Name{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <Link
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      required
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        text-slate-800
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="Paracetamol 500mg"
                      value={form.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* Category */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Category{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <Tag
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <select
                      required
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        text-slate-800
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      value={form.category}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          category: e.target.value,
                        })
                      }
                    >

                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}

                    </select>

                  </div>

                </div>

                {/* Brand */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Brand Name
                  </label>

                  <div className="relative">

                    <Building2
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        text-slate-800
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="Crocin"
                      value={form.brand}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          brand: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* HSN */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    HSN Code
                  </label>

                  <div className="relative">

                    <Barcode
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        text-slate-800
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="300490"
                      value={form.hsn}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hsn: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* Purchase Price */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Purchase Price{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      required
                      type="number"
                      step="0.01"
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="10.00"
                      value={form.purchasePrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          purchasePrice: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* Sale Price */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Sale Price{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      required
                      type="number"
                      step="0.01"
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="12.00"
                      value={form.salePrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          salePrice: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* MRP */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    MRP{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <IndianRupee
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      required
                      type="number"
                      step="0.01"
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="15.00"
                      value={form.mrp}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          mrp: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* Stock */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Opening Stock{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <Package
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      required
                      type="number"
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="250"
                      value={form.stock}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          stock: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* Expiry */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Expiry Date{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      required
                      type="date"
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      value={form.expiry}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          expiry: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

                {/* Barcode */}

                <div>

                  <label className="block text-xs font-semibold text-navy-900 mb-1.5">
                    Barcode (Optional)
                  </label>

                  <div className="relative">

                    <Barcode
                      size={15}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-blue-500
                      "
                    />

                    <input
                      className="
                        w-full
                        h-10
                        pl-9
                        pr-3
                        rounded-lg
                        border
                        border-blue-200
                        bg-white
                        text-sm
                        outline-none
                        focus:border-blue-500
                        focus:ring-2
                        focus:ring-blue-100
                      "
                      placeholder="1234567890"
                      value={form.barcode}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          barcode: e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

              </div>

              {/* Buttons */}

              <div
                className="
                  flex
                  gap-3
                  pt-5
                  mt-5
                  border-t
                  border-blue-100
                "
              >

                <button
                  type="button"
                  onClick={closeForm}
                  className="
                    flex-1
                    h-11
                    rounded-lg
                    border
                    border-blue-200
                    bg-white
                    text-blue-700
                    font-semibold
                    text-sm
                    hover:bg-blue-50
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    h-11
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    text-sm
                    shadow-lg
                    shadow-blue-500/25
                    transition
                  "
                >
                  {editingId
                    ? 'Update Medicine'
                    : 'Save Medicine'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* Modal animation */}

      <style>
        {`
          @keyframes modalIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.97);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

    </div>
  )
}