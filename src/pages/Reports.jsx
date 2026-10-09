// // import { useEffect, useMemo, useState } from 'react'
// // import {
// //   FileText,
// //   FileSpreadsheet,
// //   ShoppingCart,
// //   Package,
// //   AlertTriangle,
// //   IndianRupee,
// //   Receipt,
// //   Boxes,
// //   CalendarDays,
// //   Users,
// //   Truck,
// //   CreditCard,
// //   RotateCcw,
// // } from 'lucide-react'
// // import { getReports } from '../services/api'

// // const REPORTS = [
// //   { key: 'today-sales', label: "Today's Sales", icon: Receipt },
// //   { key: 'purchases', label: 'Purchases', icon: ShoppingCart },
// //   { key: 'stock', label: 'Stock', icon: Boxes },
// //   { key: 'customers', label: 'Customers', icon: Users },
// //   { key: 'suppliers', label: 'Suppliers', icon: Truck },
// //   { key: 'expiry', label: 'Expiry', icon: CalendarDays },
// //   { key: 'amount', label: 'Amount', icon: IndianRupee },
// //   { key: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
// //   { key: 'returns', label: 'Returns', icon: RotateCcw },
// //   { key: 'payments', label: 'Payments', icon: CreditCard },
// //   { key: 'sales-items', label: 'Medicine Sales', icon: Package },
// // ]

// // const TODAY = new Date()

// // const DEFAULT_FROM = `${TODAY.getFullYear()}-${String(
// //   TODAY.getMonth() + 1
// // ).padStart(2, '0')}-01`

// // const DEFAULT_TO = `${TODAY.getFullYear()}-${String(
// //   TODAY.getMonth() + 1
// // ).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`

// // function SummaryCard({ icon: Icon, label, value, type }) {
// //   const styles = {
// //     blue: {
// //       box: 'bg-[#EDF6FD] border-[#1689E8]/60 shadow-[0_0_10px_rgba(22,137,232,0.18)]',
// //       icon: 'bg-[#1689E8]',
// //       value: 'text-[#071d42]',
// //     },
// //     green: {
// //       box: 'bg-[#EAF8F1] border-[#18B878]/60 shadow-[0_0_10px_rgba(24,184,120,0.18)]',
// //       icon: 'bg-[#18B878]',
// //       value: 'text-green-700',
// //     },
// //     orange: {
// //       box: 'bg-[#FFF3DE] border-[#F3A315]/65 shadow-[0_0_12px_rgba(243,163,21,0.24)]',
// //       icon: 'bg-[#F3A315]',
// //       value: 'text-orange-700',
// //     },
// //     purple: {
// //       box: 'bg-[#F6EEFD] border-[#792CE0]/60 shadow-[0_0_10px_rgba(121,44,224,0.18)]',
// //       icon: 'bg-[#792CE0]',
// //       value: 'text-purple-700',
// //     },
// //     red: {
// //       box: 'bg-[#FFF0F1] border-[#EF4148]/60 shadow-[0_0_10px_rgba(239,65,72,0.18)]',
// //       icon: 'bg-[#EF4148]',
// //       value: 'text-red-700',
// //     },
// //   }

// //   const style = styles[type] || styles.blue

// //   return (
// //     <div
// //       className={`rounded-xl border p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 ${style.box}`}
// //     >
// //       <div
// //         className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${style.icon}`}
// //       >
// //         <Icon size={21} />
// //       </div>

// //       <div className="min-w-0">
// //         <p className="text-xs font-medium text-slate-500">{label}</p>
// //         <p
// //           className={`text-xl font-bold mt-0.5 truncate ${style.value}`}
// //         >
// //           {value}
// //         </p>
// //       </div>
// //     </div>
// //   )
// // }

// // function formatDate(value) {
// //   if (!value) return '-'

// //   const date = new Date(value)

// //   if (Number.isNaN(date.getTime())) return String(value)

// //   return date.toLocaleDateString('en-IN', {
// //     day: '2-digit',
// //     month: '2-digit',
// //     year: 'numeric',
// //   })
// // }

// // function money(value) {
// //   return `₹ ${Number(value || 0).toLocaleString('en-IN', {
// //     minimumFractionDigits: 2,
// //     maximumFractionDigits: 2,
// //   })}`
// // }

// // export default function Reports() {
// //   const [tab, setTab] = useState(REPORTS[0].key)
// //   const [from, setFrom] = useState(DEFAULT_FROM)
// //   const [to, setTo] = useState(DEFAULT_TO)
// //   const [rows, setRows] = useState([])
// //   const [loading, setLoading] = useState(false)
// //   const [generatingPdf, setGeneratingPdf] = useState(false)

// //   const report =
// //     REPORTS.find((item) => item.key === tab) || REPORTS[0]

// //   useEffect(() => {
// //     loadReport()
// //   }, [tab, from, to])

// //   async function loadReport() {
// //     setLoading(true)

// //     try {
// //       const params =
// //         tab === 'today-sales' ||
// //         tab === 'stock' ||
// //         tab === 'customers' ||
// //         tab === 'suppliers' ||
// //         tab === 'expiry' ||
// //         tab === 'low-stock'
// //           ? {}
// //           : { from, to }

// //       const data = await getReports(tab, params)

// //       setRows(Array.isArray(data) ? data : data?.data || [])
// //     } catch (error) {
// //       console.error('Unable to load report:', error)
// //       setRows([])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const reportInfo = useMemo(() => {
// //     const totalAmount = rows.reduce(
// //       (sum, row) =>
// //         sum + Number(row.amount || row.totalAmount || 0),
// //       0
// //     )

// //     const quantity = rows.reduce(
// //       (sum, row) =>
// //         sum +
// //         Number(
// //           row.quantity ||
// //             row.stock ||
// //             row.itemQuantity ||
// //             0
// //         ),
// //       0
// //     )

// //     if (tab === 'stock') {
// //       const stock = rows.reduce(
// //         (sum, row) => sum + Number(row.stock || 0),
// //         0
// //       )

// //       const low = rows.filter(
// //         (row) => Number(row.stock || 0) <= 20
// //       ).length

// //       return {
// //         cards: [
// //           ['Total Medicines', rows.length, Package, 'blue'],
// //           [
// //             'Total Stock',
// //             stock.toLocaleString('en-IN'),
// //             Boxes,
// //             'green',
// //           ],
// //           ['Low Stock', low, AlertTriangle, 'orange'],
// //           [
// //             'Stock Value',
// //             money(
// //               rows.reduce(
// //                 (s, r) =>
// //                   s +
// //                   Number(r.purchasePrice || 0) *
// //                     Number(r.stock || 0),
// //                 0
// //               )
// //             ),
// //             IndianRupee,
// //             'purple',
// //           ],
// //         ],
// //         total: 0,
// //       }
// //     }

// //     if (tab === 'customers') {
// //       return {
// //         cards: [
// //           ['Customers', rows.length, Users, 'blue'],
// //           [
// //             'Total Bills',
// //             rows.reduce(
// //               (s, r) => s + Number(r.totalBills || 0),
// //               0
// //             ),
// //             Receipt,
// //             'green',
// //           ],
// //           [
// //             'Customer Amount',
// //             money(
// //               rows.reduce(
// //                 (s, r) => s + Number(r.totalAmount || 0),
// //                 0
// //               )
// //             ),
// //             IndianRupee,
// //             'purple',
// //           ],
// //           [
// //             'Active Records',
// //             rows.filter((r) => r.totalBills > 0).length,
// //             Users,
// //             'orange',
// //           ],
// //         ],
// //         total: rows.reduce(
// //           (s, r) => s + Number(r.totalAmount || 0),
// //           0
// //         ),
// //       }
// //     }

// //     if (tab === 'suppliers') {
// //       return {
// //         cards: [
// //           ['Suppliers', rows.length, Truck, 'blue'],
// //           [
// //             'Purchase Bills',
// //             rows.reduce(
// //               (s, r) => s + Number(r.totalPurchases || 0),
// //               0
// //             ),
// //             Receipt,
// //             'green',
// //           ],
// //           [
// //             'Purchase Amount',
// //             money(
// //               rows.reduce(
// //                 (s, r) => s + Number(r.totalAmount || 0),
// //                 0
// //               )
// //             ),
// //             IndianRupee,
// //             'purple',
// //           ],
// //           [
// //             'Active Suppliers',
// //             rows.filter((r) => r.totalPurchases > 0).length,
// //             Truck,
// //             'orange',
// //           ],
// //         ],
// //         total: rows.reduce(
// //           (s, r) => s + Number(r.totalAmount || 0),
// //           0
// //         ),
// //       }
// //     }

// //     if (tab === 'expiry') {
// //       const expired = rows.filter(
// //         (r) =>
// //           r.expiry &&
// //           new Date(r.expiry) < new Date()
// //       ).length

// //       return {
// //         cards: [
// //           ['Expiry Items', rows.length, CalendarDays, 'blue'],
// //           ['Expired', expired, AlertTriangle, 'red'],
// //           [
// //             'Expiring',
// //             rows.length - expired,
// //             CalendarDays,
// //             'orange',
// //           ],
// //           ['Stock In Expiry', quantity, Boxes, 'green'],
// //         ],
// //         total: 0,
// //       }
// //     }

// //     if (tab === 'low-stock') {
// //       return {
// //         cards: [
// //           [
// //             'Low Stock Items',
// //             rows.length,
// //             AlertTriangle,
// //             'orange',
// //           ],
// //           ['Total Units', quantity, Boxes, 'blue'],
// //           [
// //             'Critical',
// //             rows.filter(
// //               (r) => Number(r.stock) <= 15
// //             ).length,
// //             AlertTriangle,
// //             'red',
// //           ],
// //           ['Medicines', rows.length, Package, 'purple'],
// //         ],
// //         total: 0,
// //       }
// //     }

// //     if (tab === 'payments') {
// //       return {
// //         cards: [
// //           [
// //             'Payment Types',
// //             rows.length,
// //             CreditCard,
// //             'blue',
// //           ],
// //           [
// //             'Transactions',
// //             rows.reduce(
// //               (s, r) => s + Number(r.count || 0),
// //               0
// //             ),
// //             Receipt,
// //             'green',
// //           ],
// //           [
// //             'Collected',
// //             money(totalAmount),
// //             IndianRupee,
// //             'purple',
// //           ],
// //           [
// //             'Online + Check',
// //             money(
// //               rows
// //                 .filter(
// //                   (r) => r.paymentMethod !== 'Cash'
// //                 )
// //                 .reduce(
// //                   (s, r) =>
// //                     s + Number(r.amount || 0),
// //                   0
// //                 )
// //             ),
// //             CreditCard,
// //             'orange',
// //           ],
// //         ],
// //         total: totalAmount,
// //       }
// //     }

