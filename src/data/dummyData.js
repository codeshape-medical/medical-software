// In-memory mock database. Mutated directly by src/services/api.js so the
// UI behaves like a real backend (add/edit/delete persists for the session).
// Replace this whole file's usage by pointing services/api.js at real
// endpoints — no page needs to change.

export const db = {
  products: [
    { id: 'MED001', code: 'MED001', name: 'Paracetamol 500mg', brand: 'Crocin', category: 'Analgesic', hsn: '300490', purchasePrice: 10, salePrice: 12, mrp: 15, stock: 250, expiry: '2027-12-01', batchNo: 'B0125', barcode: '1234567890' },
    { id: 'MED002', code: 'MED002', name: 'Azithromycin 500mg', brand: 'Azibact', category: 'Antibiotic', hsn: '300420', purchasePrice: 55, salePrice: 65, mrp: 70, stock: 120, expiry: '2027-06-15', batchNo: 'B0891', barcode: '1234567891' },
    { id: 'MED003', code: 'MED003', name: 'Amoxicillin 500mg', brand: 'Moxikind', category: 'Antibiotic', hsn: '300410', purchasePrice: 42, salePrice: 52, mrp: 60, stock: 80, expiry: '2026-12-01', batchNo: 'A4582', barcode: '1234567892' },
    { id: 'MED004', code: 'MED004', name: 'Pantoprazole 40mg', brand: 'Pan 40', category: 'Antacid', hsn: '300434', purchasePrice: 25, salePrice: 32, mrp: 39, stock: 10, expiry: '2026-10-01', batchNo: 'P3321', barcode: '1234567893' },
    { id: 'MED005', code: 'MED005', name: 'Metformin 500mg', brand: 'Glycomet', category: 'Diabetic', hsn: '300420', purchasePrice: 18, salePrice: 22, mrp: 30, stock: 350, expiry: '2027-08-01', batchNo: 'G7712', barcode: '1234567894' },
    { id: 'MED006', code: 'MED006', name: 'Vitamin D3 60000 IU', brand: 'Uprise D3', category: 'Supplement', hsn: '300490', purchasePrice: 65, salePrice: 85, mrp: 95, stock: 45, expiry: '2026-11-01', batchNo: 'V2256', barcode: '1234567895' },
  ],

  suppliers: [
    { id: 'SUP001', name: 'Sun Pharma Distributor', contact: '9876543210', email: 'orders@sunpharma-dist.com', gstin: '09AAACS1234A1Z5', address: 'Sigra, Varanasi, UP' },
    { id: 'SUP002', name: 'Cipla Regional Depot', contact: '9123456780', email: 'depot@cipla-region.com', gstin: '09AAACC5678B1Z2', address: 'Lanka, Varanasi, UP' },
    { id: 'SUP003', name: 'Mankind Pharma Agency', contact: '9988776655', email: 'agency@mankind.com', gstin: '09AAACM9012C1Z8', address: 'Cantt, Varanasi, UP' },
  ],

  purchases: [
    { id: 'PUR001', supplierName: 'Sun Pharma Distributor', invoiceNo: 'SUP-1254', date: '2026-09-24', items: [{ productId: 'MED001', name: 'Paracetamol 500mg', batchNo: 'B0125', expiry: '2027-12-01', qty: 100, rate: 10, amount: 1000 }], totalAmount: 1000 },
  ],

  bills: [
    { id: 'BILL001', billNo: 'MS-20260924001', date: '2026-09-24', customer: 'Walk-in', items: [{ productId: 'MED001', name: 'Paracetamol 500mg', qty: 12, price: 12, amount: 144 }], subtotal: 144, discount: 0, tax: 0, grandTotal: 144 },
    { id: 'BILL002', billNo: 'MS-20260923002', date: '2026-09-23', customer: 'Walk-in', items: [], subtotal: 118, discount: 0, tax: 0, grandTotal: 118 },
    { id: 'BILL003', billNo: 'MS-20260922015', date: '2026-09-22', customer: 'GPD Patient', items: [], subtotal: 890, discount: 0, tax: 0, grandTotal: 890 },
    { id: 'BILL004', billNo: 'MS-20260921012', date: '2026-09-21', customer: 'Walk-in', items: [], subtotal: 45320, discount: 0, tax: 0, grandTotal: 45320 },
  ],

  dashboardStats: {
    todaySales: 12450,
    totalProducts: 1250,
    lowStockCount: 245,
    expiringSoonCount: 38,
    totalStockValue: 485320,
    totalSuppliers: 36,
    totalCategories: 12,
    expiredItems: 12,
    monthlySales: [
      { month: 'Jan', value: 18000 }, { month: 'Feb', value: 21000 }, { month: 'Mar', value: 16000 },
      { month: 'Apr', value: 24000 }, { month: 'May', value: 27000 }, { month: 'Jun', value: 22000 },
      { month: 'Jul', value: 30000 }, { month: 'Aug', value: 26000 }, { month: 'Sep', value: 33000 },
    ],
  },

  reports: {
    sales: [
      { date: '2026-09-24', billNo: 'MS-20260924001', customer: 'Walk-in', amount: 139.00 },
      { date: '2026-09-23', billNo: 'MS-20260923002', customer: 'Walk-in', amount: 118.00 },
      { date: '2026-09-22', billNo: 'MS-20260922015', customer: 'GPD Patient', amount: 890.00 },
      { date: '2026-09-21', billNo: 'MS-20260921012', customer: 'Walk-in', amount: 45320.00 },
    ],
  },

  expiry: [
    { productId: 'MED004', name: 'Pantoprazole 40mg', batchNo: 'P3321', expiry: '2026-10-01', stock: 10, status: 'Expiring' },
    { productId: 'MED006', name: 'Vitamin D3 60000 IU', batchNo: 'V2256', expiry: '2026-11-01', stock: 45, status: 'Expiring' },
    { productId: 'MED003', name: 'Amoxicillin 500mg', batchNo: 'A4582', expiry: '2026-12-01', stock: 20, status: 'Expiring' },
    { productId: 'MED002', name: 'Azithromycin 500mg', batchNo: 'Z9988', expiry: '2026-12-01', stock: 15, status: 'Expiring' },
  ],
}

export const CATEGORIES = ['Analgesic', 'Antibiotic', 'Antacid', 'Diabetic', 'Supplement', 'Antiseptic', 'Cardiac']
