
// import 'dotenv/config'
// import express from 'express'
// import cors from 'cors'
// import bcrypt from 'bcryptjs'
// import { query, pool } from './db.js'
// import { authRequired, signToken } from './auth.js'

// const app = express()
// const PORT = Number(process.env.PORT || 5000)

// app.use(cors({
//   origin:
//     process.env.CLIENT_ORIGIN
//       ?.split(',')
//       .map((v) => v.trim()) || true,
// }))

// app.use(express.json({ limit: '2mb' }))

// const asyncRoute = (fn) => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next)

// const num = (value) => Number(value || 0)


// const dateOnly = (value) => {
//   if (!value) return null;

//   // PostgreSQL DATE returned as a string
//   if (typeof value === 'string') {
//     const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
//     if (match) return match[1];
//   }

//   // Handle Date objects using UTC components
//   if (value instanceof Date) {
//     if (Number.isNaN(value.getTime())) return null;

//     return [
//       value.getUTCFullYear(),
//       String(value.getUTCMonth() + 1).padStart(2, '0'),
//       String(value.getUTCDate()).padStart(2, '0'),
//     ].join('-');
//   }

//   return null;
// };
// const normalizedRole = (role) =>
//   String(role || '')
//     .trim()
//     .toLowerCase()
//     .replace(/[ -]+/g, '_')

// const isSuperAdmin = (user) =>
//   ['super_admin', 'superadmin'].includes(
//     normalizedRole(user?.role)
//   )

// async function initializeSuperAdmin() {
//   const username = String(
//     process.env.SUPER_ADMIN_ID || 'superadmin'
//   ).trim()

//   const password = String(
//     process.env.SUPER_ADMIN_PASSWORD || ''
//   )

//   const name = String(
//     process.env.SUPER_ADMIN_NAME || 'Super Admin'
//   ).trim()

//   if (!password) {
//     console.warn(
//       'SUPER_ADMIN_PASSWORD is not configured. ' +
//       'Skipping Super Admin account initialization.'
//     )
//     return
//   }

//   if (password.length < 12) {
//     throw new Error(
//       'SUPER_ADMIN_PASSWORD must be at least 12 characters.'
//     )
//   }

//   const passwordHash = await bcrypt.hash(password, 12)

//   await query(
//     `INSERT INTO users
//       (name, username, password_hash, role, is_active)
//      VALUES ($1, $2, $3, 'super_admin', TRUE)
//      ON CONFLICT (username)
//      DO UPDATE SET
//        name = EXCLUDED.name,
//        password_hash = EXCLUDED.password_hash,
//        role = 'super_admin',
//        is_active = TRUE`,
//     [name, username, passwordHash]
//   )

//   console.log(
//     `Super Admin account initialized: ${username}`
//   )
// }
// const mapProduct = (product) => ({
//   id: product.id,
//   code: product.code,
//   name: product.name,
//   brand: product.brand,
//   category: product.category,
//   hsn: product.hsn,
//   purchasePrice: num(product.purchase_price),
//   salePrice: num(product.sale_price),
//   mrp: num(product.mrp),
//   stock: Number(product.stock || 0),
//   expiry: dateOnly(product.expiry),
//   batchNo: product.batch_no,
//   barcode: product.barcode,
// })
// const mapSupplier = (r) => ({
//   id: r.id,
//   name: r.name,
//   contact: r.contact,
//   email: r.email,
//   gstin: r.gstin,
//   address: r.address,
// })

// const mapCustomer = (r) => ({
//   id: r.id,
//   name: r.name,
//   phone: r.phone,
//   address: r.address || '',
//   customerType: r.customer_type || 'Walk-in Patient',
// })

// async function nextBillNumber(client) {
//   const today = new Date()

//   const yyyy = today.getFullYear()
//   const mm = String(today.getMonth() + 1).padStart(2, '0')
//   const dd = String(today.getDate()).padStart(2, '0')

//   const dateKey = `${yyyy}-${mm}-${dd}`

//   const result = await client.query(
//     `INSERT INTO sale_day_sequences (sale_date, last_number)
//      VALUES ($1, 1)
//      ON CONFLICT (sale_date)
//      DO UPDATE SET last_number = sale_day_sequences.last_number + 1
//      RETURNING last_number`,
//     [dateKey]
//   )

//   return `CC-${yyyy}${mm}${dd}-${String(result.rows[0].last_number).padStart(4, '0')}`
// }

// async function upsertCustomer(client, customer) {
//   const phone = String(customer?.phone || '').trim()
//   const name = String(customer?.name || '').trim()
//   const address = String(customer?.address || '').trim()
//   const customerType = String(
//     customer?.type || 'Walk-in Patient'
//   )

//   if (!phone) return null

//   const result = await client.query(
//     `INSERT INTO customers
//       (name, phone, address, customer_type)
//      VALUES ($1,$2,$3,$4)
//      ON CONFLICT (phone)
//      DO UPDATE SET
//        name=$1,
//        address=$3,
//        customer_type=$4,
//        updated_at=CURRENT_TIMESTAMP
//      RETURNING *`,
//     [
//       name || 'Walk-in Patient',
//       phone,
//       address || null,
//       customerType,
//     ]
//   )

//   return result.rows[0]
// }

// /* ================= HEALTH ================= */

// app.get('/api/health', (req, res) => {
//   res.json({ ok: true })
// })

// /* ================= AUTH ================= */

// app.post(
//   '/api/auth/login',
//   asyncRoute(async (req, res) => {
//     const { username, password } = req.body || {}

//     const result = await query(
//       'SELECT * FROM users WHERE username=$1 AND is_active=true LIMIT 1',
//       [username]
//     )

//     const user = result.rows[0]

//     if (
//       !user ||
//       !(await bcrypt.compare(password || '', user.password_hash))
//     ) {
//       return res
//         .status(401)
//         .json({ message: 'Invalid username or password' })
//     }

//     const safeUser = {
//       id: user.id,
//       name: user.name,
//       username: user.username,
//       role: user.role,
//     }

//     res.json({
//       user: safeUser,
//       token: signToken(safeUser),
//     })
//   })
// )

// /* ================= PRODUCTS ================= */

// app.get(
//   '/api/products',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const result = await query(
//       'SELECT * FROM products ORDER BY id DESC'
//     )

//     res.json(result.rows.map(mapProduct))
//   })
// )

// // SEARCH PRODUCTS
// app.get(
//   '/api/products/search',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const search = String(req.query.q || '').trim()

//     if (search.length < 2) {
//       return res.json([])
//     }

//     const result = await query(
//       `SELECT *
//        FROM products
//        WHERE name ILIKE $1
//           OR brand ILIKE $1
//           OR code ILIKE $1
//           OR barcode ILIKE $1
//        ORDER BY name
//        LIMIT 8`,
//       [`%${search}%`]
//     )

//     res.json(result.rows.map(mapProduct))
//   })
// )

// // ADD PRODUCT
// app.post(
//   '/api/products',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const product = req.body || {}

//     if (!product.name?.trim()) {
//       return res.status(400).json({
//         message: 'Medicine name is required.',
//       })
//     }

//     // Only Super Admin may set initial stock manually.
//     const initialStock = isSuperAdmin(req.user)
//       ? Math.max(0, Math.trunc(num(product.stock)))
//       : 0

//     const result = await query(
//       `INSERT INTO products (
//         code,
//         name,
//         brand,
//         category,
//         hsn,
//         purchase_price,
//         sale_price,
//         mrp,
//         stock,
//         expiry,
//         batch_no,
//         barcode
//       )
//       VALUES (
//         COALESCE(
//           $1,
//           'MED' ||
//           LPAD(
//             ((SELECT COALESCE(MAX(id), 0) + 1
//               FROM products)::text),
//             3,
//             '0'
//           )
//         ),
//         $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
//       )
//       RETURNING *`,
//       [
//         product.code || null,
//         product.name.trim(),
//         product.brand || null,
//         product.category || null,
//         product.hsn || null,
//         num(product.purchasePrice),
//         num(product.salePrice),
//         num(product.mrp),
//         initialStock,
//         dateOnly(product.expiry),
//         product.batchNo || null,
//         product.barcode || null,
//       ]
//     )

//     res.status(201).json(mapProduct(result.rows[0]))
//   })
// )

// // EDIT PRODUCT
// app.put(
//   '/api/products/:id',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const product = req.body || {}

//     const existingResult = await query(
//       'SELECT id, stock FROM products WHERE id = $1 LIMIT 1',
//       [req.params.id]
//     )

//     const existing = existingResult.rows[0]

//     if (!existing) {
//       return res.status(404).json({
//         message: 'Product not found.',
//       })
//     }

//     const currentStock = Math.max(
//       0,
//       Math.trunc(num(existing.stock))
//     )

//     const requestedStock = Math.max(
//       0,
//       Math.trunc(num(product.stock))
//     )

//     // Block manual stock changes by ordinary Admins.
//     if (
//       !isSuperAdmin(req.user) &&
//       product.stock !== undefined &&
//       requestedStock !== currentStock
//     ) {
//       return res.status(403).json({
//         message:
//           'Only the Super Admin can manually edit medicine stock.',
//         code: 'SUPER_ADMIN_STOCK_PERMISSION_REQUIRED',
//       })
//     }

//     const stockToSave = isSuperAdmin(req.user) &&
//       product.stock !== undefined
//       ? requestedStock
//       : currentStock

//     const result = await query(
//       `UPDATE products
//        SET
//          name = $1,
//          brand = $2,
//          category = $3,
//          hsn = $4,
//          purchase_price = $5,
//          sale_price = $6,
//          mrp = $7,
//          stock = $8,
//          expiry = $9,
//          batch_no = $10,
//          barcode = $11,
//          updated_at = CURRENT_TIMESTAMP
//        WHERE id = $12
//        RETURNING *`,
//       [
//         product.name,
//         product.brand || null,
//         product.category || null,
//         product.hsn || null,
//         num(product.purchasePrice),
//         num(product.salePrice),
//         num(product.mrp),
//         stockToSave,
//         dateOnly(product.expiry),
//         product.batchNo || null,
//         product.barcode || null,
//         req.params.id,
//       ]
//     )

//     res.json(mapProduct(result.rows[0]))
//   })
// )

// // DELETE PRODUCT
// app.delete(
//   '/api/products/:id',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const result = await query(
//       'SELECT id, stock FROM products WHERE id = $1 LIMIT 1',
//       [req.params.id]
//     )

//     const product = result.rows[0]

//     if (!product) {
//       return res.status(404).json({
//         message: 'Product not found.',
//       })
//     }

//     if (
//       !isSuperAdmin(req.user) &&
//       Number(product.stock || 0) > 0
//     ) {
//       return res.status(403).json({
//         message:
//           'Only the Super Admin can delete a medicine that has stock.',
//       })
//     }

//     await query(
//       'DELETE FROM products WHERE id = $1',
//       [req.params.id]
//     )

//     res.json({ success: true })
//   })
// )
// /* ================= CUSTOMERS ================= */

// app.get(
//   '/api/customers/search',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const phone = String(req.query.phone || '')
//       .replace(/\D/g, '')

//     if (phone.length < 3) {
//       return res.json([])
//     }

//     const result = await query(
//       `SELECT * FROM customers
//        WHERE regexp_replace(phone, '\\D', '', 'g') LIKE $1
//        ORDER BY updated_at DESC
//        LIMIT 5`,
//       [`${phone}%`]
//     )

//     res.json(result.rows.map(mapCustomer))
//   })
// )

// app.get(
//   '/api/customers',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const result = await query(
//       'SELECT * FROM customers ORDER BY updated_at DESC, id DESC'
//     )

//     res.json(result.rows.map(mapCustomer))
//   })
// )

// /* ================= SUPPLIERS ================= */

// app.get(
//   '/api/suppliers',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const result = await query(
//       'SELECT * FROM suppliers ORDER BY id DESC'
//     )

//     res.json(result.rows.map(mapSupplier))
//   })
// )

// app.post(
//   '/api/suppliers',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const s = req.body || {}

//     const result = await query(
//       `INSERT INTO suppliers
//         (name,contact,email,gstin,address)
//        VALUES ($1,$2,$3,$4,$5)
//        RETURNING *`,
//       [
//         s.name,
//         s.contact || null,
//         s.email || null,
//         s.gstin || null,
//         s.address || null,
//       ]
//     )

//     res.status(201).json(mapSupplier(result.rows[0]))
//   })
// )

// app.get('/api/suppliers/:id/transactions', authRequired, asyncRoute(async (req, res) => {
  
// const result = await query(
//   `SELECT
//      p.id,
//      p.invoice_no,
//      p.invoice_date::text AS invoice_date,
//      p.total_amount,
//      COALESCE(COUNT(pi.id), 0)::int AS item_count,
//      COALESCE(SUM(pi.quantity), 0)::int AS item_quantity
//    FROM purchases p
//    LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
//    WHERE p.supplier_id = $1
//    GROUP BY p.id
//    ORDER BY p.invoice_date DESC, p.id DESC`,
//   [req.params.id]
// );


//   res.json(result.rows.map((r) => ({
//     id: r.id,
//     invoiceNo: r.invoice_no,
//     date: dateOnly(r.invoice_date),
//     totalAmount: num(r.total_amount),
//     itemCount: Number(r.item_count || 0),
//     itemQuantity: Number(r.item_quantity || 0),
//   })))
// }))

