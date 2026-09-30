
// import { NavLink, useNavigate } from 'react-router-dom'

// import {
//   LayoutDashboard,
//   ReceiptText,
//   Pill,
//   ShoppingCart,
//   Boxes,
//   CalendarClock,
//   Truck,
//   BarChart3,
//   Undo2,
//   Settings,
//   LogOut,
//   X,
// } from 'lucide-react'

// import { logout } from '../services/api'

// const NAV_ITEMS = [
//   { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
//   { to: '/billing', label: 'Billing (POS)', icon: ReceiptText },
//   { to: '/products', label: 'Products', icon: Pill },
//   { to: '/purchase', label: 'Purchase', icon: ShoppingCart },
//   { to: '/inventory', label: 'Inventory', icon: Boxes },
//   { to: '/expiry', label: 'Expiry Management', icon: CalendarClock },
//   { to: '/suppliers', label: 'Suppliers', icon: Truck },
//   { to: '/reports', label: 'Reports', icon: BarChart3 },
//   { to: '/returns', label: 'Returns / Credit Note', icon: Undo2 },
//   { to: '/settings', label: 'Settings', icon: Settings },
// ]

// export default function Sidebar({ open, onClose }) {
//   const navigate = useNavigate()

//   const handleLogout = () => {
//     logout()
//     onClose?.()
//     navigate('/login', { replace: true })
//   }

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
//           onClick={onClose}
//         />
//       )}

//       <aside
//         className={`
//           fixed md:static
//           inset-y-0 left-0
//           z-50
//           w-[225px]
//           shrink-0
//           flex flex-col
//           bg-[#071A36]
//           text-white
//           shadow-[10px_0_35px_rgba(0,0,0,0.22)]
//           transition-transform duration-300 ease-out
//           ${open ? 'translate-x-0' : '-translate-x-full'}
//           md:translate-x-0
//         `}
//       >

//         {/* ================= HOSPITAL BRAND ================= */}
//         <div className="h-[82px] shrink-0 flex items-center px-3 relative">

//           {/* Mobile Close */}
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close sidebar"
//             className="
//               md:hidden
//               absolute
//               top-3
//               right-3
//               w-7
//               h-7
//               rounded-md
//               flex
//               items-center
//               justify-center
//               text-white
//               hover:bg-white
//               hover:text-[#071A36]
//               transition-all
//               duration-200
//             "
//           >
//             <X size={17} strokeWidth={2.5} />
//           </button>

//           {/* Logo + Full Hospital Name */}
//           <div className="flex items-center gap-2.5 w-full">

//             {/* Smaller Logo */}
//             <div
//               className="
//                 w-[42px]
//                 h-[42px]
//                 shrink-0
//                 rounded-full
//                 bg-[#132947]
//                 border
//                 border-[#E8D5A8]/40
//                 flex
//                 items-center
//                 justify-center
//                 overflow-hidden
//                 shadow-[0_3px_12px_rgba(0,0,0,0.18)]
//               "
//             >
//               <img
//                 src="/images/logo.png"
//                 alt="City Care Hospital Logo"
//                 className="w-[34px] h-[34px] object-contain"
//               />
//             </div>

//             {/* Full Name in One Line */}
//             <p className="text-[14px] font-bold text-white tracking-wide whitespace-nowrap">
//               City Care Hospital
//             </p>

//           </div>
//         </div>

//         {/* ================= NAVIGATION ================= */}
//         <nav className="flex-1 overflow-y-auto px-2.5 pt-2 pb-3">
//           <div className="space-y-1">

//             {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 onClick={onClose}
//                 className={({ isActive }) =>
//                   `
//                     group
//                     flex
//                     items-center
//                     gap-3
//                     h-10
//                     px-3
//                     rounded-md
//                     border
//                     text-[13px]
//                     font-semibold
//                     transition-all
//                     duration-200

//                     ${
//                       isActive
//                         ? `
//                           bg-[#1689E8]
//                           border-[#1689E8]
//                           text-white
//                           shadow-[0_3px_14px_rgba(22,137,232,0.30)]
//                         `
//                         : `
//                           bg-transparent
//                           border-transparent
//                           text-white
//                           hover:border-[#2E6A9E]/50
//                           hover:shadow-[0_0_8px_rgba(80,160,220,0.10)]
//                         `
//                     }
//                   `
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {/* Icon */}
//                     <Icon
//                       size={19}
//                       strokeWidth={2.1}
//                       className={`
//                         shrink-0
//                         transition-all
//                         duration-200
//                         ${isActive ? 'text-white' : 'text-white'}
//                       `}
//                     />

//                     {/* Text */}
//                     <span className="truncate">
//                       {label}
//                     </span>
//                   </>
//                 )}
//               </NavLink>
//             ))}

//           </div>
//         </nav>

//         {/* ================= LOGOUT ================= */}
//         <div className="px-2.5 pb-3">

