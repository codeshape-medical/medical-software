// // import { useState } from 'react'
// // import { useNavigate } from 'react-router-dom'
// // import { Menu, Search, Bell, ChevronDown, LogOut, User as UserIcon } from 'lucide-react'
// // import { logout, getCurrentUser } from '../services/api'

// // export default function Navbar({ title, onMenuClick }) {
// //   const [menuOpen, setMenuOpen] = useState(false)
// //   const navigate = useNavigate()
// //   const user = getCurrentUser()

// //   function handleLogout() {
// //     logout()
// //     navigate('/login', { replace: true })
// //   }

// //   const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
// //   const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

// //   return (
// //     <header className="h-16 shrink-0 bg-white border-b border-surface-border flex items-center justify-between px-4 md:px-6">
// //       <div className="flex items-center gap-3 flex-1">
// //         <button
// //           className="md:hidden text-slate-500 hover:text-navy-900"
// //           onClick={onMenuClick}
// //           aria-label="Open menu"
// //         >
// //           <Menu size={22} />
// //         </button>

// //         {title ? (
// //           <h1 className="page-title hidden sm:block">{title}</h1>
// //         ) : (
// //           <div className="relative max-w-sm w-full hidden sm:block">
// //             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-muted" />
// //             <input
// //               type="text"
// //               placeholder="Search medicine, brand, barcode..."
// //               className="input-field pl-9 bg-surface-bg border-transparent"
// //             />
// //           </div>
// //         )}
// //       </div>

// //       <div className="flex items-center gap-4">
// //         <span className="hidden md:block text-xs text-surface-muted">{today} &nbsp;{time}</span>

// //         <button className="relative text-slate-500 hover:text-navy-900" aria-label="Notifications">
// //           <Bell size={19} />
// //           <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-red" />
// //         </button>

// //         <div className="relative">
// //           <button
// //             className="flex items-center gap-2"
// //             onClick={() => setMenuOpen((o) => !o)}
// //           >
// //             <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center text-xs font-semibold">
// //               {(user?.name || 'A').charAt(0)}
// //             </div>
// //             <span className="hidden md:inline text-sm font-medium text-slate-700">
// //               {user?.name || 'Store Admin'}
// //             </span>
// //             <ChevronDown size={14} className="text-slate-400" />
// //           </button>

// //           {menuOpen && (
// //             <div className="absolute right-0 mt-2 w-44 card py-1 z-50">
// //               <div className="px-3 py-2 text-xs text-surface-muted border-b border-surface-border">
// //                 <UserIcon size={12} className="inline mr-1" /> {user?.role || 'Admin'}
// //               </div>
// //               <button
// //                 onClick={handleLogout}
// //                 className="w-full text-left px-3 py-2 text-sm text-brand-red hover:bg-red-50 flex items-center gap-2"
// //               >
// //                 <LogOut size={14} /> Logout
// //               </button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </header>
// //   )
// // }
// import { Search, Bell, Menu } from 'lucide-react'
// import { getCurrentUser } from '../services/api'

// export default function Navbar({ onMenuClick }) {
//   const user = getCurrentUser()

//   return (
//     <header className="h-16 shrink-0 bg-[#071A36] border-b border-[#173153] flex items-center justify-between px-4 md:px-6">

//       {/* Left Side - Menu + Search */}
//       <div className="flex items-center gap-3 flex-1 min-w-0">

//         {/* Mobile Menu */}
//         <button
//           className="
//             md:hidden
//             text-white
//             hover:text-[#E8D5A8]
//             transition-colors
//             shrink-0
//           "
//           onClick={onMenuClick}
//           aria-label="Open menu"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Search */}
//         <div className="relative w-full max-w-md">
//           <Search
//             size={17}
//             className="
//               absolute
//               left-3
//               top-1/2
//               -translate-y-1/2
//               text-[#E8D5A8]
//             "
//           />