// /* ================= PURCHASES ================= */

// app.get(
//   '/api/purchases',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const result = await query(
//       `SELECT
//          p.*,
//          s.name AS supplier_name
//        FROM purchases p
//        LEFT JOIN suppliers s
//          ON s.id=p.supplier_id
//        ORDER BY p.id DESC`
//     )

//     const items = await query(
//       'SELECT * FROM purchase_items ORDER BY id'
//     )

//     res.json(
//       result.rows.map((r) => ({
//         id: r.id,
//         supplierId: r.supplier_id,
//         supplierName: r.supplier_name || '',
//         invoiceNo: r.invoice_no,
//         date: dateOnly(r.invoice_date),
//         totalAmount: num(r.total_amount),

//         items: items.rows
//           .filter((i) => i.purchase_id === r.id)
//           .map((i) => ({
//             productId: i.product_id,
//             name: i.product_name,
//             batchNo: i.batch_no,
//             expiry: dateOnly(i.expiry_date),
//             qty: i.quantity,
//             rate: num(i.rate),
//             amount: num(i.amount),
//           })),
//       }))
//     )
//   })
// )

// /* ================= PURCHASE INVOICE NUMBER ================= */

// async function nextPurchaseInvoiceNumber(client) {
//   const result = await client.query(`
//     CREATE SEQUENCE IF NOT EXISTS purchase_invoice_seq
//     START WITH 1
//   `)

//   const sequenceResult = await client.query(`
//     SELECT nextval('purchase_invoice_seq') AS sequence_no
//   `)

//   const now = new Date()

//   const yyyy = now.getFullYear()
//   const mm = String(now.getMonth() + 1).padStart(2, '0')
//   const dd = String(now.getDate()).padStart(2, '0')

//   const sequenceNo = String(
//     sequenceResult.rows[0].sequence_no
//   ).padStart(6, '0')

//   return `PUR-${yyyy}${mm}${dd}-${sequenceNo}`
// }


// /* ================= PURCHASES ================= */

// app.get(
//   '/api/purchases',
//   authRequired,
//   asyncRoute(async (req, res) => {

//     const result = await query(`
//       SELECT
//         p.*,
//         s.name AS supplier_name,
//         s.contact AS supplier_phone,
//         s.address AS supplier_address
//       FROM purchases p
//       LEFT JOIN suppliers s
//         ON s.id = p.supplier_id
//       ORDER BY p.id DESC
//     `)

//     const items = await query(`
//       SELECT *
//       FROM purchase_items
//       ORDER BY id
//     `)

//     res.json(
//       result.rows.map((r) => {

//         const purchaseItems =
//           items.rows
//             .filter(
//               (item) =>
//                 item.purchase_id === r.id
//             )
//             .map((item) => ({
//               productId: item.product_id,
//               name: item.product_name,
//               batchNo: item.batch_no,
//               expiry: dateOnly(
//                 item.expiry_date
//               ),
//               qty: Number(
//                 item.quantity || 0
//               ),
//               rate: num(item.rate),
//               amount: num(item.amount),
//             }))

//         return {
//           id: r.id,

//           supplierId:
//             r.supplier_id,

//           supplierName:
//             r.supplier_name || '',

//           supplierPhone:
//             r.supplier_phone || '',

//           supplierAddress:
//             r.supplier_address || '',

//           invoiceNo:
//             r.invoice_no,

//           date:
//             dateOnly(r.invoice_date),

//           totalAmount:
//             num(r.total_amount),

//           itemCount:
//             purchaseItems.length,

//           itemQuantity:
//             purchaseItems.reduce(
//               (sum, item) =>
//                 sum + Number(item.qty || 0),
//               0
//             ),

//           items:
//             purchaseItems,
//         }
//       })
//     )
//   })
// )


// app.post(
//   '/api/purchases',
//   authRequired,
//   asyncRoute(async (req, res) => {

//     const body = req.body || {}

//     if (!body.supplierName?.trim()) {
//       return res.status(400).json({
//         message: 'Supplier name is required',
//       })
//     }

//     if (!body.supplierPhone?.trim()) {
//       return res.status(400).json({
//         message:
//           'Supplier phone number is required',
//       })
//     }

//     if (!body.supplierAddress?.trim()) {
//       return res.status(400).json({
//         message:
//           'Supplier address is required',
//       })
//     }

//     if (!body.items?.length) {
//       return res.status(400).json({
//         message:
//           'At least one medicine is required',
//       })
//     }

//     const client = await pool.connect()

//     try {

//       await client.query('BEGIN')

//       /* =====================================================
//          1. FIND OR CREATE SUPPLIER
//       ===================================================== */

//       let supplierId =
//         Number(body.supplierId) || null

//       let supplier

//       if (supplierId) {

//         const supplierResult =
//           await client.query(
//             `
//               SELECT *
//               FROM suppliers
//               WHERE id=$1
//               FOR UPDATE
//             `,
//             [supplierId]
//           )

//         supplier =
//           supplierResult.rows[0] || null
//       }

//       /* Find by name if ID was not supplied */
//       if (!supplier) {

//         const supplierResult =
//           await client.query(
//             `
//               SELECT *
//               FROM suppliers
//               WHERE LOWER(TRIM(name))
//                     = LOWER(TRIM($1))
//               ORDER BY id
//               LIMIT 1
//               FOR UPDATE
//             `,
//             [body.supplierName]
//           )

//         supplier =
//           supplierResult.rows[0] || null
//       }

//       /* Existing supplier */
//       if (supplier) {

//         supplierId = supplier.id

//         const updatedSupplier =
//           await client.query(
//             `
//               UPDATE suppliers
//               SET
//                 name=$1,
//                 contact=$2,
//                 address=$3
//               WHERE id=$4
//               RETURNING *
//             `,
//             [
//               body.supplierName.trim(),
//               body.supplierPhone.trim(),
//               body.supplierAddress.trim(),
//               supplierId,
//             ]
//           )

//         supplier =
//           updatedSupplier.rows[0]
//       }

//       /* New supplier */
//       if (!supplier) {

//         const newSupplier =
//           await client.query(
//             `
//               INSERT INTO suppliers
//                 (
//                   name,
//                   contact,
//                   address
//                 )
//               VALUES
//                 ($1,$2,$3)
//               RETURNING *
//             `,
//             [
//               body.supplierName.trim(),
//               body.supplierPhone.trim(),
//               body.supplierAddress.trim(),
//             ]
//           )

//         supplier =
//           newSupplier.rows[0]

//         supplierId =
//           supplier.id
//       }

//       /* =====================================================
//          2. GENERATE UNIQUE INVOICE NUMBER
//       ===================================================== */

//       const invoiceNo =
//         await nextPurchaseInvoiceNumber(
//           client
//         )

//       /* =====================================================
//          3. CREATE PURCHASE
//       ===================================================== */

//       const purchaseResult =
//         await client.query(
//           `
//             INSERT INTO purchases
//               (
//                 supplier_id,
//                 invoice_no,
//                 invoice_date,
//                 total_amount,
//                 created_by
//               )
//             VALUES
//               ($1,$2,$3,$4,$5)
//             RETURNING *
//           `,
//           [
//             supplierId,
//             invoiceNo,
//             dateOnly(body.invoiceDate) ||
//               new Date(),
//             num(body.totalAmount),
//             req.user.id,
//           ]
//         )

//       const purchase =
//         purchaseResult.rows[0]

//       /* =====================================================
//          4. PROCESS MEDICINES
//       ===================================================== */

//       for (const item of body.items) {

//         const qty = Math.max(
//           1,
//           Math.trunc(
//             num(
//               item.qty ||
//               item.quantity
//             )
//           )
//         )

//         const rate =
//           num(item.rate)

//         const salePrice =
//           num(item.salePrice)

//         const mrp =
//           num(item.mrp)

//         const amount =
//           num(item.amount) ||
//           qty * rate

//         let productId =
//           Number(item.productId) || null

//         let product = null

//         /* Existing product */
//         if (productId) {

//           const productResult =
//             await client.query(
//               `
//                 SELECT *
//                 FROM products
//                 WHERE id=$1
//                 FOR UPDATE
//               `,
//               [productId]
//             )

//           product =
//             productResult.rows[0] ||
//             null
//         }

//         /* Try medicine name + batch */
//         if (!product && item.name) {

//           const existing =
//             await client.query(
//               `
//                 SELECT *
//                 FROM products
//                 WHERE LOWER(name)
//                       = LOWER($1)
//                   AND COALESCE(batch_no,'')
//                       = COALESCE($2,'')
//                 ORDER BY id
//                 LIMIT 1
//                 FOR UPDATE
//               `,
//               [
//                 item.name.trim(),
//                 item.batchNo || null,
//               ]
//             )

//           product =
//             existing.rows[0] || null

//           productId =
//             product?.id || null
//         }

//         /* ===================================================
//            NEW PRODUCT
//         =================================================== */

//         if (!product) {

//           const newProduct =
//             await client.query(
//               `
//                 INSERT INTO products
//                   (
//                     name,
//                     brand,
//                     category,
//                     purchase_price,
//                     sale_price,
//                     mrp,
//                     stock,
//                     expiry,
//                     batch_no
//                   )
//                 VALUES
//                   (
//                     $1,
//                     $2,
//                     $3,
//                     $4,
//                     $5,
//                     $6,
//                     $7,
//                     $8,
//                     $9
//                   )
//                 RETURNING *
//               `,
//               [
//                 item.name.trim(),
//                 item.brand || null,
//                 item.category || null,
//                 rate,
//                 salePrice,
//                 mrp,
//                 qty,
//                 dateOnly(item.expiry),
//                 item.batchNo || null,
//               ]
//             )

//           product =
//             newProduct.rows[0]

//           productId =
//             product.id

//         } else {

//           /* =================================================
//              EXISTING PRODUCT → INCREASE STOCK
//           ================================================= */

//           const updatedProduct =
//             await client.query(
//               `
//                 UPDATE products
//                 SET
//                   stock = stock + $1,

//                   purchase_price =
//                     CASE
//                       WHEN $2 > 0
//                       THEN $2
//                       ELSE purchase_price
//                     END,

//                   sale_price =
//                     CASE
//                       WHEN $3 > 0
//                       THEN $3
//                       ELSE sale_price
//                     END,

//                   mrp =
//                     CASE
//                       WHEN $4 > 0
//                       THEN $4
//                       ELSE mrp
//                     END,

//                   brand =
//                     COALESCE($5,brand),

//                   category =
//                     COALESCE($6,category),

//                   expiry =
//                     COALESCE($7,expiry),

//                   batch_no =
//                     COALESCE($8,batch_no),

//                   updated_at =
//                     CURRENT_TIMESTAMP

//                 WHERE id=$9

//                 RETURNING *
//               `,
//               [
//                 qty,
//                 rate,
//                 salePrice,
//                 mrp,
//                 item.brand || null,
//                 item.category || null,
//                 dateOnly(item.expiry),
//                 item.batchNo || null,
//                 productId,
//               ]
//             )

//           product =
//             updatedProduct.rows[0]
//         }

//         /* ===================================================
//            PURCHASE ITEM
//         =================================================== */

//         await client.query(
//           `
//             INSERT INTO purchase_items
//               (
//                 purchase_id,
//                 product_id,
//                 product_name,
//                 batch_no,
//                 expiry_date,
//                 quantity,
//                 rate,
//                 amount
//               )
//             VALUES
//               ($1,$2,$3,$4,$5,$6,$7,$8)
//           `,
//           [
//             purchase.id,
//             productId,

//             item.name ||
//               product.name,

//             item.batchNo ||
//               product.batch_no,

//             dateOnly(
//               item.expiry
//             ) ||
//               dateOnly(
//                 product.expiry
//               ),

//             qty,
//             rate,
//             amount,
//           ]
//         )
//       }

//       /* =====================================================
//          5. COMMIT
//       ===================================================== */

//       await client.query('COMMIT')

//       res.status(201).json({
//         success: true,

//         id:
//           purchase.id,

//         supplierId,

//         supplierName:
//           supplier.name,

//         supplierPhone:
//           supplier.contact || '',

//         supplierAddress:
//           supplier.address || '',

//         invoiceNo,

//         date:
//           dateOnly(
//             purchase.invoice_date
//           ),

//         totalAmount:
//           num(
//             purchase.total_amount
//           ),
//       })

//     } catch (error) {

//       await client.query(
//         'ROLLBACK'
//       )

//       throw error

//     } finally {

//       client.release()
//     }
//   })
// )

// /* ================= SALES ================= */

// app.get(
//   '/api/bills',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const bills = await query(
//       'SELECT * FROM sales ORDER BY id DESC'
//     )

//     const items = await query(
//       'SELECT * FROM sale_items ORDER BY id'
//     )

//     res.json(
//       bills.rows.map((b) => ({
//         id: b.id,
//         billNo: b.bill_no,
//         date: b.sale_date,

//         customer: b.customer_name || 'Walk-in',
//         customerName: b.customer_name || 'Walk-in',
//         customerPhone: b.customer_phone || '',
//         customerAddress: b.customer_address || '',

//         paymentMethod:
//           b.payment_method || 'Cash',

//         billedBy: b.billed_by || '',