//           <button
//             type="button"
//             onClick={handleLogout}
//             className="
//               group
//               w-full
//               h-10
//               flex
//               items-center
//               gap-3
//               px-3
//               rounded-md
//               border
//               border-transparent
//               text-[13px]
//               font-semibold
//               text-white
//               bg-transparent
//               hover:border-[#2E6A9E]/50
//               hover:shadow-[0_0_8px_rgba(80,160,220,0.10)]
//               transition-all
//               duration-200
//             "
//           >
//             <LogOut
//               size={19}
//               strokeWidth={2.1}
//               className="
//                 shrink-0
//                 text-red-500
//               "
//             />

//             <span>
//               Logout
//             </span>
//           </button>

//         </div>

//       </aside>
//     </>
//   )
// }

import { NavLink, useNavigate } from 'react-router-dom'

import {
  ReceiptText,
  Pill,
  ShoppingCart,
  Boxes,
  CalendarClock,
  Truck,
  BarChart3,
  Undo2,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

import { logout } from '../services/api'

const NAV_ITEMS = [
  { to: '/billing', label: 'Billing (POS)', icon: ReceiptText },
  { to: '/products', label: 'Products', icon: Pill },
  { to: '/purchase', label: 'Purchase', icon: ShoppingCart },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/expiry', label: 'Expiry Management', icon: CalendarClock },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/returns', label: 'Returns / Credit Note', icon: Undo2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose?.()
    navigate('/login', { replace: true })
  }

  const handleDashboard = () => {
    onClose?.()
    navigate('/dashboard')
  }

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static
          inset-y-0 left-0
          z-50
          w-[225px]
          shrink-0
          flex flex-col
          bg-[#071A36]
          text-white
          shadow-[10px_0_35px_rgba(0,0,0,0.22)]
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >

        {/* ================= HOSPITAL BRAND ================= */}
        <div className="h-[82px] shrink-0 flex items-center px-3 relative">

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              md:hidden
              absolute
              top-3
              right-3
              w-7
              h-7
              rounded-md
              flex
              items-center
              justify-center
              text-white
              hover:bg-white
              hover:text-[#071A36]
              transition-all
              duration-200
            "
          >
            <X size={17} strokeWidth={2.5} />
          </button>

          {/* Logo + Hospital Name */}
          <button
            type="button"
            onClick={handleDashboard}
            className="
              flex
              items-center
              gap-2.5
              w-full
              text-left
              cursor-pointer
              rounded-lg
              transition-all
              duration-200
              
              p-1
            "
            aria-label="Go to Dashboard"
          >

            {/* Logo */}
          <div
  className="
    w-[42px]
    h-[42px]
    shrink-0
    rounded-full
    bg-[#132947]
    border
    border-[#E8D5A8]/40
    flex
    items-center
    justify-center
    overflow-hidden
    shadow-[0_3px_12px_rgba(0,0,0,0.18)]
  "
>
  <img
    src="/images/logo.png"
    alt="City Care Hospital Logo"
    className="
      w-full
      h-full
      object-cover
      rounded-full
    "
  />
</div>
            {/* Hospital Name */}
            <p className="text-[14px] font-bold text-white tracking-wide whitespace-nowrap">
              City Care Hospital
            </p>

          </button>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 overflow-y-auto px-2.5 pt-2 pb-3">

          <div className="space-y-1">

            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (

              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                    group
                    flex
                    items-center
                    gap-3
                    h-10
                    px-3
                    rounded-md
                    border
                    text-[13px]
                    font-semibold
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? `
                          bg-[#1689E8]
                          border-[#1689E8]
                          text-white
                          shadow-[0_3px_14px_rgba(22,137,232,0.30)]
                        `
                        : `
                          bg-transparent
                          border-transparent
                          text-white
                          hover:border-[#2E6A9E]/50
                          hover:shadow-[0_0_8px_rgba(80,160,220,0.10)]
                        `
                    }
                  `
                }
              >

                {({ isActive }) => (
                  <>
                    {/* Icon */}
                    <Icon
                      size={19}
                      strokeWidth={2.1}
                      className={`
                        shrink-0
                        transition-all
                        duration-200
                        ${isActive ? 'text-white' : 'text-white'}
                      `}
                    />

                    {/* Text */}
                    <span className="truncate">
                      {label}
                    </span>
                  </>
                )}

              </NavLink>

            ))}

          </div>

        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="px-2.5 pb-3">

          <button
            type="button"
            onClick={handleLogout}
            className="
              group
              w-full
              h-10
              flex
              items-center
              gap-3
              px-3
              rounded-md
              border
              border-transparent
              text-[13px]
              font-semibold
              text-white
              bg-transparent
              hover:border-[#2E6A9E]/50
              hover:shadow-[0_0_8px_rgba(80,160,220,0.10)]
              transition-all
              duration-200
            "
          >

            <LogOut
              size={19}
              strokeWidth={2.1}
              className="
                shrink-0
                text-red-500
              "
            />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>
    </>
  )
}