// //     if (tab === 'sales-items') {
// //       return {
// //         cards: [
// //           [
// //             'Medicines Sold',
// //             rows.length,
// //             Package,
// //             'blue',
// //           ],
// //           [
// //             'Units Sold',
// //             quantity,
// //             Boxes,
// //             'green',
// //           ],
// //           [
// //             'Sales Amount',
// //             money(totalAmount),
// //             IndianRupee,
// //             'purple',
// //           ],
// //           [
// //             'Top Line',
// //             rows[0]?.product || '-',
// //             ShoppingCart,
// //             'orange',
// //           ],
// //         ],
// //         total: totalAmount,
// //       }
// //     }

// //     return {
// //       cards: [
// //         [
// //           'Total Amount',
// //           money(totalAmount),
// //           IndianRupee,
// //           'blue',
// //         ],
// //         [
// //           'Total Records',
// //           rows.length,
// //           Receipt,
// //           'green',
// //         ],
// //         [
// //           'Total Quantity',
// //           quantity || '-',
// //           Boxes,
// //           'orange',
// //         ],
// //         [
// //           'Average',
// //           money(
// //             rows.length
// //               ? totalAmount / rows.length
// //               : 0
// //           ),
// //           IndianRupee,
// //           'purple',
// //         ],
// //       ],
// //       total: totalAmount,
// //     }
// //   }, [rows, tab])

// //   function getColumns() {
// //     const columns = {
// //       'today-sales': [
// //         ['Date', 'date'],
// //         ['Sale ID', 'billNo'],
// //         ['Customer', 'customer'],
// //         ['Phone', 'phone'],
// //         ['Payment', 'paymentMethod'],
// //         ['Amount', 'amount'],
// //       ],

// //       purchases: [
// //         ['Date', 'date'],
// //         ['Invoice No', 'invoiceNo'],
// //         ['Supplier', 'supplier'],
// //         ['Amount', 'amount'],
// //       ],

// //       stock: [
// //         ['Medicine', 'name'],
// //         ['Brand', 'brand'],
// //         ['Category', 'category'],
// //         ['Batch', 'batchNo'],
// //         ['Expiry', 'expiry'],
// //         ['Stock', 'stock'],
// //         ['Sale Price', 'salePrice'],
// //       ],

// //       customers: [
// //         ['Name', 'name'],
// //         ['Phone', 'phone'],
// //         ['Address', 'address'],
// //         ['Bills', 'totalBills'],
// //         ['Amount', 'totalAmount'],
// //         ['Last Sale', 'lastSale'],
// //       ],

// //       suppliers: [
// //         ['Supplier', 'name'],
// //         ['Contact', 'contact'],
// //         ['Email', 'email'],
// //         ['Purchases', 'totalPurchases'],
// //         ['Amount', 'totalAmount'],
// //         ['Last Purchase', 'lastPurchase'],
// //       ],

// //       expiry: [
// //         ['Medicine', 'name'],
// //         ['Batch', 'batchNo'],
// //         ['Expiry', 'expiry'],
// //         ['Stock', 'stock'],
// //         ['Category', 'category'],
// //       ],

// //       amount: [
// //         ['Date', 'date'],
// //         ['Sale ID', 'billNo'],
// //         ['Customer', 'customer'],
// //         ['Subtotal', 'subtotal'],
// //         ['Discount', 'discount'],
// //         ['Payment', 'paymentMethod'],
// //         ['Amount', 'amount'],
// //       ],

// //       'low-stock': [
// //         ['Medicine', 'name'],
// //         ['Brand', 'brand'],
// //         ['Category', 'category'],
// //         ['Stock', 'stock'],
// //         ['Sale Price', 'salePrice'],
// //       ],

// //       returns: [
// //         ['Date', 'date'],
// //         ['Credit Note', 'returnNo'],
// //         ['Sale ID', 'billNo'],
// //         ['Customer', 'customer'],
// //         ['Reason', 'reason'],
// //         ['Amount', 'amount'],
// //       ],

// //       payments: [
// //         ['Payment Method', 'paymentMethod'],
// //         ['Transactions', 'count'],
// //         ['Amount', 'amount'],
// //       ],

// //       'sales-items': [
// //         ['Medicine', 'product'],
// //         ['Quantity', 'quantity'],
// //         ['Amount', 'amount'],
// //       ],
// //     }

// //     return columns[tab] || []
// //   }

// //   function displayValue(key, value) {
// //     if (
// //       value === null ||
// //       value === undefined ||
// //       value === ''
// //     ) {
// //       return '-'
// //     }

// //     if (
// //       [
// //         'date',
// //         'expiry',
// //         'lastSale',
// //         'lastPurchase',
// //       ].includes(key)
// //     ) {
// //       return formatDate(value)
// //     }

// //     if (
// //       [
// //         'amount',
// //         'totalAmount',
// //         'subtotal',
// //         'discount',
// //         'salePrice',
// //       ].includes(key)
// //     ) {
// //       return money(value)
// //     }

// //     return String(value)
// //   }

// //   async function exportExcel() {
// //     if (!rows.length) {
// //       return alert(
// //         'No report data available to export.'
// //       )
// //     }

// //     const XLSX = await import('xlsx')
// //     const columns = getColumns()

// //     const data = rows.map((row, index) => {
// //       const item = { '#': index + 1 }

// //       columns.forEach(([label, key]) => {
// //         item[label] = displayValue(
// //           key,
// //           row[key]
// //         )
// //       })

// //       return item
// //     })

// //     const ws = XLSX.utils.json_to_sheet(data)
// //     const wb = XLSX.utils.book_new()

// //     XLSX.utils.book_append_sheet(
// //       wb,
// //       ws,
// //       report.label.slice(0, 31)
// //     )

// //     XLSX.writeFile(
// //       wb,
// //       `City-Care-${report.key}-${from}-to-${to}.xlsx`
// //     )
// //   }

// //   async function generatePdf() {
// //     if (!rows.length) {
// //       return alert(
// //         'No report data available to generate PDF.'
// //       )
// //     }

// //     setGeneratingPdf(true)

// //     try {
// //       const { jsPDF } = await import('jspdf')
// //       const autoTableModule =
// //         await import('jspdf-autotable')

// //       const autoTable =
// //         autoTableModule.default ||
// //         autoTableModule.autoTable

// //       const doc = new jsPDF(
// //         'p',
// //         'mm',
// //         'a4'
// //       )

// //       const columns = getColumns()

// //       const head = [
// //         [
// //           '#',
// //           ...columns.map(([label]) => label),
// //         ],
// //       ]

// //       const body = rows.map(
// //         (row, index) => [
// //           index + 1,
// //           ...columns.map(
// //             ([, key]) =>
// //               displayValue(key, row[key])
// //           ),
// //         ]
// //       )

// //       doc.setFontSize(18)
// //       doc.setFont(
// //         'helvetica',
// //         'bold'
// //       )

// //       doc.text(
// //         'City Care Hospital',
// //         105,
// //         15,
// //         { align: 'center' }
// //       )

// //       doc.setFontSize(12)

// //       doc.text(
// //         report.label,
// //         105,
// //         23,
// //         { align: 'center' }
// //       )

// //       doc.setFontSize(9)

// //       doc.text(
// //         `From: ${from}   To: ${to}`,
// //         105,
// //         29,
// //         { align: 'center' }
// //       )

// //       autoTable(doc, {
// //         head,
// //         body,
// //         startY: 35,
// //         theme: 'grid',
// //         styles: {
// //           fontSize: 7,
// //           cellPadding: 2,
// //         },
// //         headStyles: {
// //           fillColor: [22, 137, 232],
// //         },
// //       })

// //       doc.save(
// //         `City-Care-${report.key}-report.pdf`
// //       )
// //     } catch (error) {
// //       console.error(error)
// //       alert('Unable to generate PDF.')
// //     } finally {
// //       setGeneratingPdf(false)
// //     }
// //   }

// //   function resetFilters() {
// //     setFrom(DEFAULT_FROM)
// //     setTo(DEFAULT_TO)
// //   }

// //   const columns = getColumns()

// //   return (
// //     <div className="space-y-3">

// //       {/* Page Title */}
// //       <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
// //         Reports
// //       </h2>

// //       <div className="bg-white rounded-xl border border-[#D7EBFF] shadow-[0_5px_20px_rgba(30,136,229,0.07)] p-3 sm:p-4">

// //         {/* Report Tabs */}
// //         <div className="flex gap-1 overflow-x-auto pb-2 border-b border-[#E5F1FB]">
// //           {REPORTS.map((item) => {
// //             const Icon = item.icon

// //             return (
// //               <button
// //                 key={item.key}
// //                 onClick={() =>
// //                   setTab(item.key)
// //                 }
// //                 className={`shrink-0 px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
// //                   tab === item.key
// //                     ? 'bg-[#1689E8] text-white shadow-[0_3px_10px_rgba(22,137,232,0.22)]'
// //                     : 'text-[#526274] hover:border hover:border-[#CBE7FB]'
// //                 }`}
// //               >
// //                 <Icon size={14} />
// //                 {item.label}
// //               </button>
// //             )
// //           })}
// //         </div>

// //         {/* Date + Action Section */}
// //         <div className="flex flex-col lg:flex-row lg:items-end gap-4 py-4 border-b border-[#E5F1FB]">

// //           {/* Date Filters */}
// //           <div className="flex flex-wrap items-end gap-3">

// //             {/* From Date */}
// //             <div className="flex flex-col gap-1.5">
// //               <label className="text-xs font-bold text-[#526274]">
// //                 From Date
// //               </label>

// //               <input
// //                 type="date"
// //                 value={from}
// //                 onChange={(e) =>
// //                   setFrom(e.target.value)
// //                 }
// //                 className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
// //               />
// //             </div>

// //             {/* To Date */}
// //             <div className="flex flex-col gap-1.5">
// //               <label className="text-xs font-bold text-[#526274]">
// //                 To Date
// //               </label>

// //               <input
// //                 type="date"
// //                 value={to}
// //                 onChange={(e) =>
// //                   setTo(e.target.value)
// //                 }
// //                 className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
// //               />
// //             </div>

// //             {/* Reset */}
// //             <button
// //               onClick={resetFilters}
// //               className="h-10 px-4 rounded-lg border border-[#CBE7FB] bg-white text-xs font-bold text-[#1689E8] hover:bg-[#F3F9FF] transition"
// //             >
// //               Reset
// //             </button>

// //             {/* Refresh */}
// //             <button
// //               onClick={loadReport}
// //               className="h-10 px-4 rounded-lg bg-[#1689E8] text-white border border-[#1689E8] text-xs font-bold hover:bg-[#1178D0] transition"
// //             >
// //               Refresh
// //             </button>
// //           </div>

// //           {/* Export Buttons */}
// //           <div className="lg:ml-auto flex flex-wrap gap-2">

// //             <button
// //               onClick={exportExcel}
// //               className="h-10 px-4 rounded-lg bg-[#EAF8F1] text-[#18A86F] border border-[#BFE8D3] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#DDF5EA] transition"
// //             >
// //               <FileSpreadsheet size={15} />
// //               Excel
// //             </button>