//         subtotal: num(b.subtotal),
//         discount: num(b.discount_amount),
//         tax: num(b.tax),
//         grandTotal: num(b.grand_total),

//         items: items.rows
//           .filter((i) => i.sale_id === b.id)
//           .map((i) => ({
//             productId: i.product_id,
//             name: i.product_name,
//             qty: i.quantity,
//             price: num(i.price),
//             amount: num(i.amount),
//             batchNo: i.batch_no,
//           })),
//       }))
//     )
//   })
// )

// app.get(
//   '/api/bills/:billNo',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const bill = await query(
//       `SELECT
//          s.*,
//          c.id customer_id,
//          c.name customer_db_name,
//          c.phone customer_db_phone,
//          c.address customer_db_address
//        FROM sales s
//        LEFT JOIN customers c
//          ON c.id=s.customer_id
//        WHERE s.bill_no=$1
//        LIMIT 1`,
//       [req.params.billNo]
//     )

//     if (!bill.rows[0]) {
//       return res
//         .status(404)
//         .json({ message: 'Sale not found' })
//     }

//     const b = bill.rows[0]

//     const items = await query(
//       'SELECT * FROM sale_items WHERE sale_id=$1 ORDER BY id',
//       [b.id]
//     )

//     res.json({
//       id: b.id,
//       billNo: b.bill_no,
//       date: b.sale_date,

//       customer: b.customer_name || 'Walk-in',
//       customerName: b.customer_name || 'Walk-in',
//       customerPhone: b.customer_phone || '',
//       customerAddress: b.customer_address || '',

//       paymentMethod:
//         b.payment_method || 'Cash',

//       billedBy: b.billed_by || '',

//       subtotal: num(b.subtotal),
//       discount: num(b.discount_amount),
//       discountType: b.discount_type || 'percent',
//       discountValue: num(b.discount_value),
//       tax: num(b.tax),
//       grandTotal: num(b.grand_total),

//       items: items.rows.map((i) => ({
//         productId: i.product_id,
//         name: i.product_name,
//         qty: i.quantity,
//         price: num(i.price),
//         amount: num(i.amount),
//         batchNo: i.batch_no,
//       })),
//     })
//   })
// )

// app.post(
//   '/api/bills',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const b = req.body || {}

//     if (!b.items?.length) {
//       return res
//         .status(400)
//         .json({ message: 'Add at least one medicine' })
//     }

//     const client = await pool.connect()

//     try {
//       await client.query('BEGIN')

//       const customer = await upsertCustomer(
//         client,
//         b.customer || {
//           name: b.customerName,
//           phone: b.customerPhone,
//           address: b.customerAddress,
//           type: b.customerType,
//         }
//       )

//       const billNo = await nextBillNumber(client)

//       const sr = await client.query(
//         `INSERT INTO sales
//           (
//             bill_no,
//             customer_id,
//             customer_name,
//             customer_phone,
//             customer_address,
//             subtotal,
//             discount_type,
//             discount_value,
//             discount_amount,
//             tax,
//             grand_total,
//             payment_method,
//             billed_by,
//             created_by
//           )
//          VALUES
//           (
//             $1,$2,$3,$4,$5,$6,$7,$8,
//             $9,$10,$11,$12,$13,$14
//           )
//          RETURNING *`,
//         [
//           billNo,
//           customer?.id || null,
//           b.customerName ||
//             b.customer?.name ||
//             'Walk-in',
//           b.customerPhone ||
//             b.customer?.phone ||
//             null,
//           b.customerAddress ||
//             b.customer?.address ||
//             null,
//           num(b.subtotal),
//           b.discountType || null,
//           num(b.discountValue),
//           num(b.discountAmount || b.discount),
//           num(b.tax),
//           num(b.grandTotal),
//           b.paymentMethod || 'Cash',
//           b.billedBy?.name ||
//             b.billedBy ||
//             null,
//           req.user.id,
//         ]
//       )

//       const sale = sr.rows[0]

//       for (const item of b.items) {
//         const qty = Math.max(
//           1,
//           Math.trunc(
//             num(item.qty || item.quantity)
//           )
//         )

//         const productId = Number(item.productId)

//         const pr = await client.query(
//           'SELECT * FROM products WHERE id=$1 FOR UPDATE',
//           [productId]
//         )

//         if (!pr.rows[0]) {
//           throw new Error(
//             `Product ${item.name || productId} not found`
//           )
//         }

//         if (Number(pr.rows[0].stock) < qty) {
//           throw new Error(
//             `Insufficient stock for ${pr.rows[0].name}`
//           )
//         }

//         const price = num(
//           item.price || item.salePrice
//         )

//         const amount =
//           num(item.amount) || qty * price

//         await client.query(
//           `UPDATE products
//            SET
//              stock=stock-$1,
//              updated_at=CURRENT_TIMESTAMP
//            WHERE id=$2`,
//           [qty, productId]
//         )

//         await client.query(
//           `INSERT INTO sale_items
//             (
//               sale_id,
//               product_id,
//               product_name,
//               batch_no,
//               quantity,
//               price,
//               amount
//             )
//            VALUES ($1,$2,$3,$4,$5,$6,$7)`,
//           [
//             sale.id,
//             productId,
//             item.name ||
//               pr.rows[0].name,
//             pr.rows[0].batch_no,
//             qty,
//             price,
//             amount,
//           ]
//         )
//       }

//       await client.query('COMMIT')

//       res.status(201).json({
//         id: sale.id,
//         billNumber: sale.bill_no,
//         date: sale.sale_date,

//         customer: {
//           name: sale.customer_name,
//           phone: sale.customer_phone,
//           address: sale.customer_address,
//         },

//         paymentMethod:
//           sale.payment_method,

//         subtotal: num(sale.subtotal),
//         discountType:
//           sale.discount_type,
//         discountValue:
//           num(sale.discount_value),
//         discountAmount:
//           num(sale.discount_amount),
//         tax: num(sale.tax),
//         grandTotal:
//           num(sale.grand_total),

//         billedBy: sale.billed_by,
//         items: b.items,
//       })
//     } catch (e) {
//       await client.query('ROLLBACK')
//       throw e
//     } finally {
//       client.release()
//     }
//   })
// )

// /* ================= RETURNS ================= */

// app.post(
//   '/api/returns',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const b = req.body || {}

//     const client = await pool.connect()

//     try {
//       await client.query('BEGIN')

//       const sr = await client.query(
//         `SELECT id
//          FROM sales
//          WHERE bill_no=$1
//          LIMIT 1
//          FOR UPDATE`,
//         [b.billNo]
//       )

//       if (!sr.rows[0]) {
//         await client.query('ROLLBACK')

//         return res
//           .status(404)
//           .json({ message: 'Sale not found' })
//       }

//       const saleId = sr.rows[0].id

//       const saleItems = await client.query(
//         `SELECT product_id,quantity,price
//          FROM sale_items
//          WHERE sale_id=$1`,
//         [saleId]
//       )

//       const originalByProduct = new Map(
//         saleItems.rows.map((i) => [
//           Number(i.product_id),
//           Number(i.quantity),
//         ])
//       )

//       const alreadyReturned =
//         await client.query(
//           `SELECT
//              ri.product_id,
//              COALESCE(SUM(ri.quantity),0)::int returned_qty
//            FROM return_items ri
//            JOIN returns r
//              ON r.id=ri.return_id
//            WHERE r.sale_id=$1
//            GROUP BY ri.product_id`,
//           [saleId]
//         )

//       const returnedByProduct = new Map(
//         alreadyReturned.rows.map((i) => [
//           Number(i.product_id),
//           Number(i.returned_qty),
//         ])
//       )

//       const cleanItems = (b.items || [])
//         .map((i) => ({
//           productId: Number(i.productId),
//           name: i.name,
//           returnQty: Math.trunc(
//             num(i.returnQty)
//           ),
//           price: num(i.price),
//         }))
//         .filter((i) => i.returnQty > 0)

//       if (!cleanItems.length) {
//         await client.query('ROLLBACK')

//         return res
//           .status(400)
//           .json({
//             message:
//               'Select at least one item to return',
//           })
//       }

//       for (const item of cleanItems) {
//         const sold =
//           originalByProduct.get(
//             item.productId
//           ) || 0

//         const returned =
//           returnedByProduct.get(
//             item.productId
//           ) || 0

//         if (
//           item.returnQty >
//           sold - returned
//         ) {
//           await client.query('ROLLBACK')

//           return res
//             .status(400)
//             .json({
//               message:
//                 `Return quantity exceeds the remaining quantity for ${item.name}`,
//             })
//         }
//       }

//       const total = cleanItems.reduce(
//         (s, i) =>
//           s + i.returnQty * i.price,
//         0
//       )

//       const now = new Date()

//       const returnNo =
//         `CN-${now.getFullYear()}` +
//         `${String(now.getMonth() + 1).padStart(2, '0')}` +
//         `${String(now.getDate()).padStart(2, '0')}-` +
//         `${Date.now().toString().slice(-5)}`

//       const rr = await client.query(
//         `INSERT INTO returns
//           (
//             return_no,
//             sale_id,
//             reason,
//             total_amount,
//             created_by
//           )
//          VALUES ($1,$2,$3,$4,$5)
//          RETURNING *`,
//         [
//           returnNo,
//           saleId,
//           b.reason || null,
//           total,
//           req.user.id,
//         ]
//       )

//       for (const item of cleanItems) {
//         await client.query(
//           `INSERT INTO return_items
//             (
//               return_id,
//               product_id,
//               product_name,
//               quantity,
//               price,
//               amount
//             )
//            VALUES ($1,$2,$3,$4,$5,$6)`,
//           [
//             rr.rows[0].id,
//             item.productId,
//             item.name,
//             item.returnQty,
//             item.price,
//             item.returnQty * item.price,
//           ]
//         )

//         await client.query(
//           `UPDATE products
//            SET
//              stock=stock+$1,
//              updated_at=CURRENT_TIMESTAMP
//            WHERE id=$2`,
//           [
//             item.returnQty,
//             item.productId,
//           ]
//         )
//       }

//       await client.query('COMMIT')

//       res.status(201).json({
//         success: true,
//         returnNo,
//         totalAmount: total,
//       })
//     } catch (e) {
//       await client.query('ROLLBACK')
//       throw e
//     } finally {
//       client.release()
//     }
//   })
// )

// /* ================= DASHBOARD ================= */

// app.get(
//   '/api/dashboard/stats',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const [
//       sales,
//       products,
//       suppliers,
//       categories,
//       low,
//       expiry,
//       expired,
//       stockValue,
//       monthly,
//     ] = await Promise.all([
//       query(
//         `SELECT
//            COALESCE(SUM(grand_total),0) value
//          FROM sales
//          WHERE sale_date::date=CURRENT_DATE`
//       ),

//       query(
//         'SELECT COUNT(*) value FROM products'
//       ),

//       query(
//         'SELECT COUNT(*) value FROM suppliers'
//       ),

//       query(
//         `SELECT COUNT(DISTINCT category) value
//          FROM products
//          WHERE category IS NOT NULL
//            AND category<>''`
//       ),

//       query(
//         `SELECT COUNT(*) value
//          FROM products
//          WHERE stock<=20`
//       ),

//       query(
//         `SELECT COUNT(*) value
//          FROM products
//          WHERE expiry BETWEEN
//            CURRENT_DATE
//            AND CURRENT_DATE + INTERVAL '3 months'`
//       ),

//       query(
//         `SELECT COUNT(*) value
//          FROM products
//          WHERE expiry<CURRENT_DATE`
//       ),

//       query(
//         `SELECT
//            COALESCE(
//              SUM(purchase_price*stock),
//              0
//            ) value
//          FROM products`
//       ),

//       /* FIXED MONTHLY SALES QUERY */
//       query(
//         `SELECT
//            TO_CHAR(
//              date_trunc('month', sale_date),
//              'Mon'
//            ) AS month_name,

//            EXTRACT(
//              MONTH FROM sale_date
//            )::int AS month_no,

//            COALESCE(
//              SUM(grand_total),
//              0
//            ) AS value

//          FROM sales

//          WHERE sale_date >=
//            date_trunc(
//              'year',
//              CURRENT_DATE
//            )

//          GROUP BY 1,2
//          ORDER BY 2`
//       ),
//     ])

//     res.json({
//       todaySales:
//         num(sales.rows[0].value),

//       totalProducts:
//         Number(products.rows[0].value),

//       lowStockCount:
//         Number(low.rows[0].value),

//       expiringSoonCount:
//         Number(expiry.rows[0].value),

//       totalStockValue:
//         num(stockValue.rows[0].value),

//       totalSuppliers:
//         Number(suppliers.rows[0].value),

//       totalCategories:
//         Number(categories.rows[0].value),

//       expiredItems:
//         Number(expired.rows[0].value),

//       monthlySales:
//         monthly.rows.map((r) => ({
//           month: r.month_name,
//           value: num(r.value),
//         })),
//     })
//   })
// )

// /* ================= REPORTS ================= */

// app.get(
//   '/api/reports/:type',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const type = req.params.type

//     const from = req.query.from || null
//     const to = req.query.to || null

//     const params = []

//     const whereDate = (column) => {
//       const clauses = []

//       if (from) {
//         params.push(from)
//         clauses.push(
//           `${column}::date >= $${params.length}`
//         )
//       }

