import { useEffect, useMemo, useState } from 'react'
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
} from 'lucide-react'
import { getReports } from '../services/api'

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

const TODAY = new Date()

const DEFAULT_FROM = `${TODAY.getFullYear()}-${String(
  TODAY.getMonth() + 1
).padStart(2, '0')}-01`

const DEFAULT_TO = `${TODAY.getFullYear()}-${String(
  TODAY.getMonth() + 1
).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`

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
        <p
          className={`text-xl font-bold mt-0.5 truncate ${style.value}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
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

export default function Reports() {
  const [tab, setTab] = useState(REPORTS[0].key)
  const [from, setFrom] = useState(DEFAULT_FROM)
  const [to, setTo] = useState(DEFAULT_TO)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const report =
    REPORTS.find((item) => item.key === tab) || REPORTS[0]

  useEffect(() => {
    loadReport()
  }, [tab, from, to])

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

      setRows(Array.isArray(data) ? data : data?.data || [])
    } catch (error) {
      console.error('Unable to load report:', error)
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const reportInfo = useMemo(() => {
    const totalAmount = rows.reduce(
      (sum, row) =>
        sum + Number(row.amount || row.totalAmount || 0),
      0
    )

    const quantity = rows.reduce(
      (sum, row) =>
        sum +
        Number(
          row.quantity ||
            row.stock ||
            row.itemQuantity ||
            0
        ),
      0
    )

    if (tab === 'stock') {
      const stock = rows.reduce(
        (sum, row) => sum + Number(row.stock || 0),
        0
      )

      const low = rows.filter(
        (row) => Number(row.stock || 0) <= 20
      ).length

      return {
        cards: [
          ['Total Medicines', rows.length, Package, 'blue'],
          [
            'Total Stock',
            stock.toLocaleString('en-IN'),
            Boxes,
            'green',
          ],
          ['Low Stock', low, AlertTriangle, 'orange'],
          [
            'Stock Value',
            money(
              rows.reduce(
                (s, r) =>
                  s +
                  Number(r.purchasePrice || 0) *
                    Number(r.stock || 0),
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
            rows.reduce(
              (s, r) => s + Number(r.totalBills || 0),
              0
            ),
            Receipt,
            'green',
          ],
          [
            'Customer Amount',
            money(
              rows.reduce(
                (s, r) => s + Number(r.totalAmount || 0),
                0
              )
            ),
            IndianRupee,
            'purple',
          ],
          [
            'Active Records',
            rows.filter((r) => r.totalBills > 0).length,
            Users,
            'orange',
          ],
        ],
        total: rows.reduce(
          (s, r) => s + Number(r.totalAmount || 0),
          0
        ),
      }
    }

    if (tab === 'suppliers') {
      return {
        cards: [
          ['Suppliers', rows.length, Truck, 'blue'],
          [
            'Purchase Bills',
            rows.reduce(
              (s, r) => s + Number(r.totalPurchases || 0),
              0
            ),
            Receipt,
            'green',
          ],
          [
            'Purchase Amount',
            money(
              rows.reduce(
                (s, r) => s + Number(r.totalAmount || 0),
                0
              )
            ),
            IndianRupee,
            'purple',
          ],
          [
            'Active Suppliers',
            rows.filter((r) => r.totalPurchases > 0).length,
            Truck,
            'orange',
          ],
        ],
        total: rows.reduce(
          (s, r) => s + Number(r.totalAmount || 0),
          0
        ),
      }
    }

    if (tab === 'expiry') {
      const expired = rows.filter(
        (r) =>
          r.expiry &&
          new Date(r.expiry) < new Date()
      ).length

      return {
        cards: [
          ['Expiry Items', rows.length, CalendarDays, 'blue'],
          ['Expired', expired, AlertTriangle, 'red'],
          [
            'Expiring',
            rows.length - expired,
            CalendarDays,
            'orange',
          ],
          ['Stock In Expiry', quantity, Boxes, 'green'],
        ],
        total: 0,
      }
    }

    if (tab === 'low-stock') {
      return {
        cards: [
          [
            'Low Stock Items',
            rows.length,
            AlertTriangle,
            'orange',
          ],
          ['Total Units', quantity, Boxes, 'blue'],
          [
            'Critical',
            rows.filter(
              (r) => Number(r.stock) <= 15
            ).length,
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
          [
            'Payment Types',
            rows.length,
            CreditCard,
            'blue',
          ],
          [
            'Transactions',
            rows.reduce(
              (s, r) => s + Number(r.count || 0),
              0
            ),
            Receipt,
            'green',
          ],
          [
            'Collected',
            money(totalAmount),
            IndianRupee,
            'purple',
          ],
          [
            'Online + Check',
            money(
              rows
                .filter(
                  (r) => r.paymentMethod !== 'Cash'
                )
                .reduce(
                  (s, r) =>
                    s + Number(r.amount || 0),
                  0
                )
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
          [
            'Medicines Sold',
            rows.length,
            Package,
            'blue',
          ],
          [
            'Units Sold',
            quantity,
            Boxes,
            'green',
          ],
          [
            'Sales Amount',
            money(totalAmount),
            IndianRupee,
            'purple',
          ],
          [
            'Top Line',
            rows[0]?.product || '-',
            ShoppingCart,
            'orange',
          ],
        ],
        total: totalAmount,
      }
    }

    return {
      cards: [
        [
          'Total Amount',
          money(totalAmount),
          IndianRupee,
          'blue',
        ],
        [
          'Total Records',
          rows.length,
          Receipt,
          'green',
        ],
        [
          'Total Quantity',
          quantity || '-',
          Boxes,
          'orange',
        ],
        [
          'Average',
          money(
            rows.length
              ? totalAmount / rows.length
              : 0
          ),
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
    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-'
    }

    if (
      [
        'date',
        'expiry',
        'lastSale',
        'lastPurchase',
      ].includes(key)
    ) {
      return formatDate(value)
    }

    if (
      [
        'amount',
        'totalAmount',
        'subtotal',
        'discount',
        'salePrice',
      ].includes(key)
    ) {
      return money(value)
    }

    return String(value)
  }

  async function exportExcel() {
    if (!rows.length) {
      return alert(
        'No report data available to export.'
      )
    }

    const XLSX = await import('xlsx')
    const columns = getColumns()

    const data = rows.map((row, index) => {
      const item = { '#': index + 1 }

      columns.forEach(([label, key]) => {
        item[label] = displayValue(
          key,
          row[key]
        )
      })

      return item
    })

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      report.label.slice(0, 31)
    )

    XLSX.writeFile(
      wb,
      `City-Care-${report.key}-${from}-to-${to}.xlsx`
    )
  }

  async function generatePdf() {
    if (!rows.length) {
      return alert(
        'No report data available to generate PDF.'
      )
    }

    setGeneratingPdf(true)

    try {
      const { jsPDF } = await import('jspdf')
      const autoTableModule =
        await import('jspdf-autotable')

      const autoTable =
        autoTableModule.default ||
        autoTableModule.autoTable

      const doc = new jsPDF(
        'p',
        'mm',
        'a4'
      )

      const columns = getColumns()

      const head = [
        [
          '#',
          ...columns.map(([label]) => label),
        ],
      ]

      const body = rows.map(
        (row, index) => [
          index + 1,
          ...columns.map(
            ([, key]) =>
              displayValue(key, row[key])
          ),
        ]
      )

      doc.setFontSize(18)
      doc.setFont(
        'helvetica',
        'bold'
      )

      doc.text(
        'City Care Hospital',
        105,
        15,
        { align: 'center' }
      )

      doc.setFontSize(12)

      doc.text(
        report.label,
        105,
        23,
        { align: 'center' }
      )

      doc.setFontSize(9)

      doc.text(
        `From: ${from}   To: ${to}`,
        105,
        29,
        { align: 'center' }
      )

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

      doc.save(
        `City-Care-${report.key}-report.pdf`
      )
    } catch (error) {
      console.error(error)
      alert('Unable to generate PDF.')
    } finally {
      setGeneratingPdf(false)
    }
  }

  function resetFilters() {
    setFrom(DEFAULT_FROM)
    setTo(DEFAULT_TO)
  }

  const columns = getColumns()

  return (
    <div className="space-y-3">

      {/* Page Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
        Reports
      </h2>

      <div className="bg-white rounded-xl border border-[#D7EBFF] shadow-[0_5px_20px_rgba(30,136,229,0.07)] p-3 sm:p-4">

        {/* Report Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 border-b border-[#E5F1FB]">
          {REPORTS.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.key}
                onClick={() =>
                  setTab(item.key)
                }
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

        {/* Date + Action Section */}
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 py-4 border-b border-[#E5F1FB]">

          {/* Date Filters */}
          <div className="flex flex-wrap items-end gap-3">

            {/* From Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#526274]">
                From Date
              </label>

              <input
                type="date"
                value={from}
                onChange={(e) =>
                  setFrom(e.target.value)
                }
                className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#526274]">
                To Date
              </label>

              <input
                type="date"
                value={to}
                onChange={(e) =>
                  setTo(e.target.value)
                }
                className="h-10 w-[155px] px-3 rounded-lg border border-[#CBE7FB] bg-[#F8FCFF] text-sm font-medium text-[#17212B] outline-none focus:border-[#1689E8] focus:ring-2 focus:ring-[#1689E8]/10"
              />
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="h-10 px-4 rounded-lg border border-[#CBE7FB] bg-white text-xs font-bold text-[#1689E8] hover:bg-[#F3F9FF] transition"
            >
              Reset
            </button>

            {/* Refresh */}
            <button
              onClick={loadReport}
              className="h-10 px-4 rounded-lg bg-[#1689E8] text-white border border-[#1689E8] text-xs font-bold hover:bg-[#1178D0] transition"
            >
              Refresh
            </button>
          </div>

          {/* Export Buttons */}
          <div className="lg:ml-auto flex flex-wrap gap-2">

            <button
              onClick={exportExcel}
              className="h-10 px-4 rounded-lg bg-[#EAF8F1] text-[#18A86F] border border-[#BFE8D3] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#DDF5EA] transition"
            >
              <FileSpreadsheet size={15} />
              Excel
            </button>

            <button
              onClick={generatePdf}
              disabled={generatingPdf}
              className="h-10 px-4 rounded-lg bg-[#EDF6FD] text-[#1689E8] border border-[#CBE7FB] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#E3F2FD] transition disabled:opacity-60"
            >
              <FileText size={15} />

              {generatingPdf
                ? 'Generating...'
                : 'Generate PDF'}
            </button>

          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3">
          {reportInfo.cards.map(
            ([label, value, Icon, type]) => (
              <SummaryCard
                key={label}
                label={label}
                value={value}
                icon={Icon}
                type={type}
              />
            )
          )}
        </div>

        {/* Report Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-xs">

            <thead>
              <tr className="bg-[#F3F8FD] text-left">

                <th className="px-3 py-3 font-bold text-[#526274]">
                  #
                </th>

                {columns.map(
                  ([label]) => (
                    <th
                      key={label}
                      className="px-3 py-3 font-bold text-[#526274]"
                    >
                      {label}
                    </th>
                  )
                )}

              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length + 1
                    }
                    className="text-center py-8 text-slate-400"
                  >
                    Loading report...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map(
                  (row, index) => (
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

                      {columns.map(
                        ([label, key]) => (
                          <td
                            key={label}
                            className="px-3 py-3 text-[#17212B] font-medium"
                          >
                            {displayValue(
                              key,
                              row[key]
                            )}
                          </td>
                        )
                      )}

                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length + 1
                    }
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
                    colSpan={Math.max(
                      1,
                      columns.length - 1
                    )}
                    className="px-3 py-3 text-right font-bold text-[#17212B]"
                  >
                    Total Amount :
                  </td>

                  <td className="px-3 py-3 font-bold text-[#1689E8]">
                    {money(
                      reportInfo.total
                    )}
                  </td>

                </tr>
              </tfoot>
            )}

          </table>
        </div>

      </div>
    </div>
  )
}