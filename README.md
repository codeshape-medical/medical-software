# City Care Hospital — Medical Store Management (Frontend)

A production-ready React frontend for a pharmacy / medical store ERP: Login →
Dashboard → Billing (POS), Products, Purchase, Inventory, Expiry Management,
Suppliers, Reports, Returns and Settings. Built to run entirely on mock data
today, and connect to a real backend later by editing **one file**.

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

**Demo login:** username `admin`, password `admin123`

## Project structure

```
medical-store/
├── src/
│   ├── App.jsx              # routes + protected dashboard shell (sidebar/navbar)
│   ├── main.jsx
│   ├── index.css            # Tailwind + shared classes (.card, .btn-primary, .input-field...)
│   │
│   ├── components/
│   │   ├── Sidebar.jsx      # navy blue sidebar, shared by every dashboard section
│   │   └── Navbar.jsx       # top header, shared by every dashboard section
│   │
│   ├── pages/                # ONE FILE = ONE FULL DASHBOARD SECTION (fully self-contained)
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Products.jsx      # product list + add/edit medicine form
│   │   ├── Purchase.jsx
│   │   ├── Billing.jsx       # POS screen
│   │   ├── Inventory.jsx
│   │   ├── ExpiryManagement.jsx
│   │   ├── Suppliers.jsx
│   │   ├── Reports.jsx
│   │   ├── Returns.jsx
│   │   └── Settings.jsx
│   │
│   ├── services/
│   │   └── api.js            # <-- CONNECT YOUR BACKEND HERE (only file to change)
│   │
│   └── data/
│       └── dummyData.js      # mock database used until the backend is ready
│
├── tailwind.config.js        # all theme colors (navy blue sidebar, accents) defined here
└── vite.config.js
```

## Connecting your real backend later

Everything in every page calls functions from `src/services/api.js`
(`getProducts()`, `createBill()`, `login()`, etc.) — no page ever touches
`dummyData.js` or `axios` directly.

1. Copy `.env.example` to `.env` and set:
   ```
   VITE_API_BASE_URL=https://your-api.com/api
   VITE_USE_MOCK_DATA=false
   ```
2. Open `src/services/api.js`. Every function already has the matching
   `axios` call written and commented out right below the mock line — just
   delete the mock line and uncomment the real one. Example:

   ```js
   export async function getProducts() {
     if (USE_MOCK) return delay(db.products)
     const { data } = await http.get('/products')   // uncomment this
     return data                                      // uncomment this
   }
   ```

3. That's it — no component, page, or route needs to change.

## Editing the design

All colors live in `tailwind.config.js` under `theme.extend.colors`
(`navy`, `brand`, `surface`). Change a value there and it updates across the
whole app — sidebar, buttons, stat cards, badges.

## Notes

- Authentication is currently a mock check (`admin` / `admin123`) storing a
  fake token in `localStorage`. Replace with your real JWT flow in
  `services/api.js` → `login()`.
- Stock automatically increases on **Purchase** and decreases on **Billing**
  (mock in-memory, resets on page refresh) — this mirrors how it should
  behave once wired to a real database.

## Added real-data features

- Customer phone lookup and autofill on Billing.
- Medicine autocomplete from PostgreSQL after 2 typed characters.
- Automatic customer upsert when a sale is saved.
- Automatic unique sale ID in the format `CC-YYYYMMDD-0001` using a database day sequence.
- Sale lookup by ID for Returns, with customer, phone, payment and complete item details.
- Return quantity validation against already returned quantities.
- Supplier transaction history on the Purchase page.
- Purchase transactions remain linked to the selected supplier and stock is updated transactionally.
- Payment methods: Cash, Online and Check.
- Eleven live report types: Today's Sales, Purchases, Stock, Customers, Suppliers, Expiry, Amount, Low Stock, Returns, Payments and Medicine Sales.
- Excel and PDF export use the live report data.