// //             <button
// //               onClick={generatePdf}
// //               disabled={generatingPdf}
// //               className="h-10 px-4 rounded-lg bg-[#EDF6FD] text-[#1689E8] border border-[#CBE7FB] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E3F2FD] transition disabled:opacity-60"
// //             >
// //               <FileText size={15} />

// //               {generatingPdf
// //                 ? 'Generating...'
// //                 : 'Generate PDF'}
// //             </button>

// //           </div>
// //         </div>

// //         {/* Summary Cards */}
// //         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
// //           {reportInfo.cards.map(
// //             ([label, value, Icon, type]) => (
// //               <SummaryCard
// //                 key={label}
// //                 label={label}
// //                 value={value}
// //                 icon={Icon}
// //                 type={type}
// //               />
// //             )
// //           )}
// //         </div>

// //         {/* Report Table */}
// //         <div className="overflow-x-auto">

// //           <table className="w-full min-w-[700px] text-xs">

// //             <thead>
// //               <tr className="bg-[#F3F8FD] text-left">

// //                 <th className="px-3 py-3 font-bold text-[#526274]">
// //                   #
// //                 </th>

// //                 {columns.map(
// //                   ([label]) => (
// //                     <th
// //                       key={label}
// //                       className="px-3 py-3 font-bold text-[#526274]"
// //                     >
// //                       {label}
// //                     </th>
// //                   )
// //                 )}

// //               </tr>
// //             </thead>

// //             <tbody>

// //               {loading ? (
// //                 <tr>
// //                   <td
// //                     colSpan={
// //                       columns.length + 1
// //                     }
// //                     className="text-center py-8 text-slate-400"
// //                   >
// //                     Loading report...
// //                   </td>
// //                 </tr>
// //               ) : rows.length ? (
// //                 rows.map(
// //                   (row, index) => (
// //                     <tr
// //                       key={
// //                         row.id ||
// //                         row.billNo ||
// //                         row.invoiceNo ||
// //                         row.productId ||
// //                         `${index}`
// //                       }
// //                       className="border-b border-[#EEF2F6] hover:bg-[#F8FBFE]"
// //                     >

// //                       <td className="px-3 py-3 text-slate-500">
// //                         {index + 1}
// //                       </td>

// //                       {columns.map(
// //                         ([label, key]) => (
// //                           <td
// //                             key={label}
// //                             className="px-3 py-3 text-[#17212B] font-medium"
// //                           >
// //                             {displayValue(
// //                               key,
// //                               row[key]
// //                             )}
// //                           </td>
// //                         )
// //                       )}

// //                     </tr>
// //                   )
// //                 )
// //               ) : (
// //                 <tr>
// //                   <td
// //                     colSpan={
// //                       columns.length + 1
// //                     }
// //                     className="text-center py-8 text-slate-400"
// //                   >
// //                     No data available.
// //                   </td>
// //                 </tr>
// //               )}

// //             </tbody>

// //             {reportInfo.total > 0 && (
// //               <tfoot>
// //                 <tr>

// //                   <td
// //                     colSpan={Math.max(
// //                       1,
// //                       columns.length - 1
// //                     )}
// //                     className="px-3 py-3 text-right font-bold text-[#17212B]"
// //                   >
// //                     Total Amount :
// //                   </td>

// //                   <td className="px-3 py-3 font-bold text-[#1689E8]">
// //                     {money(
// //                       reportInfo.total
// //                     )}
// //                   </td>

// //                 </tr>
// //               </tfoot>
// //             )}

// //           </table>
// //         </div>

// //       </div>
// //     </div>
// //   )
// // }

// import { useEffect, useMemo, useRef, useState } from 'react'
// import {
//   FileText,
//   FileSpreadsheet,
//   ShoppingCart,
//   Package,
//   AlertTriangle,
//   IndianRupee,
//   Receipt,
//   Boxes,
//   CalendarDays,
//   Users,
//   Truck,
//   CreditCard,
//   RotateCcw,
//   Eye,
//   X,
//   Loader2,
//   Info,
//   MessageCircle,
// } from 'lucide-react'
// import * as api from '../services/api'
// import { getReports } from '../services/api'

// const REPORTS = [
//   { key: 'today-sales', label: "Today's Sales", icon: Receipt },
//   { key: 'purchases', label: 'Purchases', icon: ShoppingCart },
//   { key: 'stock', label: 'Stock', icon: Boxes },
//   { key: 'customers', label: 'Customers', icon: Users },
//   { key: 'suppliers', label: 'Suppliers', icon: Truck },
//   { key: 'expiry', label: 'Expiry', icon: CalendarDays },
//   { key: 'amount', label: 'Amount', icon: IndianRupee },
//   { key: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
//   { key: 'returns', label: 'Returns', icon: RotateCcw },
//   { key: 'payments', label: 'Payments', icon: CreditCard },
//   { key: 'sales-items', label: 'Medicine Sales', icon: Package },
// ]

// /* Which report tab maps to which detail type on the backend */
// const DETAIL_TYPES = {
//   'today-sales': 'sale',
//   amount: 'sale',
//   purchases: 'purchase',
//   stock: 'medicine',
//   expiry: 'medicine',
//   'low-stock': 'medicine',
//   customers: 'customer',
//   suppliers: 'supplier',
//   returns: 'return',
// }

// function getRowId(row) {
//   return (
//     row.id ??
//     row._id ??
//     row.productId ??
//     row.billNo ??
//     row.invoiceNo ??
//     row.returnNo
//   )
// }

// const TODAY = new Date()

// const DEFAULT_FROM = `${TODAY.getFullYear()}-${String(
//   TODAY.getMonth() + 1
// ).padStart(2, '0')}-01`

// const DEFAULT_TO = `${TODAY.getFullYear()}-${String(
//   TODAY.getMonth() + 1
// ).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`

// /* =========================================================
//    HELPERS FOR THE DETAIL VIEW
// ========================================================= */

// const HIDDEN_KEYS = new Set([
//   'id',
//   '_id',
//   '__v',
//   'password',
//   'passwordHash',
//   'token',
// ])

// const MONEY_KEYS = new Set([
//   'amount',
//   'totalAmount',
//   'subtotal',
//   'discount',
//   'salePrice',
//   'purchasePrice',
//   'price',
//   'unitPrice',
//   'mrp',
//   'total',
//   'tax',
//   'gst',
//   'netAmount',
//   'grandTotal',
//   'paid',
//   'paidAmount',
//   'due',
//   'dueAmount',
//   'balance',
//   'refundAmount',
//   'discountAmount',
//   'taxAmount',
//   'lineTotal',
// ])

// const DATE_KEYS = new Set([
//   'date',
//   'expiry',
//   'lastSale',
//   'lastPurchase',
//   'createdAt',
//   'updatedAt',
//   'saleDate',
//   'purchaseDate',
//   'returnDate',
//   'mfgDate',
//   'dob',
// ])

// const LABELS = {
//   billNo: 'Sale ID',
//   returnNo: 'Credit Note',
//   invoiceNo: 'Invoice No',
//   paymentMethod: 'Payment',
//   totalBills: 'Total Bills',
//   totalPurchases: 'Total Purchases',
//   batchNo: 'Batch',
//   mrp: 'MRP',
//   gst: 'GST',
// }

// function prettyLabel(key) {
//   if (LABELS[key]) return LABELS[key]

//   return key
//     .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
//     .replace(/[_-]+/g, ' ')
//     .replace(/\b\w/g, (c) => c.toUpperCase())
// }

// function formatValue(key, value) {
//   if (value === null || value === undefined || value === '') return '-'

//   if (typeof value === 'boolean') return value ? 'Yes' : 'No'

//   if (Array.isArray(value)) return value.join(', ') || '-'

//   if (typeof value === 'object') return JSON.stringify(value)

//   if (DATE_KEYS.has(key) || /(Date|At)$/.test(key)) return formatDate(value)

//   if (/(Percent|Percentage)$/.test(key) && Number.isFinite(Number(value))) {
//     return `${value}%`
//   }

//   if (MONEY_KEYS.has(key) && Number.isFinite(Number(value))) {
//     return money(value)
//   }

//   return String(value)
// }

// /* Split a record into plain fields, nested objects and lists (tables) */
// function splitDetail(data) {
//   const fields = []
//   const objects = []
//   const lists = []

//   Object.entries(data || {}).forEach(([key, value]) => {
//     if (HIDDEN_KEYS.has(key) || value === undefined) return

//     if (
//       Array.isArray(value) &&
//       (value.length === 0 ||
//         (typeof value[0] === 'object' && value[0] !== null))
//     ) {
//       lists.push([key, value])
//     } else if (value && typeof value === 'object' && !Array.isArray(value)) {
//       objects.push([key, value])
//     } else {
//       fields.push([key, value])
//     }
//   })

//   return { fields, objects, lists }
// }

// function FieldGrid({ entries }) {
//   if (!entries.length) return null

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
//       {entries.map(([key, value]) => (
//         <div key={key} className="min-w-0">
//           <p className="text-[11px] font-semibold text-[#7B93AA]">
//             {prettyLabel(key)}
//           </p>
//           <p className="text-[13px] font-semibold text-[#17212B] mt-0.5 break-words">
//             {formatValue(key, value)}
//           </p>
//         </div>
//       ))}
//     </div>
//   )
// }

// function DetailTable({ rows }) {
//   const cols = Array.from(
//     rows.reduce((set, row) => {
//       Object.keys(row || {}).forEach((k) => {
//         if (!HIDDEN_KEYS.has(k)) set.add(k)
//       })
//       return set
//     }, new Set())
//   )

//   if (!rows.length) {
//     return (
//       <p className="text-[12px] text-slate-400 py-4 text-center">
//         No records found.
//       </p>
//     )
//   }

//   return (
//     <div className="overflow-x-auto rounded-xl border border-[#E1EEF9]">
//       <table className="w-full min-w-[520px] text-xs">
//         <thead>
//           <tr className="bg-[#F3F8FD] text-left">
//             <th className="px-3 py-2.5 font-bold text-[#526274]">#</th>
//             {cols.map((col) => (
//               <th
//                 key={col}
//                 className="px-3 py-2.5 font-bold text-[#526274] whitespace-nowrap"
//               >
//                 {prettyLabel(col)}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((row, index) => (
//             <tr
//               key={index}
//               className="border-t border-[#EEF2F6] hover:bg-[#F8FBFE]"
//             >
//               <td className="px-3 py-2.5 text-slate-500">{index + 1}</td>

//               {cols.map((col) => (
//                 <td
//                   key={col}
//                   className={`px-3 py-2.5 font-medium text-[#17212B] ${
//                     typeof row?.[col] === 'number' ? 'text-right' : ''
//                   }`}
//                 >
//                   {formatValue(col, row?.[col])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }

// function DetailModal({ title, subtitle, loading, notice, data, onClose }) {
//   const { fields, objects, lists } = useMemo(() => splitDetail(data), [data])

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#071A36]/55 backdrop-blur-sm sm:p-4"
//       onClick={onClose}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-label={title}
//         onClick={(e) => e.stopPropagation()}
//         className="w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl border border-[#D7EBFF] shadow-[0_25px_70px_rgba(7,26,54,0.35)] overflow-hidden"
//       >
//         {/* Header */}
//         <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-[#E5F1FB] bg-gradient-to-r from-[#F3F9FF] to-white">
//           <div className="w-10 h-10 rounded-xl bg-[#1689E8] text-white flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(22,137,232,0.35)]">
//             <Eye size={19} />
//           </div>

//           <div className="min-w-0 flex-1">
//             <h3 className="text-[15px] font-bold text-[#123B66] truncate">
//               {title}
//             </h3>
//             {subtitle && (
//               <p className="text-[12px] text-[#6B86A5] truncate">{subtitle}</p>
//             )}
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="w-9 h-9 rounded-full flex items-center justify-center text-[#526274] hover:bg-[#EDF6FD] hover:text-[#1689E8] transition"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
//           {notice && (
//             <div className="flex items-start gap-2 rounded-xl border border-[#F3D9A4] bg-[#FFF8E8] px-3 py-2.5 text-[12px] text-[#8A5A00]">
//               <Info size={15} className="mt-0.5 shrink-0" />
//               <span>{notice}</span>
//             </div>
//           )}

//           {/* Main fields */}
//           <div className="rounded-xl border border-[#E1EEF9] bg-[#FAFCFE] p-4">
//             <FieldGrid entries={fields} />
//           </div>

//           {/* Nested objects (e.g. customer, supplier) */}
//           {objects.map(([key, value]) => (
//             <div key={key}>
//               <h4 className="text-[12px] font-bold text-[#123B66] mb-2">
//                 {prettyLabel(key)}
//               </h4>

//               <div className="rounded-xl border border-[#E1EEF9] bg-[#FAFCFE] p-4">
//                 <FieldGrid
//                   entries={Object.entries(value).filter(
//                     ([k]) => !HIDDEN_KEYS.has(k)
//                   )}
//                 />
//               </div>
//             </div>
//           ))}

//           {/* Lists (items, sales, purchases ...) */}
//           {lists.map(([key, value]) => (
//             <div key={key}>
//               <h4 className="text-[12px] font-bold text-[#123B66] mb-2">
//                 {prettyLabel(key)}{' '}
//                 <span className="text-[#7B93AA] font-semibold">
//                   ({value.length})
//                 </span>
//               </h4>

//               <DetailTable rows={value} />
//             </div>
//           ))}

//           {loading && (
//             <div className="flex items-center justify-center gap-2 py-4 text-[12px] text-[#6B86A5]">
//               <Loader2 size={16} className="animate-spin" />
//               Loading full details...
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="px-4 sm:px-5 py-3 border-t border-[#E5F1FB] flex justify-end bg-white">
//           <button
//             type="button"
//             onClick={onClose}
//             className="h-10 px-5 rounded-lg bg-[#1689E8] text-white text-xs font-bold hover:bg-[#1178D0] transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* =========================================================
//    EXISTING COMPONENTS
// ========================================================= */

// function SummaryCard({ icon: Icon, label, value, type }) {
//   const styles = {
//     blue: {
//       box: 'bg-[#EDF6FD] border-[#1689E8]/60 shadow-[0_0_10px_rgba(22,137,232,0.18)]',
//       icon: 'bg-[#1689E8]',
//       value: 'text-[#071d42]',
//     },
//     green: {
//       box: 'bg-[#EAF8F1] border-[#18B878]/60 shadow-[0_0_10px_rgba(24,184,120,0.18)]',
//       icon: 'bg-[#18B878]',
//       value: 'text-green-700',
//     },
//     orange: {
//       box: 'bg-[#FFF3DE] border-[#F3A315]/65 shadow-[0_0_12px_rgba(243,163,21,0.24)]',
//       icon: 'bg-[#F3A315]',
//       value: 'text-orange-700',
//     },
//     purple: {
//       box: 'bg-[#F6EEFD] border-[#792CE0]/60 shadow-[0_0_10px_rgba(121,44,224,0.18)]',
//       icon: 'bg-[#792CE0]',
//       value: 'text-purple-700',
//     },
//     red: {
//       box: 'bg-[#FFF0F1] border-[#EF4148]/60 shadow-[0_0_10px_rgba(239,65,72,0.18)]',
//       icon: 'bg-[#EF4148]',
//       value: 'text-red-700',
//     },
//   }

//   const style = styles[type] || styles.blue

//   return (
//     <div
//       className={`rounded-xl border p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 ${style.box}`}
//     >
//       <div
//         className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${style.icon}`}
//       >
//         <Icon size={21} />
//       </div>

//       <div className="min-w-0">
//         <p className="text-xs font-medium text-slate-500">{label}</p>
//         <p className={`text-xl font-bold mt-0.5 truncate ${style.value}`}>
//           {value}
//         </p>
//       </div>
//     </div>
//   )
// }

// function formatDate(value) {
//   if (!value) return '-'

//   const date = new Date(value)

//   if (Number.isNaN(date.getTime())) return String(value)

//   return date.toLocaleDateString('en-IN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   })
// }

// function money(value) {
//   return `₹ ${Number(value || 0).toLocaleString('en-IN', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   })}`
// }

// export default function Reports() {
//   const [tab, setTab] = useState(REPORTS[0].key)
//   const [from, setFrom] = useState(DEFAULT_FROM)
//   const [to, setTo] = useState(DEFAULT_TO)
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [generatingPdf, setGeneratingPdf] = useState(false)

//   /* Detail view state */
//   const [selected, setSelected] = useState(null)
//   const [detail, setDetail] = useState(null)
//   const [detailLoading, setDetailLoading] = useState(false)
//   const [detailNotice, setDetailNotice] = useState('')
//   const detailReq = useRef(0)

//   const report = REPORTS.find((item) => item.key === tab) || REPORTS[0]

//   useEffect(() => {
//     loadReport()
//   }, [tab, from, to])

//   /* Close detail with Escape + lock page scroll while open */
//   useEffect(() => {
//     if (!selected) return

//     const onKey = (e) => {
//       if (e.key === 'Escape') closeDetail()
//     }

//     document.addEventListener('keydown', onKey)
//     const previousOverflow = document.body.style.overflow
//     document.body.style.overflow = 'hidden'

//     return () => {
//       document.removeEventListener('keydown', onKey)
//       document.body.style.overflow = previousOverflow
//     }
//   }, [selected])

//   async function loadReport() {
//     setLoading(true)

//     try {
//       const params =
//         tab === 'today-sales' ||
//         tab === 'stock' ||
//         tab === 'customers' ||
//         tab === 'suppliers' ||
//         tab === 'expiry' ||
//         tab === 'low-stock'
//           ? {}
//           : { from, to }

//       const data = await getReports(tab, params)

//       setRows(Array.isArray(data) ? data : data?.data || [])
//     } catch (error) {
//       console.error('Unable to load report:', error)
//       setRows([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   /* ---------- View details (eye icon) ---------- */
//   async function openDetail(row) {
//     const requestId = ++detailReq.current

//     setSelected(row)
//     setDetail(row)
//     setDetailLoading(false)
//     setDetailNotice('')

//     const kind = DETAIL_TYPES[tab]
//     const id = getRowId(row)

//     // Aggregate rows (Payments, Medicine Sales) have no deeper record
//     if (!kind || id === undefined || id === null) return

//     if (typeof api.getReportDetail !== 'function') {
//       setDetailNotice(
//         'Showing summary data only. Connect the detail API to see items, prices, discounts and address.'
//       )
//       return
//     }

//     setDetailLoading(true)

//     try {
//       const res = await api.getReportDetail(kind, id)

//       if (requestId !== detailReq.current) return

//       const payload =
//         res?.data && typeof res.data === 'object' && !Array.isArray(res.data)
//           ? res.data
//           : res

//       setDetail({ ...row, ...(payload || {}) })
//     } catch (error) {
//       if (requestId !== detailReq.current) return

//       console.error('Unable to load details:', error)
//       setDetailNotice('Could not load full details. Showing summary data.')
//     } finally {
//       if (requestId === detailReq.current) setDetailLoading(false)
//     }
//   }

//   function closeDetail() {
//     detailReq.current += 1
//     setSelected(null)
//     setDetail(null)
//     setDetailLoading(false)
//     setDetailNotice('')
//   }

//   const reportInfo = useMemo(() => {
//     const totalAmount = rows.reduce(
//       (sum, row) => sum + Number(row.amount || row.totalAmount || 0),
//       0
//     )

//     const quantity = rows.reduce(
//       (sum, row) =>
//         sum + Number(row.quantity || row.stock || row.itemQuantity || 0),
//       0
//     )

//     if (tab === 'stock') {
//       const stock = rows.reduce((sum, row) => sum + Number(row.stock || 0), 0)

//       const low = rows.filter((row) => Number(row.stock || 0) <= 20).length

//       return {
//         cards: [
//           ['Total Medicines', rows.length, Package, 'blue'],
//           ['Total Stock', stock.toLocaleString('en-IN'), Boxes, 'green'],
//           ['Low Stock', low, AlertTriangle, 'orange'],
//           [
//             'Stock Value',
//             money(
//               rows.reduce(
//                 (s, r) =>
//                   s + Number(r.purchasePrice || 0) * Number(r.stock || 0),
//                 0
//               )
//             ),
//             IndianRupee,
//             'purple',
//           ],
//         ],
//         total: 0,
//       }
//     }

//     if (tab === 'customers') {
//       return {
//         cards: [
//           ['Customers', rows.length, Users, 'blue'],
//           [
//             'Total Bills',
//             rows.reduce((s, r) => s + Number(r.totalBills || 0), 0),
//             Receipt,
//             'green',
//           ],
//           [
//             'Customer Amount',
//             money(rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0)),
//             IndianRupee,
//             'purple',
//           ],
//           [
//             'Active Records',
//             rows.filter((r) => r.totalBills > 0).length,
//             Users,
//             'orange',
//           ],
//         ],
//         total: rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0),
//       }
//     }

//     if (tab === 'suppliers') {
//       return {
//         cards: [
//           ['Suppliers', rows.length, Truck, 'blue'],
//           [
//             'Purchase Bills',
//             rows.reduce((s, r) => s + Number(r.totalPurchases || 0), 0),
//             Receipt,
//             'green',
//           ],
//           [
//             'Purchase Amount',
//             money(rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0)),
//             IndianRupee,
//             'purple',
//           ],
//           [
//             'Active Suppliers',
//             rows.filter((r) => r.totalPurchases > 0).length,
//             Truck,
//             'orange',
//           ],
//         ],
//         total: rows.reduce((s, r) => s + Number(r.totalAmount || 0), 0),
//       }
//     }