//       if (to) {
//         params.push(to)
//         clauses.push(
//           `${column}::date <= $${params.length}`
//         )
//       }

//       return clauses.length
//         ? `WHERE ${clauses.join(' AND ')}`
//         : ''
//     }

//     if (
//       type === 'today-sales' ||
//       type === 'sales'
//     ) {
//       const condition =
//         type === 'today-sales'
//           ? 'WHERE sale_date::date=CURRENT_DATE'
//           : whereDate('sale_date')

//       const r = await query(
//         `SELECT
//            sale_date date,
//            bill_no bill_no,
//            customer_name customer,
//            customer_phone phone,
//            payment_method payment_method,
//            grand_total amount
//          FROM sales
//          ${condition}
//          ORDER BY sale_date DESC`,
//         params
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           date: x.date,
//           billNo: x.bill_no,
//           customer: x.customer,
//           phone: x.phone || '',
//           paymentMethod:
//             x.payment_method || 'Cash',
//           amount: num(x.amount),
//         }))
//       )
//     }

    


// if (type === 'purchases') {
//   const r = await query(
//     `SELECT
//        p.id,
//        p.invoice_date::date AS date,
//        p.invoice_no AS invoice_no,
//        s.name AS supplier,
//        p.total_amount AS amount,
//        COALESCE(SUM(pi.quantity), 0)::int AS quantity
//      FROM purchases p
//      LEFT JOIN suppliers s
//        ON s.id = p.supplier_id
//      LEFT JOIN purchase_items pi
//        ON pi.purchase_id = p.id
//      ${whereDate('p.invoice_date')}
//      GROUP BY
//        p.id,
//        p.invoice_date,
//        p.invoice_no,
//        s.name,
//        p.total_amount
//      ORDER BY p.invoice_date DESC, p.id DESC`,
//     params
//   )

//   return res.json(
//     r.rows.map((x) => ({
//       id: x.id,
//       date: dateOnly(x.date),
//       invoiceNo: x.invoice_no,
//       supplier: x.supplier || '',
//       amount: num(x.amount),
//       quantity: Number(x.quantity || 0),
//     }))
//   )
// }




//     if (type === 'stock') {
//       const r = await query(
//         'SELECT * FROM products ORDER BY name'
//       )

//       return res.json(
//         r.rows.map(mapProduct)
//       )
//     }

//     if (type === 'customers') {
//       const r = await query(
//         `SELECT
//            c.id,
//            c.name,
//            c.phone,
//            c.address,
//            c.customer_type,

//            COUNT(s.id)::int total_bills,

//            COALESCE(
//              SUM(s.grand_total),
//              0
//            ) total_amount,

//            MAX(s.sale_date) last_sale

//          FROM customers c

//          LEFT JOIN sales s
//            ON s.customer_id=c.id

//          GROUP BY c.id

//          ORDER BY c.name`
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           id: x.id,
//           name: x.name,
//           phone: x.phone,
//           address: x.address || '',
//           customerType:
//             x.customer_type,
//           totalBills:
//             Number(x.total_bills),
//           totalAmount:
//             num(x.total_amount),
//           lastSale:
//             x.last_sale,
//         }))
//       )
//     }

//     if (type === 'suppliers') {
//       const r = await query(
//         `SELECT
//            s.id,
//            s.name,
//            s.contact,
//            s.email,

//            COUNT(p.id)::int
//              total_purchases,

//            COALESCE(
//              SUM(p.total_amount),
//              0
//            ) total_amount,

//            MAX(p.invoice_date)
//              last_purchase

//          FROM suppliers s

//          LEFT JOIN purchases p
//            ON p.supplier_id=s.id

//          GROUP BY s.id

//          ORDER BY s.name`
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           id: x.id,
//           name: x.name,
//           contact: x.contact || '',
//           email: x.email || '',
//           totalPurchases:
//             Number(x.total_purchases),
//           totalAmount:
//             num(x.total_amount),
//           lastPurchase:
//             x.last_purchase,
//         }))
//       )
//     }

//     if (type === 'expiry') {
//       const r = await query(
//         `SELECT *
//          FROM products
//          WHERE expiry IS NOT NULL
//          ORDER BY expiry`
//       )

//       return res.json(
//         r.rows.map((p) => ({
//           productId: p.id,
//           name: p.name,
//           batchNo: p.batch_no,
//           expiry: dateOnly(p.expiry),
//           stock: Number(p.stock),
//           category: p.category || '',
//         }))
//       )
//     }

//     if (type === 'amount') {
//       const r = await query(
//         `SELECT
//            sale_date date,
//            bill_no bill_no,
//            customer_name customer,
//            subtotal,
//            discount_amount discount,
//            grand_total amount,
//            payment_method payment_method

//          FROM sales
//          ${whereDate('sale_date')}

//          ORDER BY sale_date DESC`,
//         params
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           date: x.date,
//           billNo: x.bill_no,
//           customer: x.customer || '',
//           subtotal: num(x.subtotal),
//           discount: num(x.discount),
//           amount: num(x.amount),
//           paymentMethod:
//             x.payment_method || 'Cash',
//         }))
//       )
//     }

//     if (type === 'low-stock') {
//       const r = await query(
//         `SELECT *
//          FROM products
//          WHERE stock<=20
//          ORDER BY stock ASC,name`
//       )

//       return res.json(
//         r.rows.map(mapProduct)
//       )
//     }

//     if (type === 'returns') {
//       const r = await query(
//         `SELECT
//            r.created_at date,
//            r.return_no return_no,
//            s.bill_no bill_no,
//            s.customer_name customer,
//            r.total_amount amount,
//            r.reason

//          FROM returns r

//          LEFT JOIN sales s
//            ON s.id=r.sale_id

//          ${whereDate('r.created_at')}

//          ORDER BY r.created_at DESC`,
//         params
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           date: x.date,
//           returnNo: x.return_no,
//           billNo: x.bill_no || '',
//           customer: x.customer || '',
//           amount: num(x.amount),
//           reason: x.reason || '',
//         }))
//       )
//     }

//     if (type === 'payments') {
//       const r = await query(
//         `SELECT
//            payment_method payment_method,
//            COUNT(*)::int count,
//            COALESCE(
//              SUM(grand_total),
//              0
//            ) amount

//          FROM sales

//          ${whereDate('sale_date')}

//          GROUP BY payment_method

//          ORDER BY amount DESC`,
//         params
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           paymentMethod:
//             x.payment_method || 'Cash',
//           count: Number(x.count),
//           amount: num(x.amount),
//         }))
//       )
//     }

//     if (type === 'sales-items') {
//       const r = await query(
//         `SELECT
//            si.product_name product,
//            COALESCE(
//              SUM(si.quantity),
//              0
//            )::int quantity,

//            COALESCE(
//              SUM(si.amount),
//              0
//            ) amount

//          FROM sale_items si

//          JOIN sales s
//            ON s.id=si.sale_id

//          ${whereDate('s.sale_date')}

//          GROUP BY si.product_name

//          ORDER BY quantity DESC`,
//         params
//       )

//       return res.json(
//         r.rows.map((x) => ({
//           product: x.product,
//           quantity:
//             Number(x.quantity),
//           amount:
//             num(x.amount),
//         }))
//       )
//     }

//     res.json([])
//   })
// )
// /* =====================================================
//    REPORT DETAIL ROUTE
//    Place before app.listen(...)
// ===================================================== */

// app.get(
//   '/api/report-details/:kind/:id',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const { kind, id } = req.params
//     let result

//     if (kind === 'sale') {
//       result = await query(
//         `SELECT
//            s.*,
//            s.bill_no AS "billNo",
//            s.sale_date AS date,
//            s.customer_name AS customer,
//            s.customer_phone AS "customerPhone",
//            s.customer_address AS "customerAddress",
//            s.payment_method AS "paymentMethod",
//            s.billed_by AS "billedBy",
//            s.subtotal,
//            s.discount_amount AS discount,
//            s.tax,
//            s.grand_total AS "grandTotal"
//          FROM sales s
//          WHERE s.bill_no::text = $1 OR s.id::text = $1
//          LIMIT 1`,
//         [id]
//       )

//       if (!result.rows[0]) {
//         return res.status(404).json({ message: 'Sale not found' })
//       }

//       const sale = result.rows[0]
//       const items = await query(
//         `SELECT
//            id,
//            product_id AS "productId",
//            product_name AS name,
//            batch_no AS "batchNo",
//            quantity AS qty,
//            price,
//            amount
//          FROM sale_items
//          WHERE sale_id = $1
//          ORDER BY id`,
//         [sale.id]
//       )

//       return res.json({
//         ...sale,
//         subtotal: num(sale.subtotal),
//         discount: num(sale.discount),
//         tax: num(sale.tax),
//         grandTotal: num(sale.grandTotal),
//         items: items.rows.map((item) => ({
//           ...item,
//           qty: Number(item.qty || 0),
//           price: num(item.price),
//           amount: num(item.amount),
//         })),
//       })
//     }

//     if (kind === 'purchase') {
//       result = await query(
//         `SELECT
//            p.*,
//            p.invoice_no AS "invoiceNo",
//            p.invoice_date AS date,
//            p.total_amount AS "totalAmount",
//            s.name AS supplier,
//            s.contact AS "supplierContact",
//            s.address AS "supplierAddress"
//          FROM purchases p
//          LEFT JOIN suppliers s ON s.id = p.supplier_id
//          WHERE p.id::text = $1 OR p.invoice_no::text = $1
//          LIMIT 1`,
//         [id]
//       )

//       if (!result.rows[0]) {
//         return res.status(404).json({ message: 'Purchase not found' })
//       }

//       const purchase = result.rows[0]
//       const items = await query(
//         `SELECT
//            id,
//            product_id AS "productId",
//            product_name AS name,
//            batch_no AS "batchNo",
//            expiry_date AS expiry,
//            quantity AS qty,
//            rate,
//            amount
//          FROM purchase_items
//          WHERE purchase_id = $1
//          ORDER BY id`,
//         [purchase.id]
//       )

//       return res.json({
//         ...purchase,
//         totalAmount: num(purchase.totalAmount),
//         items: items.rows.map((item) => ({
//           ...item,
//           qty: Number(item.qty || 0),
//           rate: num(item.rate),
//           amount: num(item.amount),
//           expiry: item.expiry ? dateOnly(item.expiry) : null,
//         })),
//       })
//     }

//     if (kind === 'medicine') {
//       result = await query(
//         'SELECT * FROM products WHERE id::text = $1 LIMIT 1',
//         [id]
//       )

//       if (!result.rows[0]) {
//         return res.status(404).json({ message: 'Medicine not found' })
//       }

//       const p = result.rows[0]

//       return res.json({
//         ...p,
//         productId: p.id,
//         purchasePrice: num(p.purchase_price),
//         salePrice: num(p.sale_price),
//         mrp: num(p.mrp),
//         stock: Number(p.stock || 0),
//         expiry: p.expiry ? dateOnly(p.expiry) : null,
//       })
//     }

//     if (kind === 'customer') {
//       result = await query(
//         `SELECT
//            c.*,
//            COUNT(s.id)::int AS "totalBills",
//            COALESCE(SUM(s.grand_total), 0) AS "totalAmount",
//            MAX(s.sale_date) AS "lastSale"
//          FROM customers c
//          LEFT JOIN sales s ON s.customer_id = c.id
//          WHERE c.id::text = $1
//          GROUP BY c.id
//          LIMIT 1`,
//         [id]
//       )

//       if (!result.rows[0]) {
//         return res.status(404).json({ message: 'Customer not found' })
//       }

//       const customer = result.rows[0]
//       const transactions = await query(
//         `SELECT
//            id,
//            bill_no AS "billNo",
//            sale_date AS date,
//            payment_method AS "paymentMethod",
//            grand_total AS amount
//          FROM sales
//          WHERE customer_id = $1
//          ORDER BY sale_date DESC, id DESC`,
//         [customer.id]
//       )

//       return res.json({
//         ...customer,
//         totalAmount: num(customer.totalAmount),
//         transactions: transactions.rows.map((row) => ({
//           ...row,
//           amount: num(row.amount),
//         })),
//       })
//     }

//     if (kind === 'supplier') {
//       result = await query(
//         `SELECT
//            s.*,
//            COUNT(p.id)::int AS "totalPurchases",
//            COALESCE(SUM(p.total_amount), 0) AS "totalAmount",
//            MAX(p.invoice_date) AS "lastPurchase"
//          FROM suppliers s
//          LEFT JOIN purchases p ON p.supplier_id = s.id
//          WHERE s.id::text = $1
//          GROUP BY s.id
//          LIMIT 1`,
//         [id]
//       )

//       if (!result.rows[0]) {
//         return res.status(404).json({ message: 'Supplier not found' })
//       }

//       const supplier = result.rows[0]
//       const transactions = await query(
//         `SELECT
//            id,
//            invoice_no AS "invoiceNo",
//            invoice_date AS date,
//            total_amount AS amount
//          FROM purchases
//          WHERE supplier_id = $1
//          ORDER BY invoice_date DESC, id DESC`,
//         [supplier.id]
//       )

//       return res.json({
//         ...supplier,
//         totalAmount: num(supplier.totalAmount),
//         transactions: transactions.rows.map((row) => ({
//           ...row,
//           amount: num(row.amount),
//         })),
//       })
//     }