//           <input
//             type="text"
//             placeholder="Search medicine, brand, barcode..."
//             className="
//               w-full
//               h-10
//               bg-[#102442]
//               border
//               border-[#29415F]
//               rounded-lg
//               pl-10
//               pr-4
//               text-sm
//               text-white
//               placeholder:text-[#8998AB]
//               outline-none
//               transition-all
//               duration-200
//               focus:border-[#E8D5A8]
//               focus:ring-1
//               focus:ring-[#E8D5A8]/30
//             "
//           />
//         </div>

//       </div>


//       {/* Right Side */}
//       <div className="flex items-center gap-5 ml-4">

//         {/* Notifications */}
//         <button
//           className="
//             relative
//             text-white
//             hover:text-[#E8D5A8]
//             transition-colors
//           "
//           aria-label="Notifications"
//         >
//           <Bell size={19} />

//           <span
//             className="
//               absolute
//               -top-1
//               -right-1
//               w-2
//               h-2
//               rounded-full
//               bg-red-500
//               border
//               border-[#071A36]
//             "
//           />
//         </button>


//         {/* User */}
//         <div className="flex items-center gap-2">

//           <div
//             className="
//               w-8
//               h-8
//               rounded-full
//               bg-[#E8D5A8]
//               text-[#071A36]
//               flex
//               items-center
//               justify-center
//               text-xs
//               font-bold
//             "
//           >
//             {(user?.name || 'A').charAt(0).toUpperCase()}
//           </div>

//           <span className="hidden md:inline text-sm font-medium text-white">
//             {user?.name || 'Store Admin'}
//           </span>

//         </div>

//       </div>

//     </header>
//   )
// }

import { Search, Bell, Menu } from 'lucide-react'
import { getCurrentUser } from '../services/api'

export default function Navbar({ onMenuClick }) {
  const user = getCurrentUser()

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const time = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <header className="h-16 shrink-0 bg-[#071A36] border-b border-[#173153] flex items-center justify-between px-4 md:px-6">

      {/* Left Side */}
      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Mobile Menu */}
        <button
          className="
            md:hidden
            text-white
            hover:text-[#E8D5A8]
            transition-colors
            shrink-0
          "
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* White Search Bar */}
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-[#071A36]
            "
          />

          <input
            type="text"
            placeholder="Search medicine, brand, barcode..."
            className="
              w-full
              h-10
              bg-white
              border
              border-white
              rounded-full
              pl-11
              pr-4
              text-sm
              text-[#071A36]
              placeholder:text-slate-400
              outline-none
              shadow-sm
              transition-all
              duration-200
              focus:ring-2
              focus:ring-[#E8D5A8]
              focus:border-[#E8D5A8]
            "
          />
        </div>

      </div>


      {/* Right Side */}
      <div className="flex items-center gap-5 ml-4 shrink-0">

      


        {/* Notifications */}
        <button
          className="
            relative
            text-white
            hover:text-[#E8D5A8]
            transition-colors
          "
          aria-label="Notifications"
        >
          <Bell size={19} />

          <span
            className="
              absolute
              -top-1
              -right-1
              w-2
              h-2
              rounded-full
              bg-red-500
              border
              border-[#071A36]
            "
          />
        </button>


        {/* User */}
        <div className="flex items-center gap-2">

          <div
            className="
              w-8
              h-8
              rounded-full
              bg-[#1689E8]
              text-[#071A36]
              flex
              items-center
              justify-center
              text-xs
              font-bold
            "
          >
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>

          <span className="hidden md:inline text-sm font-medium text-white">
            {user?.name || 'Store Admin'}
          </span>

        </div>
  {/* Date & Time */}
        <div className="hidden md:block text-right leading-tight">
          <p className="text-[11px] font-medium text-white">
            {today}
          </p>

          <p className="text-[10px] text-white mt-0.5">
            {time}
          </p>
        </div>
      </div>

    </header>
  )
}