//     if (tab === 'expiry') {
//       const expired = rows.filter(
//         (r) => r.expiry && new Date(r.expiry) < new Date()
//       ).length

//       return {
//         cards: [
//           ['Expiry Items', rows.length, CalendarDays, 'blue'],
//           ['Expired', expired, AlertTriangle, 'red'],
//           ['Expiring', rows.length - expired, CalendarDays, 'orange'],
//           ['Stock In Expiry', quantity, Boxes, 'green'],
//         ],
//         total: 0,
//       }
//     }

//     if (tab === 'low-stock') {
//       return {
//         cards: [
//           ['Low Stock Items', rows.length, AlertTriangle, 'orange'],
//           ['Total Units', quantity, Boxes, 'blue'],
//           [
//             'Critical',
//             rows.filter((r) => Number(r.stock) <= 15).length,
//             AlertTriangle,
//             'red',
//           ],
//           ['Medicines', rows.length, Package, 'purple'],
//         ],
//         total: 0,
//       }
//     }

//     if (tab === 'payments') {
//       return {
//         cards: [
//           ['Payment Types', rows.length, CreditCard, 'blue'],
//           [
//             'Transactions',
//             rows.reduce((s, r) => s + Number(r.count || 0), 0),
//             Receipt,
//             'green',
//           ],
//           ['Collected', money(totalAmount), IndianRupee, 'purple'],
//           [
//             'Online + Check',
//             money(
//               rows
//                 .filter((r) => r.paymentMethod !== 'Cash')
//                 .reduce((s, r) => s + Number(r.amount || 0), 0)
//             ),
//             CreditCard,
//             'orange',
//           ],
//         ],
//         total: totalAmount,
//       }
//     }

//     if (tab === 'sales-items') {
//       return {
//         cards: [
//           ['Medicines Sold', rows.length, Package, 'blue'],
//           ['Units Sold', quantity, Boxes, 'green'],
//           ['Sales Amount', money(totalAmount), IndianRupee, 'purple'],
//           ['Top Line', rows[0]?.product || '-', ShoppingCart, 'orange'],
//         ],
//         total: totalAmount,
//       }
//     }

//     return {
//       cards: [
//         ['Total Amount', money(totalAmount), IndianRupee, 'blue'],
//         ['Total Records', rows.length, Receipt, 'green'],
//         ['Total Quantity', quantity || '-', Boxes, 'orange'],
//         [
//           'Average',
//           money(rows.length ? totalAmount / rows.length : 0),
//           IndianRupee,
//           'purple',
//         ],
//       ],
//       total: totalAmount,
//     }
//   }, [rows, tab])

//   function getColumns() {
//     const columns = {
//       'today-sales': [
//         ['Date', 'date'],
//         ['Sale ID', 'billNo'],
//         ['Customer', 'customer'],
//         ['Phone', 'phone'],
//         ['Payment', 'paymentMethod'],
//         ['Amount', 'amount'],
//       ],

//       purchases: [
//         ['Date', 'date'],
//         ['Invoice No', 'invoiceNo'],
//         ['Supplier', 'supplier'],
//         ['Amount', 'amount'],
//       ],

//       stock: [
//         ['Medicine', 'name'],
//         ['Brand', 'brand'],
//         ['Category', 'category'],
//         ['Batch', 'batchNo'],
//         ['Expiry', 'expiry'],
//         ['Stock', 'stock'],
//         ['Sale Price', 'salePrice'],
//       ],

//       customers: [
//         ['Name', 'name'],
//         ['Phone', 'phone'],
//         ['Address', 'address'],
//         ['Bills', 'totalBills'],
//         ['Amount', 'totalAmount'],
//         ['Last Sale', 'lastSale'],
//       ],

//       suppliers: [
//         ['Supplier', 'name'],
//         ['Contact', 'contact'],
//         ['Email', 'email'],
//         ['Purchases', 'totalPurchases'],
//         ['Amount', 'totalAmount'],
//         ['Last Purchase', 'lastPurchase'],
//       ],

//       expiry: [
//         ['Medicine', 'name'],
//         ['Batch', 'batchNo'],
//         ['Expiry', 'expiry'],
//         ['Stock', 'stock'],
//         ['Category', 'category'],
//       ],

//       amount: [
//         ['Date', 'date'],
//         ['Sale ID', 'billNo'],
//         ['Customer', 'customer'],
//         ['Subtotal', 'subtotal'],
//         ['Discount', 'discount'],
//         ['Payment', 'paymentMethod'],
//         ['Amount', 'amount'],
//       ],

//       'low-stock': [
//         ['Medicine', 'name'],
//         ['Brand', 'brand'],
//         ['Category', 'category'],
//         ['Stock', 'stock'],
//         ['Sale Price', 'salePrice'],
//       ],

//       returns: [
//         ['Date', 'date'],
//         ['Credit Note', 'returnNo'],
//         ['Sale ID', 'billNo'],
//         ['Customer', 'customer'],
//         ['Reason', 'reason'],
//         ['Amount', 'amount'],
//       ],

//       payments: [
//         ['Payment Method', 'paymentMethod'],
//         ['Transactions', 'count'],
//         ['Amount', 'amount'],
//       ],

//       'sales-items': [
//         ['Medicine', 'product'],
//         ['Quantity', 'quantity'],
//         ['Amount', 'amount'],
//       ],
//     }

//     return columns[tab] || []
//   }

//   function displayValue(key, value) {
//     if (value === null || value === undefined || value === '') {
//       return '-'
//     }

//     if (['date', 'expiry', 'lastSale', 'lastPurchase'].includes(key)) {
//       return formatDate(value)
//     }

//     if (
//       ['amount', 'totalAmount', 'subtotal', 'discount', 'salePrice'].includes(
//         key
//       )
//     ) {
//       return money(value)
//     }

//     return String(value)
//   }

//   async function exportExcel() {
//     if (!rows.length) {
//       return alert('No report data available to export.')
//     }

//     const XLSX = await import('xlsx')
//     const columns = getColumns()

//     const data = rows.map((row, index) => {
//       const item = { '#': index + 1 }

//       columns.forEach(([label, key]) => {
//         item[label] = displayValue(key, row[key])
//       })

//       return item
//     })

//     const ws = XLSX.utils.json_to_sheet(data)
//     const wb = XLSX.utils.book_new()

//     XLSX.utils.book_append_sheet(wb, ws, report.label.slice(0, 31))

//     XLSX.writeFile(wb, `City-Care-${report.key}-${from}-to-${to}.xlsx`)
//   }

//   async function generatePdf() {
//     if (!rows.length) {
//       return alert('No report data available to generate PDF.')
//     }

//     setGeneratingPdf(true)

//     try {
//       const { jsPDF } = await import('jspdf')
//       const autoTableModule = await import('jspdf-autotable')

//       const autoTable = autoTableModule.default || autoTableModule.autoTable

//       const doc = new jsPDF('p', 'mm', 'a4')

//       const columns = getColumns()

//       const head = [['#', ...columns.map(([label]) => label)]]

//       const body = rows.map((row, index) => [
//         index + 1,
//         ...columns.map(([, key]) => displayValue(key, row[key])),
//       ])

//       doc.setFontSize(18)
//       doc.setFont('helvetica', 'bold')

//       doc.text('City Care Hospital', 105, 15, { align: 'center' })

//       doc.setFontSize(12)

//       doc.text(report.label, 105, 23, { align: 'center' })

//       doc.setFontSize(9)

//       doc.text(`From: ${from}   To: ${to}`, 105, 29, { align: 'center' })

//       autoTable(doc, {
//         head,
//         body,
//         startY: 35,
//         theme: 'grid',
//         styles: {
//           fontSize: 7,
//           cellPadding: 2,
//         },
//         headStyles: {
//           fillColor: [22, 137, 232],
//         },
//       })

//       doc.save(`City-Care-${report.key}-report.pdf`)
//     } catch (error) {
//       console.error(error)
//       alert('Unable to generate PDF.')
//     } finally {
//       setGeneratingPdf(false)
//     }
//   }

//   function resetFilters() {
//     setFrom(DEFAULT_FROM)
//     setTo(DEFAULT_TO)
//   }

//   const columns = getColumns()

//   const detailSubtitle = selected
//     ? selected.name ||
//       selected.customer ||
//       selected.supplier ||
//       selected.product ||
//       selected.billNo ||
//       selected.invoiceNo ||
//       selected.returnNo ||
//       selected.paymentMethod ||
//       ''
//     : ''

//   return (
//     <div className="space-y-3">

//       {/* Page Title */}
//       <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
//         Reports
//       </h2>

//       <div className="bg-white rounded-xl border border-[#D7EBFF] shadow-[0_5px_20px_rgba(30,136,229,0.07)] p-3 sm:p-4">

//         {/* Report Tabs */}
//         <div className="flex gap-1 overflow-x-auto pb-2 border-b border-[#E5F1FB]">
//           {REPORTS.map((item) => {
//             const Icon = item.icon

//             return (
//               <button
//                 key={item.key}
//                 onClick={() => setTab(item.key)}
//                 className={`shrink-0 px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
//                   tab === item.key
//                     ? 'bg-[#1689E8] text-white shadow-[0_3px_10px_rgba(22,137,232,0.22)]'
//                     : 'text-[#526274] hover:border hover:border-[#CBE7FB]'
//                 }`}
//               >
//                 <Icon size={14} />
//                 {item.label}
//               </button>
//             )
//           })}
//         </div>

//         {/* Date + Action Section */}
//         <div className="flex flex-col lg:flex-row lg:items-end gap-4 py-4 border-b border-[#E5F1FB]">

//           {/* Date Filters */}
//           <div className="flex flex-wrap items-end gap-3">

//             {/* From Date */}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-bold text-[#526274]">
//                 From Date
//               </label>

//               <input
//                 type="date"
//                 value={from}
//                 onChange={(e) => setFrom(e.target.value)}
//                 className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
//               />
//             </div>

//             {/* To Date */}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-xs font-bold text-[#526274]">
//                 To Date
//               </label>

//               <input
//                 type="date"
//                 value={to}
//                 onChange={(e) => setTo(e.target.value)}
//                 className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
//               />
//             </div>

//             {/* Reset */}
//             <button
//               onClick={resetFilters}
//               className="h-10 px-4 rounded-lg border border-[#CBE7FB] bg-white text-xs font-bold text-[#1689E8] hover:bg-[#F3F9FF] transition"
//             >
//               Reset
//             </button>

//             {/* Refresh */}
//             <button
//               onClick={loadReport}
//               className="h-10 px-4 rounded-lg bg-[#1689E8] text-white border border-[#1689E8] text-xs font-bold hover:bg-[#1178D0] transition"
//             >
//               Refresh
//             </button>
//           </div>

//           {/* Export Buttons */}
//           <div className="lg:ml-auto flex flex-wrap gap-2">