//     if (kind === 'return') {
//       result = await query(
//         `SELECT
//            r.*,
//            r.return_no AS "returnNo",
//            r.total_amount AS "totalAmount",
//            r.created_at AS date,
//            s.bill_no AS "billNo",
//            s.customer_name AS customer
//          FROM returns r
//          LEFT JOIN sales s ON s.id = r.sale_id
//          WHERE r.id::text = $1 OR r.return_no::text = $1
//          LIMIT 1`,
//         [id]
//       )

//       if (!result.rows[0]) {
//         return res.status(404).json({ message: 'Return not found' })
//       }

//       const record = result.rows[0]
//       const items = await query(
//         `SELECT
//            id,
//            product_id AS "productId",
//            product_name AS name,
//            quantity AS qty,
//            price,
//            amount
//          FROM return_items
//          WHERE return_id = $1
//          ORDER BY id`,
//         [record.id]
//       )

//       return res.json({
//         ...record,
//         totalAmount: num(record.totalAmount),
//         items: items.rows.map((item) => ({
//           ...item,
//           qty: Number(item.qty || 0),
//           price: num(item.price),
//           amount: num(item.amount),
//         })),
//       })
//     }

//     return res.status(400).json({
//       message: 'Unsupported report detail type',
//     })
//   })
// )
// /* ================= SETTINGS ================= */

// app.get(
//   '/api/settings',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const r = await query(
//       'SELECT * FROM store_settings WHERE id=1'
//     )

//     res.json(r.rows[0] || {})
//   })
// )

// app.put(
//   '/api/settings',
//   authRequired,
//   asyncRoute(async (req, res) => {
//     const s = req.body || {}

//     const r = await query(
//       `UPDATE store_settings
//        SET
//          name=$1,
//          subtitle=$2,
//          phone=$3,
//          email=$4,
//          address=$5,
//          gstin=$6,
//          updated_at=CURRENT_TIMESTAMP
//        WHERE id=1
//        RETURNING *`,
//       [
//         s.name,
//         s.subtitle,
//         s.phone,
//         s.email,
//         s.address,
//         s.gstin,
//       ]
//     )

//     res.json(r.rows[0])
//   })
// )

// /* ================= ERROR HANDLER ================= */

// app.use((err, req, res, next) => {
//   console.error(err)

//   res.status(500).json({
//     message:
//       err.message || 'Server error',
//   })
// })

// /* ================= SERVER ================= */

// async function startServer() {
//   try {
//     // Create or update the Super Admin account first
//     await initializeSuperAdmin()

//     // Start the server after initialization succeeds
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`)
//     })
//   } catch (error) {
//     console.error('Failed to initialize server:', error)
//     process.exit(1)
//   }
// }

// startServer()
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { query, pool } from './db.js'
import { authRequired, signToken } from './auth.js'

const app = express()
const PORT = Number(process.env.PORT || 5000)

app.use(cors({
  origin:
    process.env.CLIENT_ORIGIN
      ?.split(',')
      .map((v) => v.trim()) || true,
}))

app.use(express.json({ limit: '2mb' }))

const asyncRoute = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

const num = (value) => Number(value || 0)


const dateOnly = (value) => {
  if (!value) return null;

  // PostgreSQL DATE returned as a string
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }

  // FIXED: pg creates DATE values at local midnight,
  // so read LOCAL components (not UTC) to keep the same calendar date.
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;

    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, '0'),
      String(value.getDate()).padStart(2, '0'),
    ].join('-');
  }

  return null;
};
const normalizedRole = (role) =>
  String(role || '')
    .trim()
    .toLowerCase()
    .replace(/[ -]+/g, '_')

const isSuperAdmin = (user) =>
  ['super_admin', 'superadmin'].includes(
    normalizedRole(user?.role)
  )

async function initializeSuperAdmin() {
  const username = String(
    process.env.SUPER_ADMIN_ID || 'superadmin'
  ).trim()

  const password = String(
    process.env.SUPER_ADMIN_PASSWORD || ''
  )

  const name = String(
    process.env.SUPER_ADMIN_NAME || 'Super Admin'
  ).trim()

  if (!password) {
    console.warn(
      'SUPER_ADMIN_PASSWORD is not configured. ' +
      'Skipping Super Admin account initialization.'
    )
    return
  }

  if (password.length < 12) {
    throw new Error(
      'SUPER_ADMIN_PASSWORD must be at least 12 characters.'
    )
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await query(
    `INSERT INTO users
      (name, username, password_hash, role, is_active)
     VALUES ($1, $2, $3, 'super_admin', TRUE)
     ON CONFLICT (username)
     DO UPDATE SET
       name = EXCLUDED.name,
       password_hash = EXCLUDED.password_hash,
       role = 'super_admin',
       is_active = TRUE`,
    [name, username, passwordHash]
  )

  console.log(
    `Super Admin account initialized: ${username}`
  )
}
const mapProduct = (product) => ({
  id: product.id,
  code: product.code,
  name: product.name,
  brand: product.brand,
  category: product.category,
  hsn: product.hsn,
  purchasePrice: num(product.purchase_price),
  salePrice: num(product.sale_price),
  mrp: num(product.mrp),
  stock: Number(product.stock || 0),
  expiry: dateOnly(product.expiry),
  batchNo: product.batch_no,
  barcode: product.barcode,
})
const mapSupplier = (r) => ({
  id: r.id,
  name: r.name,
  contact: r.contact,
  email: r.email,
  gstin: r.gstin,
  address: r.address,
})

const mapCustomer = (r) => ({
  id: r.id,
  name: r.name,
  phone: r.phone,
  address: r.address || '',
  customerType: r.customer_type || 'Walk-in Patient',
})

async function nextBillNumber(client) {
  const today = new Date()

  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')

  const dateKey = `${yyyy}-${mm}-${dd}`

  const result = await client.query(
    `INSERT INTO sale_day_sequences (sale_date, last_number)
     VALUES ($1, 1)
     ON CONFLICT (sale_date)
     DO UPDATE SET last_number = sale_day_sequences.last_number + 1
     RETURNING last_number`,
    [dateKey]
  )

  return `CC-${yyyy}${mm}${dd}-${String(result.rows[0].last_number).padStart(4, '0')}`
}

async function upsertCustomer(client, customer) {
  const phone = String(customer?.phone || '').trim()
  const name = String(customer?.name || '').trim()
  const address = String(customer?.address || '').trim()
  const customerType = String(
    customer?.type || 'Walk-in Patient'
  )

  if (!phone) return null

  const result = await client.query(
    `INSERT INTO customers
      (name, phone, address, customer_type)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (phone)
     DO UPDATE SET
       name=$1,
       address=$3,
       customer_type=$4,
       updated_at=CURRENT_TIMESTAMP
     RETURNING *`,
    [
      name || 'Walk-in Patient',
      phone,
      address || null,
      customerType,
    ]
  )

  return result.rows[0]
}

/* ================= HEALTH ================= */

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

/* ================= AUTH ================= */

app.post(
  '/api/auth/login',
  asyncRoute(async (req, res) => {
    const { username, password } = req.body || {}

    const result = await query(
      'SELECT * FROM users WHERE username=$1 AND is_active=true LIMIT 1',
      [username]
    )

    const user = result.rows[0]

    if (
      !user ||
      !(await bcrypt.compare(password || '', user.password_hash))
    ) {
      return res
        .status(401)
        .json({ message: 'Invalid username or password' })
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
    }

    res.json({
      user: safeUser,
      token: signToken(safeUser),
    })
  })
)

/* ================= PRODUCTS ================= */

app.get(
  '/api/products',
  authRequired,
  asyncRoute(async (req, res) => {
    const result = await query(
      'SELECT * FROM products ORDER BY id DESC'
    )

    res.json(result.rows.map(mapProduct))
  })
)

// SEARCH PRODUCTS
app.get(
  '/api/products/search',
  authRequired,
  asyncRoute(async (req, res) => {
    const search = String(req.query.q || '').trim()

    if (search.length < 2) {
      return res.json([])
    }

    const result = await query(
      `SELECT *
       FROM products
       WHERE name ILIKE $1
          OR brand ILIKE $1
          OR code ILIKE $1
          OR barcode ILIKE $1
       ORDER BY name
       LIMIT 8`,
      [`%${search}%`]
    )

    res.json(result.rows.map(mapProduct))
  })
)

// ADD PRODUCT
app.post(
  '/api/products',
  authRequired,
  asyncRoute(async (req, res) => {
    const product = req.body || {}

    if (!product.name?.trim()) {
      return res.status(400).json({
        message: 'Medicine name is required.',
      })
    }

    // Only Super Admin may set initial stock manually.
    const initialStock = isSuperAdmin(req.user)
      ? Math.max(0, Math.trunc(num(product.stock)))
      : 0

    const result = await query(
      `INSERT INTO products (
        code,
        name,
        brand,
        category,
        hsn,
        purchase_price,
        sale_price,
        mrp,
        stock,
        expiry,
        batch_no,
        barcode
      )
      VALUES (
        COALESCE(
          $1,
          'MED' ||
          LPAD(
            ((SELECT COALESCE(MAX(id), 0) + 1
              FROM products)::text),
            3,
            '0'
          )
        ),
        $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      RETURNING *`,
      [
        product.code || null,
        product.name.trim(),
        product.brand || null,
        product.category || null,
        product.hsn || null,
        num(product.purchasePrice),
        num(product.salePrice),
        num(product.mrp),
        initialStock,
        dateOnly(product.expiry),
        product.batchNo || null,
        product.barcode || null,
      ]
    )

    res.status(201).json(mapProduct(result.rows[0]))
  })
)

// EDIT PRODUCT
app.put(
  '/api/products/:id',
  authRequired,
  asyncRoute(async (req, res) => {
    const product = req.body || {}

    const existingResult = await query(
      'SELECT id, stock FROM products WHERE id = $1 LIMIT 1',
      [req.params.id]
    )

    const existing = existingResult.rows[0]

    if (!existing) {
      return res.status(404).json({
        message: 'Product not found.',
      })
    }

    const currentStock = Math.max(
      0,
      Math.trunc(num(existing.stock))
    )

    const requestedStock = Math.max(
      0,
      Math.trunc(num(product.stock))
    )

    // Block manual stock changes by ordinary Admins.
    if (
      !isSuperAdmin(req.user) &&
      product.stock !== undefined &&
      requestedStock !== currentStock
    ) {
      return res.status(403).json({
        message:
          'Only the Super Admin can manually edit medicine stock.',
        code: 'SUPER_ADMIN_STOCK_PERMISSION_REQUIRED',
      })
    }

    const stockToSave = isSuperAdmin(req.user) &&
      product.stock !== undefined
      ? requestedStock
      : currentStock

    const result = await query(
      `UPDATE products
       SET
         name = $1,
         brand = $2,
         category = $3,
         hsn = $4,
         purchase_price = $5,
         sale_price = $6,
         mrp = $7,
         stock = $8,
         expiry = $9,
         batch_no = $10,
         barcode = $11,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        product.name,
        product.brand || null,
        product.category || null,
        product.hsn || null,
        num(product.purchasePrice),
        num(product.salePrice),
        num(product.mrp),
        stockToSave,
        dateOnly(product.expiry),
        product.batchNo || null,
        product.barcode || null,
        req.params.id,
      ]
    )

    res.json(mapProduct(result.rows[0]))
  })
)

// DELETE PRODUCT
app.delete(
  '/api/products/:id',
  authRequired,
  asyncRoute(async (req, res) => {
    const result = await query(
      'SELECT id, stock FROM products WHERE id = $1 LIMIT 1',
      [req.params.id]
    )

    const product = result.rows[0]

    if (!product) {
      return res.status(404).json({
        message: 'Product not found.',
      })
    }

    if (
      !isSuperAdmin(req.user) &&
      Number(product.stock || 0) > 0
    ) {
      return res.status(403).json({
        message:
          'Only the Super Admin can delete a medicine that has stock.',
      })
    }

    await query(
      'DELETE FROM products WHERE id = $1',
      [req.params.id]
    )

    res.json({ success: true })
  })
)
/* ================= CUSTOMERS ================= */

app.get(
  '/api/customers/search',
  authRequired,
  asyncRoute(async (req, res) => {
    const phone = String(req.query.phone || '')
      .replace(/\D/g, '')

    if (phone.length < 3) {
      return res.json([])
    }

    const result = await query(
      `SELECT * FROM customers
       WHERE regexp_replace(phone, '\\D', '', 'g') LIKE $1
       ORDER BY updated_at DESC
       LIMIT 5`,
      [`${phone}%`]
    )

    res.json(result.rows.map(mapCustomer))
  })
)

app.get(
  '/api/customers',
  authRequired,
  asyncRoute(async (req, res) => {
    const result = await query(
      'SELECT * FROM customers ORDER BY updated_at DESC, id DESC'
    )

    res.json(result.rows.map(mapCustomer))
  })
)

/* ================= SUPPLIERS ================= */

app.get(
  '/api/suppliers',
  authRequired,
  asyncRoute(async (req, res) => {
    const result = await query(
      'SELECT * FROM suppliers ORDER BY id DESC'
    )

    res.json(result.rows.map(mapSupplier))
  })
)