//             <button
//               onClick={exportExcel}
//               className="h-10 px-4 rounded-lg bg-[#EAF8F1] text-[#18A86F] border border-[#BFE8D3] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#DDF5EA] transition"
//             >
//               <FileSpreadsheet size={15} />
//               Excel
//             </button>

//             <button
//               onClick={generatePdf}
//               disabled={generatingPdf}
//               className="h-10 px-4 rounded-lg bg-[#EDF6FD] text-[#1689E8] border border-[#CBE7FB] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E3F2FD] transition disabled:opacity-60"
//             >
//               <FileText size={15} />

//               {generatingPdf ? 'Generating...' : 'Generate PDF'}
//             </button>

//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
//           {reportInfo.cards.map(([label, value, Icon, type]) => (
//             <SummaryCard
//               key={label}
//               label={label}
//               value={value}
//               icon={Icon}
//               type={type}
//             />
//           ))}
//         </div>

//         {/* Report Table */}
//         <div className="overflow-x-auto">

//           <table className="w-full min-w-[700px] text-xs">

//             <thead>
//               <tr className="bg-[#F3F8FD] text-left">

//                 <th className="px-3 py-3 font-bold text-[#526274]">#</th>

//                 {columns.map(([label]) => (
//                   <th
//                     key={label}
//                     className="px-3 py-3 font-bold text-[#526274]"
//                   >
//                     {label}
//                   </th>
//                 ))}

//                 <th className="px-3 py-3 font-bold text-[#526274] text-center">
//                   Action
//                 </th>

//               </tr>
//             </thead>

//             <tbody>

//               {loading ? (
//                 <tr>
//                   <td
//                     colSpan={columns.length + 2}
//                     className="text-center py-8 text-slate-400"
//                   >
//                     Loading report...
//                   </td>
//                 </tr>
//               ) : rows.length ? (
//                 rows.map((row, index) => (
//                   <tr
//                     key={
//                       row.id ||
//                       row.billNo ||
//                       row.invoiceNo ||
//                       row.productId ||
//                       `${index}`
//                     }
//                     className="border-b border-[#EEF2F6] hover:bg-[#F8FBFE]"
//                   >

//                     <td className="px-3 py-3 text-slate-500">{index + 1}</td>

//                     {columns.map(([label, key]) => (
//                       <td
//                         key={label}
//                         className="px-3 py-3 text-[#17212B] font-medium"
//                       >
//                         {displayValue(key, row[key])}
//                       </td>
//                     ))}

//                     {/* Action: view details */}
//                     <td className="px-3 py-2 text-center">
//                       <button
//                         type="button"
//                         onClick={() => openDetail(row)}
//                         title="View details"
//                         aria-label="View details"
//                         className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-[#EDF6FD] text-[#1689E8] border border-[#CBE7FB] hover:bg-[#1689E8] hover:text-white hover:shadow-[0_3px_10px_rgba(22,137,232,0.30)] transition-all"
//                       >
//                         <Eye size={15} />
//                       </button>
//                     </td>

//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={columns.length + 2}
//                     className="text-center py-8 text-slate-400"
//                   >
//                     No data available.
//                   </td>
//                 </tr>
//               )}

//             </tbody>

//             {reportInfo.total > 0 && (
//               <tfoot>
//                 <tr>

//                   <td
//                     colSpan={Math.max(1, columns.length)}
//                     className="px-3 py-3 text-right font-bold text-[#17212B]"
//                   >
//                     Total Amount :
//                   </td>

//                   <td className="px-3 py-3 font-bold text-[#1689E8]">
//                     {money(reportInfo.total)}
//                   </td>

//                   <td />

//                 </tr>
//               </tfoot>
//             )}

//           </table>
//         </div>

//       </div>

//       {/* Details window */}
//       {selected && (
//         <DetailModal
//           title={`${report.label} Details`}
//           subtitle={detailSubtitle}
//           loading={detailLoading}
//           notice={detailNotice}
//           data={detail || selected}
//           onClose={closeDetail}
//         />
//       )}
//     </div>
//   )
// }



import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FileText,
  FileSpreadsheet,
  ShoppingCart,
  Package,
  AlertTriangle,
  IndianRupee,
  Receipt,
  Boxes,
  CalendarDays,
  Users,
  Truck,
  CreditCard,
  RotateCcw,
  Eye,
  X,
  Loader2,
  Info,
  MessageCircle,
} from 'lucide-react'

import * as api from '../services/api'
import { getReports } from '../services/api'

const WHATSAPP_NUMBER = '919250048457'

const REPORTS = [
  { key: 'today-sales', label: "Today's Sales", icon: Receipt },
  { key: 'purchases', label: 'Purchases', icon: ShoppingCart },
  { key: 'stock', label: 'Stock', icon: Boxes },
  { key: 'customers', label: 'Customers', icon: Users },
  { key: 'suppliers', label: 'Suppliers', icon: Truck },
  { key: 'expiry', label: 'Expiry', icon: CalendarDays },
  { key: 'amount', label: 'Amount', icon: IndianRupee },
  { key: 'low-stock', label: 'Low Stock', icon: AlertTriangle },
  { key: 'returns', label: 'Returns', icon: RotateCcw },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'sales-items', label: 'Medicine Sales', icon: Package },
]

const DETAIL_TYPES = {
  'today-sales': 'sale',
  amount: 'sale',
  purchases: 'purchase',
  stock: 'medicine',
  expiry: 'medicine',
  'low-stock': 'medicine',
  customers: 'customer',
  suppliers: 'supplier',
  returns: 'return',
}

function getRowId(row) {
  return (
    row?.id ??
    row?._id ??
    row?.productId ??
    row?.billNo ??
    row?.invoiceNo ??
    row?.returnNo
  )
}

const TODAY = new Date()

const DEFAULT_FROM = `${TODAY.getFullYear()}-${String(
  TODAY.getMonth() + 1
).padStart(2, '0')}-01`

const DEFAULT_TO = `${TODAY.getFullYear()}-${String(
  TODAY.getMonth() + 1
).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`

const HIDDEN_KEYS = new Set([
  'id',
  '_id',
  '__v',
  'password',
  'passwordHash',
  'token',
])

const MONEY_KEYS = new Set([
  'amount',
  'totalAmount',
  'subtotal',
  'discount',
  'salePrice',
  'purchasePrice',
  'price',
  'unitPrice',
  'mrp',
  'total',
  'tax',
  'gst',
  'netAmount',
  'grandTotal',
  'paid',
  'paidAmount',
  'due',
  'dueAmount',
  'balance',
  'refundAmount',
  'discountAmount',
  'taxAmount',
  'lineTotal',
])

const DATE_KEYS = new Set([
  'date',
  'expiry',
  'lastSale',
  'lastPurchase',
  'createdAt',
  'updatedAt',
  'saleDate',
  'purchaseDate',
  'returnDate',
  'mfgDate',
  'dob',
])

const LABELS = {
  billNo: 'Sale ID',
  returnNo: 'Credit Note',
  invoiceNo: 'Invoice No',
  paymentMethod: 'Payment',
  totalBills: 'Total Bills',
  totalPurchases: 'Total Purchases',
  batchNo: 'Batch',
  mrp: 'MRP',
  gst: 'GST',
}