app.post(
  '/api/suppliers',
  authRequired,
  asyncRoute(async (req, res) => {
    const s = req.body || {}

    const result = await query(
      `INSERT INTO suppliers
        (name,contact,email,gstin,address)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        s.name,
        s.contact || null,
        s.email || null,
        s.gstin || null,
        s.address || null,
      ]
    )

    res.status(201).json(mapSupplier(result.rows[0]))
  })
)

app.get('/api/suppliers/:id/transactions', authRequired, asyncRoute(async (req, res) => {
  
const result = await query(
  `SELECT
     p.id,
     p.invoice_no,
     p.invoice_date::text AS invoice_date,
     p.total_amount,
     COALESCE(COUNT(pi.id), 0)::int AS item_count,
     COALESCE(SUM(pi.quantity), 0)::int AS item_quantity
   FROM purchases p
   LEFT JOIN purchase_items pi ON pi.purchase_id = p.id
   WHERE p.supplier_id = $1
   GROUP BY p.id
   ORDER BY p.invoice_date DESC, p.id DESC`,
  [req.params.id]
);


  res.json(result.rows.map((r) => ({
    id: r.id,
    invoiceNo: r.invoice_no,
    date: dateOnly(r.invoice_date),
    totalAmount: num(r.total_amount),
    itemCount: Number(r.item_count || 0),
    itemQuantity: Number(r.item_quantity || 0),
  })))
}))

/* ================= PURCHASES ================= */

app.get(
  '/api/purchases',
  authRequired,
  asyncRoute(async (req, res) => {
    const result = await query(
      `SELECT
         p.*,
         s.name AS supplier_name
       FROM purchases p
       LEFT JOIN suppliers s
         ON s.id=p.supplier_id
       ORDER BY p.id DESC`
    )

    const items = await query(
      'SELECT * FROM purchase_items ORDER BY id'
    )

    res.json(
      result.rows.map((r) => ({
        id: r.id,
        supplierId: r.supplier_id,
        supplierName: r.supplier_name || '',
        invoiceNo: r.invoice_no,
        date: dateOnly(r.invoice_date),
        totalAmount: num(r.total_amount),

        items: items.rows
          .filter((i) => i.purchase_id === r.id)
          .map((i) => ({
            productId: i.product_id,
            name: i.product_name,
            batchNo: i.batch_no,
            expiry: dateOnly(i.expiry_date),
            qty: i.quantity,
            rate: num(i.rate),
            amount: num(i.amount),
          })),
      }))
    )
  })
)

/* ================= PURCHASE INVOICE NUMBER ================= */

async function nextPurchaseInvoiceNumber(client) {
  const result = await client.query(`
    CREATE SEQUENCE IF NOT EXISTS purchase_invoice_seq
    START WITH 1
  `)

  const sequenceResult = await client.query(`
    SELECT nextval('purchase_invoice_seq') AS sequence_no
  `)

  const now = new Date()

  const yyyy = now.getFullYear()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')

  const sequenceNo = String(
    sequenceResult.rows[0].sequence_no
  ).padStart(6, '0')

  return `PUR-${yyyy}${mm}${dd}-${sequenceNo}`
}


/* ================= PURCHASES ================= */

app.get(
  '/api/purchases',
  authRequired,
  asyncRoute(async (req, res) => {

    const result = await query(`
      SELECT
        p.*,
        s.name AS supplier_name,
        s.contact AS supplier_phone,
        s.address AS supplier_address
      FROM purchases p
      LEFT JOIN suppliers s
        ON s.id = p.supplier_id
      ORDER BY p.id DESC
    `)

    const items = await query(`
      SELECT *
      FROM purchase_items
      ORDER BY id
    `)

    res.json(
      result.rows.map((r) => {

        const purchaseItems =
          items.rows
            .filter(
              (item) =>
                item.purchase_id === r.id
            )
            .map((item) => ({
              productId: item.product_id,
              name: item.product_name,
              batchNo: item.batch_no,
              expiry: dateOnly(
                item.expiry_date
              ),
              qty: Number(
                item.quantity || 0
              ),
              rate: num(item.rate),
              amount: num(item.amount),
            }))

        return {
          id: r.id,

          supplierId:
            r.supplier_id,

          supplierName:
            r.supplier_name || '',

          supplierPhone:
            r.supplier_phone || '',

          supplierAddress:
            r.supplier_address || '',

          invoiceNo:
            r.invoice_no,

          date:
            dateOnly(r.invoice_date),

          totalAmount:
            num(r.total_amount),

          itemCount:
            purchaseItems.length,

          itemQuantity:
            purchaseItems.reduce(
              (sum, item) =>
                sum + Number(item.qty || 0),
              0
            ),

          items:
            purchaseItems,
        }
      })
    )
  })
)


app.post(
  '/api/purchases',
  authRequired,
  asyncRoute(async (req, res) => {

    const body = req.body || {}

    if (!body.supplierName?.trim()) {
      return res.status(400).json({
        message: 'Supplier name is required',
      })
    }

    if (!body.supplierPhone?.trim()) {
      return res.status(400).json({
        message:
          'Supplier phone number is required',
      })
    }

    if (!body.supplierAddress?.trim()) {
      return res.status(400).json({
        message:
          'Supplier address is required',
      })
    }

    if (!body.items?.length) {
      return res.status(400).json({
        message:
          'At least one medicine is required',
      })
    }

    const client = await pool.connect()

    try {

      await client.query('BEGIN')

      /* =====================================================
         1. FIND OR CREATE SUPPLIER
      ===================================================== */

      let supplierId =
        Number(body.supplierId) || null

      let supplier

      if (supplierId) {

        const supplierResult =
          await client.query(
            `
              SELECT *
              FROM suppliers
              WHERE id=$1
              FOR UPDATE
            `,
            [supplierId]
          )

        supplier =
          supplierResult.rows[0] || null
      }

      /* Find by name if ID was not supplied */
      if (!supplier) {

        const supplierResult =
          await client.query(
            `
              SELECT *
              FROM suppliers
              WHERE LOWER(TRIM(name))
                    = LOWER(TRIM($1))
              ORDER BY id
              LIMIT 1
              FOR UPDATE
            `,
            [body.supplierName]
          )

        supplier =
          supplierResult.rows[0] || null
      }

      /* Existing supplier */
      if (supplier) {

        supplierId = supplier.id

        const updatedSupplier =
          await client.query(
            `
              UPDATE suppliers
              SET
                name=$1,
                contact=$2,
                address=$3
              WHERE id=$4
              RETURNING *
            `,
            [
              body.supplierName.trim(),
              body.supplierPhone.trim(),
              body.supplierAddress.trim(),
              supplierId,
            ]
          )

        supplier =
          updatedSupplier.rows[0]
      }

      /* New supplier */
      if (!supplier) {

        const newSupplier =
          await client.query(
            `
              INSERT INTO suppliers
                (
                  name,
                  contact,
                  address
                )
              VALUES
                ($1,$2,$3)
              RETURNING *
            `,
            [
              body.supplierName.trim(),
              body.supplierPhone.trim(),
              body.supplierAddress.trim(),
            ]
          )

        supplier =
          newSupplier.rows[0]

        supplierId =
          supplier.id
      }

      /* =====================================================
         2. GENERATE UNIQUE INVOICE NUMBER
      ===================================================== */

      const invoiceNo =
        await nextPurchaseInvoiceNumber(
          client
        )

      /* =====================================================
         3. CREATE PURCHASE
      ===================================================== */

      const purchaseResult =
        await client.query(
          `
            INSERT INTO purchases
              (
                supplier_id,
                invoice_no,
                invoice_date,
                total_amount,
                created_by
              )
            VALUES
              ($1,$2,$3,$4,$5)
            RETURNING *
          `,
          [
            supplierId,
            invoiceNo,
            dateOnly(body.invoiceDate) ||
              dateOnly(new Date()),
            num(body.totalAmount),
            req.user.id,
          ]
        )

      const purchase =
        purchaseResult.rows[0]

      /* =====================================================
         4. PROCESS MEDICINES
      ===================================================== */

      for (const item of body.items) {

        const qty = Math.max(
          1,
          Math.trunc(
            num(
              item.qty ||
              item.quantity
            )
          )
        )

        const rate =
          num(item.rate)

        const salePrice =
          num(item.salePrice)

        const mrp =
          num(item.mrp)

        const amount =
          num(item.amount) ||
          qty * rate

        let productId =
          Number(item.productId) || null

        let product = null

        /* Existing product */
        if (productId) {

          const productResult =
            await client.query(
              `
                SELECT *
                FROM products
                WHERE id=$1
                FOR UPDATE
              `,
              [productId]
            )

          product =
            productResult.rows[0] ||
            null
        }

        /* Try medicine name + batch */
        if (!product && item.name) {

          const existing =
            await client.query(
              `
                SELECT *
                FROM products
                WHERE LOWER(name)
                      = LOWER($1)
                  AND COALESCE(batch_no,'')
                      = COALESCE($2,'')
                ORDER BY id
                LIMIT 1
                FOR UPDATE
              `,
              [
                item.name.trim(),
                item.batchNo || null,
              ]
            )

          product =
            existing.rows[0] || null

          productId =
            product?.id || null
        }

        /* ===================================================
           NEW PRODUCT
        =================================================== */

        if (!product) {

          const newProduct =
            await client.query(
              `
                INSERT INTO products
                  (
                    name,
                    brand,
                    category,
                    purchase_price,
                    sale_price,
                    mrp,
                    stock,
                    expiry,
                    batch_no
                  )
                VALUES
                  (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7,
                    $8,
                    $9
                  )
                RETURNING *
              `,
              [
                item.name.trim(),
                item.brand || null,
                item.category || null,
                rate,
                salePrice,
                mrp,
                qty,
                dateOnly(item.expiry),
                item.batchNo || null,
              ]
            )

          product =
            newProduct.rows[0]

          productId =
            product.id

        } else {

          /* =================================================
             EXISTING PRODUCT → INCREASE STOCK
          ================================================= */

          const updatedProduct =
            await client.query(
              `
                UPDATE products
                SET
                  stock = stock + $1,

                  purchase_price =
                    CASE
                      WHEN $2 > 0
                      THEN $2
                      ELSE purchase_price
                    END,

                  sale_price =
                    CASE
                      WHEN $3 > 0
                      THEN $3
                      ELSE sale_price
                    END,

                  mrp =
                    CASE
                      WHEN $4 > 0
                      THEN $4
                      ELSE mrp
                    END,

                  brand =
                    COALESCE($5,brand),

                  category =
                    COALESCE($6,category),

                  expiry =
                    COALESCE($7,expiry),

                  batch_no =
                    COALESCE($8,batch_no),

                  updated_at =
                    CURRENT_TIMESTAMP

                WHERE id=$9

                RETURNING *
              `,
              [
                qty,
                rate,
                salePrice,
                mrp,
                item.brand || null,
                item.category || null,
                dateOnly(item.expiry),
                item.batchNo || null,
                productId,
              ]
            )

          product =
            updatedProduct.rows[0]
        }

        /* ===================================================
           PURCHASE ITEM
        =================================================== */

        await client.query(
          `
            INSERT INTO purchase_items
              (
                purchase_id,
                product_id,
                product_name,
                batch_no,
                expiry_date,
                quantity,
                rate,
                amount
              )
            VALUES
              ($1,$2,$3,$4,$5,$6,$7,$8)
          `,
          [
            purchase.id,
            productId,

            item.name ||
              product.name,

            item.batchNo ||
              product.batch_no,

            dateOnly(
              item.expiry
            ) ||
              dateOnly(
                product.expiry
              ),

            qty,
            rate,
            amount,
          ]
        )
      }

      /* =====================================================
         5. COMMIT
      ===================================================== */

      await client.query('COMMIT')

      res.status(201).json({
        success: true,

        id:
          purchase.id,

        supplierId,

        supplierName:
          supplier.name,

        supplierPhone:
          supplier.contact || '',

        supplierAddress:
          supplier.address || '',

        invoiceNo,

        date:
          dateOnly(
            purchase.invoice_date
          ),

        totalAmount:
          num(
            purchase.total_amount
          ),
      })

    } catch (error) {

      await client.query(
        'ROLLBACK'
      )

      throw error

    } finally {

      client.release()
    }
  })
)

/* ================= SALES ================= */

app.get(
  '/api/bills',
  authRequired,
  asyncRoute(async (req, res) => {
    const bills = await query(
      'SELECT * FROM sales ORDER BY id DESC'
    )

    const items = await query(
      'SELECT * FROM sale_items ORDER BY id'
    )

    res.json(
      bills.rows.map((b) => ({
        id: b.id,
        billNo: b.bill_no,
        date: b.sale_date,

        customer: b.customer_name || 'Walk-in',
        customerName: b.customer_name || 'Walk-in',
        customerPhone: b.customer_phone || '',
        customerAddress: b.customer_address || '',

        paymentMethod:
          b.payment_method || 'Cash',

        billedBy: b.billed_by || '',

        subtotal: num(b.subtotal),
        discount: num(b.discount_amount),
        tax: num(b.tax),
        grandTotal: num(b.grand_total),

        items: items.rows
          .filter((i) => i.sale_id === b.id)
          .map((i) => ({
            productId: i.product_id,
            name: i.product_name,
            qty: i.quantity,
            price: num(i.price),
            amount: num(i.amount),
            batchNo: i.batch_no,
          })),
      }))
    )
  })
)

app.get(
  '/api/bills/:billNo',
  authRequired,
  asyncRoute(async (req, res) => {
    const bill = await query(
      `SELECT
         s.*,
         c.id customer_id,
         c.name customer_db_name,
         c.phone customer_db_phone,
         c.address customer_db_address
       FROM sales s
       LEFT JOIN customers c
         ON c.id=s.customer_id
       WHERE s.bill_no=$1
       LIMIT 1`,
      [req.params.billNo]
    )

    if (!bill.rows[0]) {
      return res
        .status(404)
        .json({ message: 'Sale not found' })
    }

    const b = bill.rows[0]

    const items = await query(
      'SELECT * FROM sale_items WHERE sale_id=$1 ORDER BY id',
      [b.id]
    )

    res.json({
      id: b.id,
      billNo: b.bill_no,
      date: b.sale_date,

      customer: b.customer_name || 'Walk-in',
      customerName: b.customer_name || 'Walk-in',
      customerPhone: b.customer_phone || '',
      customerAddress: b.customer_address || '',

      paymentMethod:
        b.payment_method || 'Cash',

      billedBy: b.billed_by || '',

      subtotal: num(b.subtotal),
      discount: num(b.discount_amount),
      discountType: b.discount_type || 'percent',
      discountValue: num(b.discount_value),
      tax: num(b.tax),
      grandTotal: num(b.grand_total),

      items: items.rows.map((i) => ({
        productId: i.product_id,
        name: i.product_name,
        qty: i.quantity,
        price: num(i.price),
        amount: num(i.amount),
        batchNo: i.batch_no,
      })),
    })
  })
)

app.post(
  '/api/bills',
  authRequired,
  asyncRoute(async (req, res) => {
    const b = req.body || {}

    if (!b.items?.length) {
      return res
        .status(400)
        .json({ message: 'Add at least one medicine' })
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const customer = await upsertCustomer(
        client,
        b.customer || {
          name: b.customerName,
          phone: b.customerPhone,
          address: b.customerAddress,
          type: b.customerType,
        }
      )

      const billNo = await nextBillNumber(client)

      const sr = await client.query(
        `INSERT INTO sales
          (
            bill_no,
            customer_id,
            customer_name,
            customer_phone,
            customer_address,
            subtotal,
            discount_type,
            discount_value,
            discount_amount,
            tax,
            grand_total,
            payment_method,
            billed_by,
            created_by
          )
         VALUES
          (
            $1,$2,$3,$4,$5,$6,$7,$8,
            $9,$10,$11,$12,$13,$14
          )
         RETURNING *`,
        [
          billNo,
          customer?.id || null,
          b.customerName ||
            b.customer?.name ||
            'Walk-in',
          b.customerPhone ||
            b.customer?.phone ||
            null,
          b.customerAddress ||
            b.customer?.address ||
            null,
          num(b.subtotal),
          b.discountType || null,
          num(b.discountValue),
          num(b.discountAmount || b.discount),
          num(b.tax),
          num(b.grandTotal),
          b.paymentMethod || 'Cash',
          b.billedBy?.name ||
            b.billedBy ||
            null,
          req.user.id,
        ]
      )

      const sale = sr.rows[0]

      for (const item of b.items) {
        const qty = Math.max(
          1,
          Math.trunc(
            num(item.qty || item.quantity)
          )
        )

        const productId = Number(item.productId)

        const pr = await client.query(
          'SELECT * FROM products WHERE id=$1 FOR UPDATE',
          [productId]
        )

        if (!pr.rows[0]) {
          throw new Error(
            `Product ${item.name || productId} not found`
          )
        }

        if (Number(pr.rows[0].stock) < qty) {
          throw new Error(
            `Insufficient stock for ${pr.rows[0].name}`
          )
        }

        const price = num(
          item.price || item.salePrice
        )

        const amount =
          num(item.amount) || qty * price

        await client.query(
          `UPDATE products
           SET
             stock=stock-$1,
             updated_at=CURRENT_TIMESTAMP
           WHERE id=$2`,
          [qty, productId]
        )

        await client.query(
          `INSERT INTO sale_items
            (
              sale_id,
              product_id,
              product_name,
              batch_no,
              quantity,
              price,
              amount
            )
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            sale.id,
            productId,
            item.name ||
              pr.rows[0].name,
            pr.rows[0].batch_no,
            qty,
            price,
            amount,
          ]
        )
      }

      await client.query('COMMIT')

      res.status(201).json({
        id: sale.id,
        billNumber: sale.bill_no,
        date: sale.sale_date,

        customer: {
          name: sale.customer_name,
          phone: sale.customer_phone,
          address: sale.customer_address,
        },

        paymentMethod:
          sale.payment_method,

        subtotal: num(sale.subtotal),
        discountType:
          sale.discount_type,
        discountValue:
          num(sale.discount_value),
        discountAmount:
          num(sale.discount_amount),
        tax: num(sale.tax),
        grandTotal:
          num(sale.grand_total),

        billedBy: sale.billed_by,
        items: b.items,
      })
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  })
)