function prettyLabel(key) {
  if (LABELS[key]) return LABELS[key]

  return key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function money(value) {
  return `₹ ${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === '') return '-'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) return value.join(', ') || '-'
  if (typeof value === 'object') return JSON.stringify(value)

  if (DATE_KEYS.has(key) || /(Date|At)$/.test(key)) {
    return formatDate(value)
  }

  if (
    /(Percent|Percentage)$/.test(key) &&
    Number.isFinite(Number(value))
  ) {
    return `${value}%`
  }

  if (MONEY_KEYS.has(key) && Number.isFinite(Number(value))) {
    return money(value)
  }

  return String(value)
}

function splitDetail(data) {
  const fields = []
  const objects = []
  const lists = []

  Object.entries(data || {}).forEach(([key, value]) => {
    if (HIDDEN_KEYS.has(key) || value === undefined) return

    if (
      Array.isArray(value) &&
      (value.length === 0 ||
        (typeof value[0] === 'object' && value[0] !== null))
    ) {
      lists.push([key, value])
    } else if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      objects.push([key, value])
    } else {
      fields.push([key, value])
    }
  })

  return { fields, objects, lists }
}

function FieldGrid({ entries }) {
  if (!entries.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {entries.map(([key, value]) => (
        <div key={key} className="min-w-0">
          <p className="text-[11px] font-semibold text-[#7B93AA]">
            {prettyLabel(key)}
          </p>
          <p className="text-[13px] font-semibold text-[#17212B] mt-0.5 break-words">
            {formatValue(key, value)}
          </p>
        </div>
      ))}
    </div>
  )
}

function DetailTable({ rows }) {
  const cols = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row || {}).forEach((key) => {
        if (!HIDDEN_KEYS.has(key)) set.add(key)
      })
      return set
    }, new Set())
  )

  if (!rows.length) {
    return (
      <p className="text-[12px] text-slate-400 py-4 text-center">
        No records found.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E1EEF9]">
      <table className="w-full min-w-[520px] text-xs">
        <thead>
          <tr className="bg-[#F3F8FD] text-left">
            <th className="px-3 py-2.5 font-bold text-[#526274]">#</th>
            {cols.map((col) => (
              <th
                key={col}
                className="px-3 py-2.5 font-bold text-[#526274] whitespace-nowrap"
              >
                {prettyLabel(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-t border-[#EEF2F6] hover:bg-[#F8FBFE]"
            >
              <td className="px-3 py-2.5 text-slate-500">
                {index + 1}
              </td>
              {cols.map((col) => (
                <td
                  key={col}
                  className={`px-3 py-2.5 font-medium text-[#17212B] ${
                    typeof row?.[col] === 'number' ? 'text-right' : ''
                  }`}
                >
                  {formatValue(col, row?.[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DetailModal({
  title,
  subtitle,
  loading,
  notice,
  data,
  onClose,
}) {
  const { fields, objects, lists } = useMemo(
    () => splitDetail(data),
    [data]
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#071A36]/55 backdrop-blur-sm sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl max-h-[92dvh] sm:max-h-[88vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl border border-[#D7EBFF] shadow-[0_25px_70px_rgba(7,26,54,0.35)] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4 border-b border-[#E5F1FB] bg-gradient-to-r from-[#F3F9FF] to-white">
          <div className="w-10 h-10 rounded-xl bg-[#1689E8] text-white flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(22,137,232,0.35)]">
            <Eye size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-bold text-[#123B66] truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[12px] text-[#6B86A5] truncate">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#526274] hover:bg-[#EDF6FD] hover:text-[#1689E8] transition"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-5">
          {notice && (
            <div className="flex items-start gap-2 rounded-xl border border-[#F3D9A4] bg-[#FFF8E8] px-3 py-2.5 text-[12px] text-[#8A5A00]">
              <Info size={15} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <div className="rounded-xl border border-[#E1EEF9] bg-[#FAFCFE] p-4">
            <FieldGrid entries={fields} />
          </div>

          {objects.map(([key, value]) => (
            <div key={key}>
              <h4 className="text-[12px] font-bold text-[#123B66] mb-2">
                {prettyLabel(key)}
              </h4>
              <div className="rounded-xl border border-[#E1EEF9] bg-[#FAFCFE] p-4">
                <FieldGrid
                  entries={Object.entries(value).filter(
                    ([field]) => !HIDDEN_KEYS.has(field)
                  )}
                />
              </div>
            </div>
          ))}

          {lists.map(([key, value]) => (
            <div key={key}>
              <h4 className="text-[12px] font-bold text-[#123B66] mb-2">
                {prettyLabel(key)}{' '}
                <span className="text-[#7B93AA] font-semibold">
                  ({value.length})
                </span>
              </h4>
              <DetailTable rows={value} />
            </div>
          ))}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-4 text-[12px] text-[#6B86A5]">
              <Loader2 size={16} className="animate-spin" />
              Loading full details...
            </div>
          )}
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-[#E5F1FB] flex justify-end bg-white">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-lg bg-[#1689E8] text-white text-xs font-bold hover:bg-[#1178D0] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ icon: Icon, label, value, type }) {
  const styles = {
    blue: {
      box: 'bg-[#EDF6FD] border-[#1689E8]/60 shadow-[0_0_10px_rgba(22,137,232,0.18)]',
      icon: 'bg-[#1689E8]',
      value: 'text-[#071d42]',
    },
    green: {
      box: 'bg-[#EAF8F1] border-[#18B878]/60 shadow-[0_0_10px_rgba(24,184,120,0.18)]',
      icon: 'bg-[#18B878]',
      value: 'text-green-700',
    },
    orange: {
      box: 'bg-[#FFF3DE] border-[#F3A315]/65 shadow-[0_0_12px_rgba(243,163,21,0.24)]',
      icon: 'bg-[#F3A315]',
      value: 'text-orange-700',
    },
    purple: {
      box: 'bg-[#F6EEFD] border-[#792CE0]/60 shadow-[0_0_10px_rgba(121,44,224,0.18)]',
      icon: 'bg-[#792CE0]',
      value: 'text-purple-700',
    },
    red: {
      box: 'bg-[#FFF0F1] border-[#EF4148]/60 shadow-[0_0_10px_rgba(239,65,72,0.18)]',
      icon: 'bg-[#EF4148]',
      value: 'text-red-700',
    },
  }

  const style = styles[type] || styles.blue

  return (
    <div
      className={`rounded-xl border p-4 flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 ${style.box}`}
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white ${style.icon}`}
      >
        <Icon size={21} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={`text-xl font-bold mt-0.5 truncate ${style.value}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

function getTodayString(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

function getReportRows(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  if (Array.isArray(data?.rows)) return data.rows
  return []
}

function getReportAmount(row) {
  return (
    Number(
      row?.amount ??
        row?.totalAmount ??
        row?.grandTotal ??
        row?.netAmount ??
        row?.total ??
        0
    ) || 0
  )
}

function totalReportAmount(rows) {
  return rows.reduce((sum, row) => sum + getReportAmount(row), 0)
}

function formatReportMoney(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function Reports() {
  const [tab, setTab] = useState(REPORTS[0].key)
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false)

  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailNotice, setDetailNotice] = useState('')
  const detailReq = useRef(0)

  const report = REPORTS.find((item) => item.key === tab) || REPORTS[0]

  useEffect(() => {
    loadReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, from, to])

  useEffect(() => {
    if (!selected) return

    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail()
    }

    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  async function loadReport() {
    setLoading(true)

    try {
      const params =
        tab === 'today-sales' ||
        tab === 'stock' ||
        tab === 'customers' ||
        tab === 'suppliers' ||
        tab === 'expiry' ||
        tab === 'low-stock'
          ? {}
          : { from, to }

      const data = await getReports(tab, params)
      setRows(getReportRows(data))
    } catch (error) {
      console.error('Unable to load report:', error)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  async function openDetail(row) {
    const requestId = ++detailReq.current

    setSelected(row)
    setDetail(row)
    setDetailLoading(false)
    setDetailNotice('')

    const kind = DETAIL_TYPES[tab]
    const id = getRowId(row)

    if (!kind || id === undefined || id === null) return

    if (typeof api.getReportDetail !== 'function') {
      setDetailNotice(
        'Showing summary data only. Connect the detail API to see items, prices, discounts and address.'
      )
      return
    }

    setDetailLoading(true)

    try {
      const res = await api.getReportDetail(kind, id)

      if (requestId !== detailReq.current) return

      const payload =
        res?.data &&
        typeof res.data === 'object' &&
        !Array.isArray(res.data)
          ? res.data
          : res

      setDetail({ ...row, ...(payload || {}) })
    } catch (error) {
      if (requestId !== detailReq.current) return

      console.error('Unable to load details:', error)
      setDetailNotice('Could not load full details. Showing summary data.')
    } finally {
      if (requestId === detailReq.current) setDetailLoading(false)
    }
  }

  function closeDetail() {
    detailReq.current += 1
    setSelected(null)
    setDetail(null)
    setDetailLoading(false)
    setDetailNotice('')
  }

  const reportInfo = useMemo(() => {
    const totalAmount = rows.reduce(
      (sum, row) => sum + Number(row.amount || row.totalAmount || 0),
      0
    )

    const quantity = rows.reduce(
      (sum, row) =>
        sum + Number(row.quantity || row.stock || row.itemQuantity || 0),
      0
    )

    if (tab === 'stock') {
      const stock = rows.reduce(
        (sum, row) => sum + Number(row.stock || 0),
        0
      )
      const low = rows.filter((row) => Number(row.stock || 0) <= 20).length

      return {
        cards: [
          ['Total Medicines', rows.length, Package, 'blue'],
          ['Total Stock', stock.toLocaleString('en-IN'), Boxes, 'green'],
          ['Low Stock', low, AlertTriangle, 'orange'],
          [
            'Stock Value',
            money(
              rows.reduce(
                (sum, row) =>
                  sum +
                  Number(row.purchasePrice || 0) * Number(row.stock || 0),
                0
              )
            ),
            IndianRupee,
            'purple',
          ],
        ],
        total: 0,
      }
    }

    if (tab === 'customers') {
      return {
        cards: [
          ['Customers', rows.length, Users, 'blue'],
          [
            'Total Bills',
            rows.reduce((sum, row) => sum + Number(row.totalBills || 0), 0),
            Receipt,
            'green',
          ],
          [
            'Customer Amount',
            money(rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0)),
            IndianRupee,
            'purple',
          ],
          [
            'Active Records',
            rows.filter((row) => row.totalBills > 0).length,
            Users,
            'orange',
          ],
        ],
        total: rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0),
      }
    }

    if (tab === 'suppliers') {
      return {
        cards: [
          ['Suppliers', rows.length, Truck, 'blue'],
          [
            'Purchase Bills',
            rows.reduce((sum, row) => sum + Number(row.totalPurchases || 0), 0),
            Receipt,
            'green',
          ],
          [
            'Purchase Amount',
            money(rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0)),
            IndianRupee,
            'purple',
          ],
          [
            'Active Suppliers',
            rows.filter((row) => row.totalPurchases > 0).length,
            Truck,
            'orange',
          ],
        ],
        total: rows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0),
      }
    }

    if (tab === 'expiry') {
      const expired = rows.filter(
        (row) => row.expiry && new Date(row.expiry) < new Date()
      ).length

      return {
        cards: [
          ['Expiry Items', rows.length, CalendarDays, 'blue'],
          ['Expired', expired, AlertTriangle, 'red'],
          ['Expiring', rows.length - expired, CalendarDays, 'orange'],
          ['Stock In Expiry', quantity, Boxes, 'green'],
        ],
        total: 0,
      }
    }

    if (tab === 'low-stock') {
      return {
        cards: [
          ['Low Stock Items', rows.length, AlertTriangle, 'orange'],
          ['Total Units', quantity, Boxes, 'blue'],
          [
            'Critical',
            rows.filter((row) => Number(row.stock) <= 15).length,
            AlertTriangle,
            'red',
          ],
          ['Medicines', rows.length, Package, 'purple'],
        ],
        total: 0,
      }
    }

    if (tab === 'payments') {
      return {
        cards: [
          ['Payment Types', rows.length, CreditCard, 'blue'],
          [
            'Transactions',
            rows.reduce((sum, row) => sum + Number(row.count || 0), 0),
            Receipt,
            'green',
          ],
          ['Collected', money(totalAmount), IndianRupee, 'purple'],
          [
            'Online + Check',
            money(
              rows
                .filter((row) => row.paymentMethod !== 'Cash')
                .reduce((sum, row) => sum + Number(row.amount || 0), 0)
            ),
            CreditCard,
            'orange',
          ],
        ],
        total: totalAmount,
      }
    }

    if (tab === 'sales-items') {
      return {
        cards: [
          ['Medicines Sold', rows.length, Package, 'blue'],
          ['Units Sold', quantity, Boxes, 'green'],
          ['Sales Amount', money(totalAmount), IndianRupee, 'purple'],
          ['Top Line', rows[0]?.product || '-', ShoppingCart, 'orange'],
        ],
        total: totalAmount,
      }
    }

    return {
      cards: [
        ['Total Amount', money(totalAmount), IndianRupee, 'blue'],
        ['Total Records', rows.length, Receipt, 'green'],
        ['Total Quantity', quantity || '-', Boxes, 'orange'],
        [
          'Average',
          money(rows.length ? totalAmount / rows.length : 0),
          IndianRupee,
          'purple',
        ],
      ],
      total: totalAmount,
    }
  }, [rows, tab])

  function getColumns() {
    const columns = {
      'today-sales': [
        ['Date', 'date'],
        ['Sale ID', 'billNo'],
        ['Customer', 'customer'],
        ['Phone', 'phone'],
        ['Payment', 'paymentMethod'],
        ['Amount', 'amount'],
      ],
      purchases: [
        ['Date', 'date'],
        ['Invoice No', 'invoiceNo'],
        ['Supplier', 'supplier'],
        ['Amount', 'amount'],
      ],
      stock: [
        ['Medicine', 'name'],
        ['Brand', 'brand'],
        ['Category', 'category'],
        ['Batch', 'batchNo'],
        ['Expiry', 'expiry'],
        ['Stock', 'stock'],
        ['Sale Price', 'salePrice'],
      ],
      customers: [
        ['Name', 'name'],
        ['Phone', 'phone'],
        ['Address', 'address'],
        ['Bills', 'totalBills'],
        ['Amount', 'totalAmount'],
        ['Last Sale', 'lastSale'],
      ],
      suppliers: [
        ['Supplier', 'name'],
        ['Contact', 'contact'],
        ['Email', 'email'],
        ['Purchases', 'totalPurchases'],
        ['Amount', 'totalAmount'],
        ['Last Purchase', 'lastPurchase'],
      ],
      expiry: [
        ['Medicine', 'name'],
        ['Batch', 'batchNo'],
        ['Expiry', 'expiry'],
        ['Stock', 'stock'],
        ['Category', 'category'],
      ],
      amount: [
        ['Date', 'date'],
        ['Sale ID', 'billNo'],
        ['Customer', 'customer'],
        ['Subtotal', 'subtotal'],
        ['Discount', 'discount'],
        ['Payment', 'paymentMethod'],
        ['Amount', 'amount'],
      ],
      'low-stock': [
        ['Medicine', 'name'],
        ['Brand', 'brand'],
        ['Category', 'category'],
        ['Stock', 'stock'],
        ['Sale Price', 'salePrice'],
      ],
      returns: [
        ['Date', 'date'],
        ['Credit Note', 'returnNo'],
        ['Sale ID', 'billNo'],
        ['Customer', 'customer'],
        ['Reason', 'reason'],
        ['Amount', 'amount'],
      ],
      payments: [
        ['Payment Method', 'paymentMethod'],
        ['Transactions', 'count'],
        ['Amount', 'amount'],
      ],
      'sales-items': [
        ['Medicine', 'product'],
        ['Quantity', 'quantity'],
        ['Amount', 'amount'],
      ],
    }

    return columns[tab] || []
  }

  function displayValue(key, value) {
    if (value === null || value === undefined || value === '') return '-'

    if (['date', 'expiry', 'lastSale', 'lastPurchase'].includes(key)) {
      return formatDate(value)
    }

    if (
      ['amount', 'totalAmount', 'subtotal', 'discount', 'salePrice'].includes(
        key
      )
    ) {
      return money(value)
    }

    return String(value)
  }

  async function exportExcel() {
    if (!rows.length) {
      return alert('No report data available to export.')
    }

    try {
      const XLSX = await import('xlsx')
      const columns = getColumns()

      const data = rows.map((row, index) => {
        const item = { '#': index + 1 }

        columns.forEach(([label, key]) => {
          item[label] = displayValue(key, row[key])
        })

        return item
      })

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, report.label.slice(0, 31))
      XLSX.writeFile(wb, `City-Care-${report.key}-${from}-to-${to}.xlsx`)
    } catch (error) {
      console.error('Unable to export Excel:', error)
      alert('Unable to export Excel. Please try again.')
    }
  }

  async function generatePdf() {
    if (!rows.length) {
      return alert('No report data available to generate PDF.')
    }

    setGeneratingPdf(true)

    try {
      const { jsPDF } = await import('jspdf')
      const autoTableModule = await import('jspdf-autotable')
      const autoTable =
        autoTableModule.default || autoTableModule.autoTable

      const doc = new jsPDF('p', 'mm', 'a4')
      const columns = getColumns()
      const head = [['#', ...columns.map(([label]) => label)]]

      const body = rows.map((row, index) => [
        index + 1,
        ...columns.map(([, key]) => displayValue(key, row[key])),
      ])

      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('City Care Hospital', 105, 15, { align: 'center' })

      doc.setFontSize(12)
      doc.text(report.label, 105, 23, { align: 'center' })

      doc.setFontSize(9)
      doc.text(`From: ${from}   To: ${to}`, 105, 29, {
        align: 'center',
      })

      autoTable(doc, {
        head,
        body,
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 7,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [22, 137, 232],
        },
      })

      doc.save(`City-Care-${report.key}-report.pdf`)
    } catch (error) {
      console.error('Unable to generate PDF:', error)
      alert('Unable to generate PDF.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  async function sendTodayWhatsAppReport() {
    if (sendingWhatsApp) return

    setSendingWhatsApp(true)

    try {
      const now = new Date()
      const today = getTodayString(now)

      // Fetch all four summaries from the existing reports API.
      const [salesResult, purchasesResult, returnsResult, paymentsResult] =
        await Promise.all([
          getReports('today-sales', {}),
          getReports('purchases', { from: today, to: today }),
          getReports('returns', { from: today, to: today }),
          getReports('payments', { from: today, to: today }),
        ])

      const sales = getReportRows(salesResult)
      const purchases = getReportRows(purchasesResult)
      const returns = getReportRows(returnsResult)
      const payments = getReportRows(paymentsResult)

      const dateLabel = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })

      const message = [
        '*Narayan Hospital*',
        '*DAILY ACTIVITY REPORT*',
        `Date: ${dateLabel}`,
        '',
        '*SALES*',
        `Bills / Records: ${sales.length}`,
        `Sales Total: ${formatReportMoney(totalReportAmount(sales))}`,
        '',
        '*PURCHASES*',
        `Purchase Records: ${purchases.length}`,
        `Purchase Total: ${formatReportMoney(totalReportAmount(purchases))}`,
        '',
        '*RETURNS*',
        `Return Records: ${returns.length}`,
        `Return Total: ${formatReportMoney(totalReportAmount(returns))}`,
        '',
        '*PAYMENTS SUMMARY*',
        ...(payments.length
          ? payments.map((row) => {
              const method =
                row.paymentMethod || row.payment_method || 'Other'
              const count = Number(row.count || row.transactions || 0)
              return `${method}: ${formatReportMoney(
                getReportAmount(row)
              )} (${count} transactions)`
            })
          : ['No payment summary available.']),
        '',
        '_Report generated from City Care Hospital Reports._',
      ].join('\n')

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`

      // Open WhatsApp with the report prefilled; the user confirms Send.
      const opened = window.open(
        whatsappUrl,
        '_blank',
        'noopener,noreferrer'
      )

      if (!opened) {
        window.location.href = whatsappUrl
      }
    } catch (error) {
      console.error('Unable to prepare WhatsApp report:', error)
      alert(
        "Unable to prepare today's report. Please check your connection and try again."
      )
    } finally {
      setSendingWhatsApp(false)
    }
  }

  function resetFilters() {
    setFrom(DEFAULT_FROM)
    setTo(DEFAULT_TO)
  }

  const columns = getColumns()

  const detailSubtitle = selected
    ? selected.name ||
      selected.customer ||
      selected.supplier ||
      selected.product ||
      selected.billNo ||
      selected.invoiceNo ||
      selected.returnNo ||
      selected.paymentMethod ||
      ''
    : ''

  return (
    <div className="space-y-3">
      <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
        Reports
      </h2>

      <div className="bg-white rounded-xl border border-[#D7EBFF] shadow-[0_5px_20px_rgba(30,136,229,0.07)] p-3 sm:p-4">
        <div className="flex gap-1 overflow-x-auto pb-2 border-b border-[#E5F1FB]">
          {REPORTS.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                className={`shrink-0 px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                  tab === item.key
                    ? 'bg-[#1689E8] text-white shadow-[0_3px_10px_rgba(22,137,232,0.22)]'
                    : 'text-[#526274] hover:border hover:border-[#CBE7FB]'
                }`}
              >
                <Icon size={14} />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end gap-4 py-4 border-b border-[#E5F1FB]">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#526274]">
                From Date
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#526274]">
                To Date
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
              />
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="h-10 px-4 rounded-lg border border-[#CBE7FB] bg-white text-xs font-bold text-[#1689E8] hover:bg-[#F3F9FF] transition"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={loadReport}
              className="h-10 px-4 rounded-lg bg-[#1689E8] text-white border border-[#1689E8] text-xs font-bold hover:bg-[#1178D0] transition"
            >
              Refresh
            </button>
          </div>

          <div className="lg:ml-auto flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportExcel}
              className="h-10 px-4 rounded-lg bg-[#EAF8F1] text-[#18A86F] border border-[#BFE8D3] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#DDF5EA] transition"
            >
              <FileSpreadsheet size={15} />
              Excel
            </button>

            <button
              type="button"
              onClick={generatePdf}
              disabled={generatingPdf}
              className="h-10 px-4 rounded-lg bg-[#EDF6FD] text-[#1689E8] border border-[#CBE7FB] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E3F2FD] transition disabled:opacity-60"
            >
              {generatingPdf ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <FileText size={15} />
              )}
              {generatingPdf ? 'Generating...' : 'Generate PDF'}
            </button>

            <button
              type="button"
              onClick={sendTodayWhatsAppReport}
              disabled={sendingWhatsApp}
              className="h-10 px-4 rounded-lg bg-[#E8F9EF] text-[#128C4A] border border-[#A9E7BF] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#D5F4E1] transition disabled:opacity-60"
            >
              {sendingWhatsApp ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <MessageCircle size={15} />
              )}
              {sendingWhatsApp ? 'Preparing...' : 'WhatsApp Report'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
          {reportInfo.cards.map(([label, value, Icon, type]) => (
            <SummaryCard
              key={label}
              label={label}
              value={value}
              icon={Icon}
              type={type}
            />
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs">
            <thead>
              <tr className="bg-[#F3F8FD] text-left">
                <th className="px-3 py-3 font-bold text-[#526274]">#</th>
                {columns.map(([label]) => (
                  <th
                    key={label}
                    className="px-3 py-3 font-bold text-[#526274]"
                  >
                    {label}
                  </th>
                ))}
                <th className="px-3 py-3 font-bold text-[#526274] text-center">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="text-center py-8 text-slate-400"
                  >
                    Loading report...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((row, index) => (
                  <tr
                    key={
                      row.id ||
                      row.billNo ||
                      row.invoiceNo ||
                      row.productId ||
                      `${index}`
                    }
                    className="border-b border-[#EEF2F6] hover:bg-[#F8FBFE]"
                  >
                    <td className="px-3 py-3 text-slate-500">
                      {index + 1}
                    </td>

                    {columns.map(([label, key]) => (
                      <td
                        key={label}
                        className="px-3 py-3 text-[#17212B] font-medium"
                      >
                        {displayValue(key, row[key])}
                      </td>
                    ))}

                    <td className="px-3 py-2 text-center">
                      <button
                        type="button"
                        onClick={() => openDetail(row)}
                        title="View details"
                        aria-label="View details"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-lg bg-[#EDF6FD] text-[#1689E8] border border-[#CBE7FB] hover:bg-[#1689E8] hover:text-white hover:shadow-[0_3px_10px_rgba(22,137,232,0.30)] transition-all"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="text-center py-8 text-slate-400"
                  >
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>

            {reportInfo.total > 0 && (
              <tfoot>
                <tr>
                  <td
                    colSpan={Math.max(1, columns.length)}
                    className="px-3 py-3 text-right font-bold text-[#17212B]"
                  >
                    Total Amount:
                  </td>
                  <td className="px-3 py-3 font-bold text-[#1689E8]">
                    {money(reportInfo.total)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {selected && (
        <DetailModal
          title={`${report.label} Details`}
          subtitle={detailSubtitle}
          loading={detailLoading}
          notice={detailNotice}
          data={detail || selected}
          onClose={closeDetail}
        />
      )}
    </div>
  )
}