/* ================= RETURNS ================= */

app.post(
  '/api/returns',
  authRequired,
  asyncRoute(async (req, res) => {
    const b = req.body || {}

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const sr = await client.query(
        `SELECT id
         FROM sales
         WHERE bill_no=$1
         LIMIT 1
         FOR UPDATE`,
        [b.billNo]
      )

      if (!sr.rows[0]) {
        await client.query('ROLLBACK')

        return res
          .status(404)
          .json({ message: 'Sale not found' })
      }

      const saleId = sr.rows[0].id

      const saleItems = await client.query(
        `SELECT product_id,quantity,price
         FROM sale_items
         WHERE sale_id=$1`,
        [saleId]
      )

      const originalByProduct = new Map(
        saleItems.rows.map((i) => [
          Number(i.product_id),
          Number(i.quantity),
        ])
      )

      const alreadyReturned =
        await client.query(
          `SELECT
             ri.product_id,
             COALESCE(SUM(ri.quantity),0)::int returned_qty
           FROM return_items ri
           JOIN returns r
             ON r.id=ri.return_id
           WHERE r.sale_id=$1
           GROUP BY ri.product_id`,
          [saleId]
        )

      const returnedByProduct = new Map(
        alreadyReturned.rows.map((i) => [
          Number(i.product_id),
          Number(i.returned_qty),
        ])
      )

      const cleanItems = (b.items || [])
        .map((i) => ({
          productId: Number(i.productId),
          name: i.name,
          returnQty: Math.trunc(
            num(i.returnQty)
          ),
          price: num(i.price),
        }))
        .filter((i) => i.returnQty > 0)

      if (!cleanItems.length) {
        await client.query('ROLLBACK')

        return res
          .status(400)
          .json({
            message:
              'Select at least one item to return',
          })
      }

      for (const item of cleanItems) {
        const sold =
          originalByProduct.get(
            item.productId
          ) || 0

        const returned =
          returnedByProduct.get(
            item.productId
          ) || 0

        if (
          item.returnQty >
          sold - returned
        ) {
          await client.query('ROLLBACK')

          return res
            .status(400)
            .json({
              message:
                `Return quantity exceeds the remaining quantity for ${item.name}`,
            })
        }
      }

      const total = cleanItems.reduce(
        (s, i) =>
          s + i.returnQty * i.price,
        0
      )

      const now = new Date()

      const returnNo =
        `CN-${now.getFullYear()}` +
        `${String(now.getMonth() + 1).padStart(2, '0')}` +
        `${String(now.getDate()).padStart(2, '0')}-` +
        `${Date.now().toString().slice(-5)}`

      const rr = await client.query(
        `INSERT INTO returns
          (
            return_no,
            sale_id,
            reason,
            total_amount,
            created_by
          )
         VALUES ($1,$2,$3,$4,$5)
         RETURNING *`,
        [
          returnNo,
          saleId,
          b.reason || null,
          total,
          req.user.id,
        ]
      )

      for (const item of cleanItems) {
        await client.query(
          `INSERT INTO return_items
            (
              return_id,
              product_id,
              product_name,
              quantity,
              price,
              amount
            )
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [
            rr.rows[0].id,
            item.productId,
            item.name,
            item.returnQty,
            item.price,
            item.returnQty * item.price,
          ]
        )

        await client.query(
          `UPDATE products
           SET
             stock=stock+$1,
             updated_at=CURRENT_TIMESTAMP
           WHERE id=$2`,
          [
            item.returnQty,
            item.productId,
          ]
        )
      }

      await client.query('COMMIT')

      res.status(201).json({
        success: true,
        returnNo,
        totalAmount: total,
      })
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  })
)

/* ================= DASHBOARD ================= */

app.get(
  '/api/dashboard/stats',
  authRequired,
  asyncRoute(async (req, res) => {
    const [
      sales,
      products,
      suppliers,
      categories,
      low,
      expiry,
      expired,
      stockValue,
      monthly,
    ] = await Promise.all([
      query(
        `SELECT
           COALESCE(SUM(grand_total),0) value
         FROM sales
         WHERE sale_date::date=CURRENT_DATE`
      ),

      query(
        'SELECT COUNT(*) value FROM products'
      ),

      query(
        'SELECT COUNT(*) value FROM suppliers'
      ),

      query(
        `SELECT COUNT(DISTINCT category) value
         FROM products
         WHERE category IS NOT NULL
           AND category<>''`
      ),

      query(
        `SELECT COUNT(*) value
         FROM products
         WHERE stock<=20`
      ),

      query(
        `SELECT COUNT(*) value
         FROM products
         WHERE expiry BETWEEN
           CURRENT_DATE
           AND CURRENT_DATE + INTERVAL '3 months'`
      ),

      query(
        `SELECT COUNT(*) value
         FROM products
         WHERE expiry<CURRENT_DATE`
      ),

      query(
        `SELECT
           COALESCE(
             SUM(purchase_price*stock),
             0
           ) value
         FROM products`
      ),

      /* FIXED MONTHLY SALES QUERY */
      query(
        `SELECT
           TO_CHAR(
             date_trunc('month', sale_date),
             'Mon'
           ) AS month_name,

           EXTRACT(
             MONTH FROM sale_date
           )::int AS month_no,

           COALESCE(
             SUM(grand_total),
             0
           ) AS value

         FROM sales

         WHERE sale_date >=
           date_trunc(
             'year',
             CURRENT_DATE
           )

         GROUP BY 1,2
         ORDER BY 2`
      ),
    ])

    res.json({
      todaySales:
        num(sales.rows[0].value),

      totalProducts:
        Number(products.rows[0].value),

      lowStockCount:
        Number(low.rows[0].value),

      expiringSoonCount:
        Number(expiry.rows[0].value),

      totalStockValue:
        num(stockValue.rows[0].value),

      totalSuppliers:
        Number(suppliers.rows[0].value),

      totalCategories:
        Number(categories.rows[0].value),

      expiredItems:
        Number(expired.rows[0].value),

      monthlySales:
        monthly.rows.map((r) => ({
          month: r.month_name,
          value: num(r.value),
        })),
    })
  })
)

/* ================= REPORTS ================= */

app.get(
  '/api/reports/:type',
  authRequired,
  asyncRoute(async (req, res) => {
    const type = req.params.type

    const from = req.query.from || null
    const to = req.query.to || null

    const params = []

    const whereDate = (column) => {
      const clauses = []

      if (from) {
        params.push(from)
        clauses.push(
          `${column}::date >= $${params.length}`
        )
      }

      if (to) {
        params.push(to)
        clauses.push(
          `${column}::date <= $${params.length}`
        )
      }

      return clauses.length
        ? `WHERE ${clauses.join(' AND ')}`
        : ''
    }


if (
  type === 'today-sales' ||
  type === 'sales'
) {
  const condition =
    type === 'today-sales'
      ? 'WHERE s.sale_date::date = CURRENT_DATE'
      : whereDate('s.sale_date')

  const r = await query(
    `SELECT
       s.id,
       s.sale_date AS date,
       s.bill_no AS bill_no,
       s.customer_name AS customer,
       s.customer_phone AS phone,
       s.payment_method AS payment_method,
       s.grand_total AS amount,

       COALESCE(
         SUM(si.quantity),
         0
       )::int AS quantity

     FROM sales s

     LEFT JOIN sale_items si
       ON si.sale_id = s.id

     ${condition}

     GROUP BY
       s.id,
       s.sale_date,
       s.bill_no,
       s.customer_name,
       s.customer_phone,
       s.payment_method,
       s.grand_total

     ORDER BY s.sale_date DESC, s.id DESC`,
    params
  )

  return res.json(
    r.rows.map((x) => ({
      id: x.id,
      date: x.date,
      billNo: x.bill_no,
      customer: x.customer || '',
      phone: x.phone || '',
      paymentMethod:
        x.payment_method || 'Cash',
      amount: num(x.amount),
      quantity: Number(x.quantity || 0),
    }))
  )
}


    


if (type === 'purchases') {
  const r = await query(
    `SELECT
       p.id,
       p.invoice_date::date::text AS date,
       p.invoice_no AS invoice_no,
       s.name AS supplier,
       p.total_amount AS amount,
       COALESCE(SUM(pi.quantity), 0)::int AS quantity
     FROM purchases p
     LEFT JOIN suppliers s
       ON s.id = p.supplier_id
     LEFT JOIN purchase_items pi
       ON pi.purchase_id = p.id
     ${whereDate('p.invoice_date')}
     GROUP BY
       p.id,
       p.invoice_date,
       p.invoice_no,
       s.name,
       p.total_amount
     ORDER BY p.invoice_date DESC, p.id DESC`,
    params
  )

  return res.json(
    r.rows.map((x) => ({
      id: x.id,
      date: dateOnly(x.date),
      invoiceNo: x.invoice_no,
      supplier: x.supplier || '',
      amount: num(x.amount),
      quantity: Number(x.quantity || 0),
    }))
  )
}




    if (type === 'stock') {
      const r = await query(
        'SELECT * FROM products ORDER BY name'
      )

      return res.json(
        r.rows.map(mapProduct)
      )
    }

    if (type === 'customers') {
      const r = await query(
        `SELECT
           c.id,
           c.name,
           c.phone,
           c.address,
           c.customer_type,

           COUNT(s.id)::int total_bills,

           COALESCE(
             SUM(s.grand_total),
             0
           ) total_amount,

           MAX(s.sale_date) last_sale

         FROM customers c

         LEFT JOIN sales s
           ON s.customer_id=c.id

         GROUP BY c.id

         ORDER BY c.name`
      )

      return res.json(
        r.rows.map((x) => ({
          id: x.id,
          name: x.name,
          phone: x.phone,
          address: x.address || '',
          customerType:
            x.customer_type,
          totalBills:
            Number(x.total_bills),
          totalAmount:
            num(x.total_amount),
          lastSale:
            x.last_sale,
        }))
      )
    }

    if (type === 'suppliers') {
      const r = await query(
        `SELECT
           s.id,
           s.name,
           s.contact,
           s.email,

           COUNT(p.id)::int
             total_purchases,

           COALESCE(
             SUM(p.total_amount),
             0
           ) total_amount,

           MAX(p.invoice_date)
             last_purchase

         FROM suppliers s

         LEFT JOIN purchases p
           ON p.supplier_id=s.id

         GROUP BY s.id

         ORDER BY s.name`
      )

      return res.json(
        r.rows.map((x) => ({
          id: x.id,
          name: x.name,
          contact: x.contact || '',
          email: x.email || '',
          totalPurchases:
            Number(x.total_purchases),
          totalAmount:
            num(x.total_amount),
          lastPurchase:
            x.last_purchase,
        }))
      )
    }

    if (type === 'expiry') {
      const r = await query(
        `SELECT *
         FROM products
         WHERE expiry IS NOT NULL
         ORDER BY expiry`
      )

      return res.json(
        r.rows.map((p) => ({
          productId: p.id,
          name: p.name,
          batchNo: p.batch_no,
          expiry: dateOnly(p.expiry),
          stock: Number(p.stock),
          category: p.category || '',
        }))
      )
    }

    if (type === 'amount') {
      const r = await query(
        `SELECT
           sale_date date,
           bill_no bill_no,
           customer_name customer,
           subtotal,
           discount_amount discount,
           grand_total amount,
           payment_method payment_method

         FROM sales
         ${whereDate('sale_date')}

         ORDER BY sale_date DESC`,
        params
      )

      return res.json(
        r.rows.map((x) => ({
          date: x.date,
          billNo: x.bill_no,
          customer: x.customer || '',
          subtotal: num(x.subtotal),
          discount: num(x.discount),
          amount: num(x.amount),
          paymentMethod:
            x.payment_method || 'Cash',
        }))
      )
    }

    if (type === 'low-stock') {
      const r = await query(
        `SELECT *
         FROM products
         WHERE stock<=20
         ORDER BY stock ASC,name`
      )

      return res.json(
        r.rows.map(mapProduct)
      )
    }

    if (type === 'returns') {
      const r = await query(
        `SELECT
           r.created_at date,
           r.return_no return_no,
           s.bill_no bill_no,
           s.customer_name customer,
           r.total_amount amount,
           r.reason

         FROM returns r

         LEFT JOIN sales s
           ON s.id=r.sale_id

         ${whereDate('r.created_at')}

         ORDER BY r.created_at DESC`,
        params
      )

      return res.json(
        r.rows.map((x) => ({
          date: x.date,
          returnNo: x.return_no,
          billNo: x.bill_no || '',
          customer: x.customer || '',
          amount: num(x.amount),
          reason: x.reason || '',
        }))
      )
    }

    if (type === 'payments') {
      const r = await query(
        `SELECT
           payment_method payment_method,
           COUNT(*)::int count,
           COALESCE(
             SUM(grand_total),
             0
           ) amount

         FROM sales

         ${whereDate('sale_date')}

         GROUP BY payment_method

         ORDER BY amount DESC`,
        params
      )

      return res.json(
        r.rows.map((x) => ({
          paymentMethod:
            x.payment_method || 'Cash',
          count: Number(x.count),
          amount: num(x.amount),
        }))
      )
    }

    if (type === 'sales-items') {
      const r = await query(
        `SELECT
           si.product_name product,
           COALESCE(
             SUM(si.quantity),
             0
           )::int quantity,

           COALESCE(
             SUM(si.amount),
             0
           ) amount

         FROM sale_items si

         JOIN sales s
           ON s.id=si.sale_id

         ${whereDate('s.sale_date')}

         GROUP BY si.product_name

         ORDER BY quantity DESC`,
        params
      )

      return res.json(
        r.rows.map((x) => ({
          product: x.product,
          quantity:
            Number(x.quantity),
          amount:
            num(x.amount),
        }))
      )
    }

    res.json([])
  })
)
/* =====================================================
   REPORT DETAIL ROUTE
   Place before app.listen(...)
===================================================== */

app.get(
  '/api/report-details/:kind/:id',
  authRequired,
  asyncRoute(async (req, res) => {
    const { kind, id } = req.params
    let result

    if (kind === 'sale') {
      result = await query(
        `SELECT
           s.*,
           s.bill_no AS "billNo",
           s.sale_date AS date,
           s.customer_name AS customer,
           s.customer_phone AS "customerPhone",
           s.customer_address AS "customerAddress",
           s.payment_method AS "paymentMethod",
           s.billed_by AS "billedBy",
           s.subtotal,
           s.discount_amount AS discount,
           s.tax,
           s.grand_total AS "grandTotal"
         FROM sales s
         WHERE s.bill_no::text = $1 OR s.id::text = $1
         LIMIT 1`,
        [id]
      )

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Sale not found' })
      }

      const sale = result.rows[0]
      const items = await query(
        `SELECT
           id,
           product_id AS "productId",
           product_name AS name,
           batch_no AS "batchNo",
           quantity AS qty,
           price,
           amount
         FROM sale_items
         WHERE sale_id = $1
         ORDER BY id`,
        [sale.id]
      )

      return res.json({
        ...sale,
        subtotal: num(sale.subtotal),
        discount: num(sale.discount),
        tax: num(sale.tax),
        grandTotal: num(sale.grandTotal),
        items: items.rows.map((item) => ({
          ...item,
          qty: Number(item.qty || 0),
          price: num(item.price),
          amount: num(item.amount),
        })),
      })
    }

    if (kind === 'purchase') {
      result = await query(
        `SELECT
           p.*,
           p.invoice_no AS "invoiceNo",
           p.invoice_date::date::text AS date,
           p.total_amount AS "totalAmount",
           s.name AS supplier,
           s.contact AS "supplierContact",
           s.address AS "supplierAddress"
         FROM purchases p
         LEFT JOIN suppliers s ON s.id = p.supplier_id
         WHERE p.id::text = $1 OR p.invoice_no::text = $1
         LIMIT 1`,
        [id]
      )

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Purchase not found' })
      }

      const purchase = result.rows[0]
      const items = await query(
        `SELECT
           id,
           product_id AS "productId",
           product_name AS name,
           batch_no AS "batchNo",
           expiry_date AS expiry,
           quantity AS qty,
           rate,
           amount
         FROM purchase_items
         WHERE purchase_id = $1
         ORDER BY id`,
        [purchase.id]
      )

      return res.json({
        ...purchase,
        totalAmount: num(purchase.totalAmount),
        items: items.rows.map((item) => ({
          ...item,
          qty: Number(item.qty || 0),
          rate: num(item.rate),
          amount: num(item.amount),
          expiry: item.expiry ? dateOnly(item.expiry) : null,
        })),
      })
    }

    if (kind === 'medicine') {
      result = await query(
        'SELECT * FROM products WHERE id::text = $1 LIMIT 1',
        [id]
      )

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Medicine not found' })
      }

      const p = result.rows[0]

      return res.json({
        ...p,
        productId: p.id,
        purchasePrice: num(p.purchase_price),
        salePrice: num(p.sale_price),
        mrp: num(p.mrp),
        stock: Number(p.stock || 0),
        expiry: p.expiry ? dateOnly(p.expiry) : null,
      })
    }

    if (kind === 'customer') {
      result = await query(
        `SELECT
           c.*,
           COUNT(s.id)::int AS "totalBills",
           COALESCE(SUM(s.grand_total), 0) AS "totalAmount",
           MAX(s.sale_date) AS "lastSale"
         FROM customers c
         LEFT JOIN sales s ON s.customer_id = c.id
         WHERE c.id::text = $1
         GROUP BY c.id
         LIMIT 1`,
        [id]
      )

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Customer not found' })
      }

      const customer = result.rows[0]
      const transactions = await query(
        `SELECT
           id,
           bill_no AS "billNo",
           sale_date AS date,
           payment_method AS "paymentMethod",
           grand_total AS amount
         FROM sales
         WHERE customer_id = $1
         ORDER BY sale_date DESC, id DESC`,
        [customer.id]
      )

      return res.json({
        ...customer,
        totalAmount: num(customer.totalAmount),
        transactions: transactions.rows.map((row) => ({
          ...row,
          amount: num(row.amount),
        })),
      })
    }

    if (kind === 'supplier') {
      result = await query(
        `SELECT
           s.*,
           COUNT(p.id)::int AS "totalPurchases",
           COALESCE(SUM(p.total_amount), 0) AS "totalAmount",
           MAX(p.invoice_date) AS "lastPurchase"
         FROM suppliers s
         LEFT JOIN purchases p ON p.supplier_id = s.id
         WHERE s.id::text = $1
         GROUP BY s.id
         LIMIT 1`,
        [id]
      )

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Supplier not found' })
      }

      const supplier = result.rows[0]
      const transactions = await query(
        `SELECT
           id,
           invoice_no AS "invoiceNo",
           invoice_date AS date,
           total_amount AS amount
         FROM purchases
         WHERE supplier_id = $1
         ORDER BY invoice_date DESC, id DESC`,
        [supplier.id]
      )

      return res.json({
        ...supplier,
        totalAmount: num(supplier.totalAmount),
        transactions: transactions.rows.map((row) => ({
          ...row,
          amount: num(row.amount),
        })),
      })
    }

    if (kind === 'return') {
      result = await query(
        `SELECT
           r.*,
           r.return_no AS "returnNo",
           r.total_amount AS "totalAmount",
           r.created_at AS date,
           s.bill_no AS "billNo",
           s.customer_name AS customer
         FROM returns r
         LEFT JOIN sales s ON s.id = r.sale_id
         WHERE r.id::text = $1 OR r.return_no::text = $1
         LIMIT 1`,
        [id]
      )

      if (!result.rows[0]) {
        return res.status(404).json({ message: 'Return not found' })
      }

      const record = result.rows[0]
      const items = await query(
        `SELECT
           id,
           product_id AS "productId",
           product_name AS name,
           quantity AS qty,
           price,
           amount
         FROM return_items
         WHERE return_id = $1
         ORDER BY id`,
        [record.id]
      )

      return res.json({
        ...record,
        totalAmount: num(record.totalAmount),
        items: items.rows.map((item) => ({
          ...item,
          qty: Number(item.qty || 0),
          price: num(item.price),
          amount: num(item.amount),
        })),
      })
    }

    return res.status(400).json({
      message: 'Unsupported report detail type',
    })
  })
)
/* ================= SETTINGS ================= */

app.get(
  '/api/settings',
  authRequired,
  asyncRoute(async (req, res) => {
    const r = await query(
      'SELECT * FROM store_settings WHERE id=1'
    )

    res.json(r.rows[0] || {})
  })
)

app.put(
  '/api/settings',
  authRequired,
  asyncRoute(async (req, res) => {
    const s = req.body || {}

    const r = await query(
      `UPDATE store_settings
       SET
         name=$1,
         subtitle=$2,
         phone=$3,
         email=$4,
         address=$5,
         gstin=$6,
         updated_at=CURRENT_TIMESTAMP
       WHERE id=1
       RETURNING *`,
      [
        s.name,
        s.subtitle,
        s.phone,
        s.email,
        s.address,
        s.gstin,
      ]
    )

    res.json(r.rows[0])
  })
)

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    message:
      err.message || 'Server error',
  })
})

/* ================= SERVER ================= */

async function startServer() {
  try {
    // Create or update the Super Admin account first
    await initializeSuperAdmin()

    // Start the server after initialization succeeds
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to initialize server:', error)
    process.exit(1)
  }
}

startServer()