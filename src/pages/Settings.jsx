
// import { useState } from 'react'
// import {
//   Store,
//   Users,
//   ReceiptText,
//   DatabaseBackup,
//   Save,
//   CheckCircle2,
//   Building2,
//   Phone,
//   Mail,
//   MapPin,
//   FileText,
//   Tag,
// } from 'lucide-react'

// const TABS = [
//   'Store Profile',
//   'Users & Roles',
//   'Tax & Billing',
//   'Backup',
// ]

// export default function Settings() {
//   const [tab, setTab] = useState(TABS[0])

//   const [store, setStore] = useState({
//     name: 'Narayan Hospital',
//     subtitle: 'Medical Store',
//     phone: '9876500000',
//     email: 'store@citycarehospital.com',
//     address: 'Sigra, Varanasi, Uttar Pradesh',
//     gstin: '09AAACC1234A1Z5',
//   })

//   const [saved, setSaved] = useState(false)

//   function handleSave(e) {
//     e.preventDefault()
//     setSaved(true)
//     setTimeout(() => setSaved(false), 2000)
//   }

//   const tabIcons = {
//     'Store Profile': Store,
//     'Users & Roles': Users,
//     'Tax & Billing': ReceiptText,
//     Backup: DatabaseBackup,
//   }

//   return (
//     <div className="space-y-4">

//       {/* =====================================================
//           PAGE HEADER
//       ===================================================== */}
//       <div>
//          <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">
//              Settings
//             </h2>

//         <p className="text-[11px] font-medium text-[#444444] mt-0.5">
//           Manage store information, users, billing and system settings
//         </p>
//       </div>

//       {/* =====================================================
//           TABS
//       ===================================================== */}
//       <div
//         className="
//           w-full
//           overflow-x-auto
//           pb-1
//         "
//       >
//         <div
//           className="
//             inline-flex
//             min-w-max
//             gap-1
//             bg-white
//             p-1
//             rounded-xl
//             border border-[#CBE7FB]
//             shadow-[0_0_14px_rgba(22,137,232,0.08)]
//           "
//         >
//           {TABS.map((t) => {
//             const Icon = tabIcons[t]
//             const active = tab === t

//             return (
//               <button
//                 key={t}
//                 type="button"
//                 onClick={() => setTab(t)}
//                 className={`
//                   flex items-center gap-2
//                   px-3.5
//                   py-2
//                   rounded-lg
//                   text-[11px]
//                   font-bold
//                   border
//                   transition-all duration-200
//                   ${
//                     active
//                       ? `
//                         bg-[#1689E8]
//                         border-[#1689E8]
//                         text-white
//                         shadow-[0_3px_12px_rgba(22,137,232,0.25)]
//                       `
//                       : `
//                         bg-white
//                         border-transparent
//                         text-[#222222]
//                         hover:border-[#BFDDF5]
//                         hover:bg-[#F7FBFF]
//                         hover:shadow-[0_0_10px_rgba(22,137,232,0.08)]
//                       `
//                   }
//                 `}
//               >
//                 <Icon
//                   size={14}
//                   strokeWidth={2.2}
//                 />
//                 {t}
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* =====================================================
//           STORE PROFILE
//       ===================================================== */}
//       {tab === 'Store Profile' && (
//         <form
//           onSubmit={handleSave}
//           className="
//             bg-white
//             rounded-xl
//             border border-[#1689E8]
//             shadow-[0_0_18px_rgba(22,137,232,0.13)]
//             overflow-hidden
//             max-w-3xl
//           "
//         >

//           {/* Blue Form Header */}
//           <div
//             className="
//               bg-[#1689E8]
//               px-5 py-3.5
//               flex items-center justify-between
//             "
//           >
//             <div className="flex items-center gap-2.5">

//               <div
//                 className="
//                   w-8 h-8
//                   rounded-lg
//                   bg-white/15
//                   border border-white/25
//                   flex items-center justify-center
//                 "
//               >
//                 <Building2
//                   size={16}
//                   className="text-white"
//                   strokeWidth={2.2}
//                 />
//               </div>

//               <div>
//                 <h3 className="text-[14px] font-bold text-white">
//                   Store Profile
//                 </h3>

//                 <p className="text-[10px] text-white/85 mt-0.5">
//                   Update your store information
//                 </p>
//               </div>

//             </div>
//           </div>

//           {/* Form Body */}
//           <div className="p-5 space-y-4">

//             <div className="grid sm:grid-cols-2 gap-4">

//               {/* Store Name */}
//               <div>
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">
//                   <Store size={12} className="text-[#1689E8]" />
//                   Store Name
//                 </label>

//                 <input
//                   className="
//                     w-full h-9
//                     rounded-lg
//                     border border-[#C9DCEB]
//                     bg-white
//                     px-3
//                     text-[12px]
//                     font-medium
//                     text-[#111111]
//                     outline-none
//                     placeholder:text-[#555555]
//                     focus:border-[#1689E8]
//                     focus:shadow-[0_0_0_3px_rgba(22,137,232,0.10)]
//                     transition-all
//                   "
//                   value={store.name}
//                   onChange={(e) =>
//                     setStore({
//                       ...store,
//                       name: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Tagline */}
//               <div>
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">
//                   <Tag size={12} className="text-[#8B5CF6]" />
//                   Tagline
//                 </label>

//                 <input
//                   className="
//                     w-full h-9
//                     rounded-lg
//                     border border-[#C9DCEB]
//                     bg-white
//                     px-3
//                     text-[12px]
//                     font-medium
//                     text-[#111111]
//                     outline-none
//                     focus:border-[#8B5CF6]
//                     focus:shadow-[0_0_0_3px_rgba(139,92,246,0.10)]
//                     transition-all
//                   "
//                   value={store.subtitle}
//                   onChange={(e) =>
//                     setStore({
//                       ...store,
//                       subtitle: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Phone */}
//               <div>
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">
//                   <Phone size={12} className="text-[#19B879]" />
//                   Phone
//                 </label>

//                 <input
//                   className="
//                     w-full h-9
//                     rounded-lg
//                     border border-[#C9DCEB]
//                     bg-white
//                     px-3
//                     text-[12px]
//                     font-medium
//                     text-[#111111]
//                     outline-none
//                     focus:border-[#19B879]
//                     focus:shadow-[0_0_0_3px_rgba(25,184,121,0.10)]
//                     transition-all
//                   "
//                   value={store.phone}
//                   onChange={(e) =>
//                     setStore({
//                       ...store,
//                       phone: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">
//                   <Mail size={12} className="text-[#F2A315]" />
//                   Email
//                 </label>

//                 <input
//                   type="email"
//                   className="
//                     w-full h-9
//                     rounded-lg
//                     border border-[#C9DCEB]
//                     bg-white
//                     px-3
//                     text-[12px]
//                     font-medium
//                     text-[#111111]
//                     outline-none
//                     focus:border-[#F2A315]
//                     focus:shadow-[0_0_0_3px_rgba(242,163,21,0.10)]
//                     transition-all
//                   "
//                   value={store.email}
//                   onChange={(e) =>
//                     setStore({
//                       ...store,
//                       email: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* GSTIN */}
//               <div>
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">
//                   <FileText size={12} className="text-[#EF4148]" />
//                   GSTIN
//                 </label>

//                 <input
//                   className="
//                     w-full h-9
//                     rounded-lg
//                     border border-[#C9DCEB]
//                     bg-white
//                     px-3
//                     text-[12px]
//                     font-medium
//                     text-[#111111]
//                     outline-none
//                     focus:border-[#EF4148]
//                     focus:shadow-[0_0_0_3px_rgba(239,65,72,0.10)]
//                     transition-all
//                   "
//                   value={store.gstin}
//                   onChange={(e) =>
//                     setStore({
//                       ...store,
//                       gstin: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               {/* Address */}
//               <div className="sm:col-span-2">
//                 <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">
//                   <MapPin size={12} className="text-[#06A6A6]" />
//                   Address
//                 </label>

//                 <textarea
//                   rows={2}
//                   className="
//                     w-full
//                     rounded-lg
//                     border border-[#C9DCEB]
//                     bg-white
//                     px-3 py-2
//                     text-[12px]
//                     font-medium
//                     text-[#111111]
//                     outline-none
//                     resize-none
//                     focus:border-[#06A6A6]
//                     focus:shadow-[0_0_0_3px_rgba(6,166,166,0.10)]
//                     transition-all
//                   "
//                   value={store.address}
//                   onChange={(e) =>
//                     setStore({
//                       ...store,
//                       address: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//             </div>

//           </div>

//           {/* Form Footer */}
//           <div
//             className="
//               px-5 py-3.5
//               bg-[#F8FBFE]
//               border-t border-[#DCEAF5]
//               flex items-center justify-between
//               gap-3
//               flex-wrap
//             "
//           >

//             <div className="min-h-[20px]">
//               {saved && (
//                 <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#19B879]">
//                   <CheckCircle2 size={14} />
//                   Saved successfully.
//                 </span>
//               )}
//             </div>

//             <button
//               type="submit"
//               className="
//                 h-9
//                 px-4
//                 rounded-lg
//                 bg-[#1689E8]
//                 text-white
//                 text-[11px]
//                 font-bold
//                 flex items-center gap-2
//                 shadow-[0_4px_12px_rgba(22,137,232,0.25)]
//                 hover:bg-[#1178D0]
//                 hover:shadow-[0_5px_16px_rgba(22,137,232,0.35)]
//                 transition-all
//               "
//             >
//               <Save size={14} />
//               Save Changes
//             </button>

//           </div>
//         </form>
//       )}

//       {/* =====================================================
//           USERS & ROLES
//       ===================================================== */}
//       {tab === 'Users & Roles' && (
//         <div
//           className="
//             bg-white
//             rounded-xl
//             border border-[#8B5CF6]
//             shadow-[0_0_18px_rgba(139,92,246,0.13)]
//             overflow-hidden
//             max-w-3xl
//           "
//         >
//           <div className="bg-[#8B5CF6] px-5 py-3.5 flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center">
//               <Users size={16} className="text-white" />
//             </div>

//             <div>
//               <h3 className="text-[14px] font-bold text-white">
//                 Users & Roles
//               </h3>

//               <p className="text-[10px] text-white/85 mt-0.5">
//                 Manage users and access permissions
//               </p>
//             </div>
//           </div>

//           <div className="p-5">
//             <div className="rounded-lg border border-[#E5D9FF] bg-[#FAF8FF] p-4">
//               <p className="text-[12px] font-bold text-[#111111]">
//                 User management
//               </p>

//               <p className="text-[11px] font-medium text-[#444444] mt-1 leading-5">
//                 User management will be available once the backend and
//                 role-based access system are connected.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           TAX & BILLING
//       ===================================================== */}
//       {tab === 'Tax & Billing' && (
//         <div
//           className="
//             bg-white
//             rounded-xl
//             border border-[#F2A315]
//             shadow-[0_0_18px_rgba(242,163,21,0.14)]
//             overflow-hidden
//             max-w-3xl
//           "
//         >
//           <div className="bg-[#F2A315] px-5 py-3.5 flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">
//               <ReceiptText size={16} className="text-white" />
//             </div>

//             <div>
//               <h3 className="text-[14px] font-bold text-white">
//                 Tax & Billing
//               </h3>

//               <p className="text-[10px] text-white/90 mt-0.5">
//                 Configure billing and tax preferences
//               </p>
//             </div>
//           </div>

//           <div className="p-5">
//             <div className="rounded-lg border border-[#F8E3B5] bg-[#FFFCF5] p-4">
//               <p className="text-[12px] font-bold text-[#111111]">
//                 Tax & billing configuration
//               </p>

//               <p className="text-[11px] font-medium text-[#444444] mt-1 leading-5">
//                 Configure GST rates, invoice prefix, and default discount
//                 policy here once connected to the backend.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           BACKUP
//       ===================================================== */}
//       {tab === 'Backup' && (
//         <div
//           className="
//             bg-white
//             rounded-xl
//             border border-[#19B879]
//             shadow-[0_0_18px_rgba(25,184,121,0.13)]
//             overflow-hidden
//             max-w-3xl
//           "
//         >
//           <div className="bg-[#19B879] px-5 py-3.5 flex items-center gap-2.5">
//             <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center">
//               <DatabaseBackup size={16} className="text-white" />
//             </div>

//             <div>
//               <h3 className="text-[14px] font-bold text-white">
//                 Backup
//               </h3>

//               <p className="text-[10px] text-white/90 mt-0.5">
//                 Manage database backup and restore
//               </p>
//             </div>
//           </div>

//           <div className="p-5">
//             <div className="rounded-lg border border-[#CDEFE2] bg-[#F6FFFB] p-4">
//               <p className="text-[12px] font-bold text-[#111111]">
//                 Database backup
//               </p>

//               <p className="text-[11px] font-medium text-[#444444] mt-1 leading-5">
//                 Database backup and restore options will appear here once
//                 the backend is live.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   )
// }




import { useState } from 'react'
import UserManagement from './UserManagement'

import {

  Store,

  Users,

  ReceiptText,

  DatabaseBackup,

  Save,

  CheckCircle2,

  Building2,

  Phone,

  Mail,

  MapPin,

  FileText,

  Tag,

} from 'lucide-react'



const TABS = [

  'Store Profile',

  'Users & Roles',

  'Tax & Billing',

  'Backup',

]



export default function Settings() {

  const [tab, setTab] = useState(TABS[0])



  const [store, setStore] = useState({

    name: 'Narayan Hospital',

    subtitle: 'Medical Store',

    phone: '9876500000',

    email: 'store@citycarehospital.com',

    address: 'Sigra, Varanasi, Uttar Pradesh',

    gstin: '09AAACC1234A1Z5',

  })



  const [saved, setSaved] = useState(false)



  function handleSave(e) {

    e.preventDefault()

    setSaved(true)

    setTimeout(() => setSaved(false), 2000)

  }



  const tabIcons = {

    'Store Profile': Store,

    'Users & Roles': Users,

    'Tax & Billing': ReceiptText,

    Backup: DatabaseBackup,

  }



  return (

    <div className="space-y-4">



      {/* =====================================================*

*          PAGE HEADER*

*      ===================================================== */}

      <div>

         <h2 className="text-xl sm:text-2xl font-bold text-[#123B66] tracking-tight">

             Settings

            </h2>



        <p className="text-[11px] font-medium text-[#444444] mt-0.5">

          Manage store information, users, billing and system settings

        </p>

      </div>



      {/* =====================================================*

*          TABS*

*      ===================================================== */}

      <div

        className="

          w-full

          overflow-x-auto

          pb-1

        "

      >

        <div

          className="

            inline-flex

            min-w-max

            gap-1

            bg-white

            p-1

            rounded-xl

            border border-[#CBE7FB]

            shadow-[0_0_14px_rgba(22,137,232,0.08)]

          "

        >

          {TABS.map((t) => {

            const Icon = tabIcons[t]

            const active = tab === t



            return (

              <button

                key={t}

                type="button"

                onClick={() => setTab(t)}

                className={`

                  flex items-center gap-2

                  px-3.5

                  py-2

                  rounded-lg

                  text-[11px]

                  font-bold

                  border

                  transition-all duration-200

                  ${

                    active

                      ? `

                        bg-[#1689E8]

                        border-[#1689E8]

                        text-white

                        shadow-[0_3px_12px_rgba(22,137,232,0.25)]

                      `

                      : `

                        bg-white

                        border-transparent

                        text-[#222222]

                        hover:border-[#BFDDF5]

                        hover:bg-[#F7FBFF]

                        hover:shadow-[0_0_10px_rgba(22,137,232,0.08)]

                      `

                  }

                `}

              >

                <Icon

                  size={14}

                  strokeWidth={2.2}

                />

                {t}

              </button>

            )

          })}

        </div>

      </div>



      {/* =====================================================*

*          STORE PROFILE*

*      ===================================================== */}

      {tab === 'Store Profile' && (

        <form

          onSubmit={handleSave}

          className="

            bg-white

            rounded-xl

            border border-[#1689E8]

            shadow-[0_0_18px_rgba(22,137,232,0.13)]

            overflow-hidden

            max-w-3xl

          "

        >



          {/* Blue Form Header */}

          <div

            className="

              bg-[#1689E8]

              px-5 py-3.5

              flex items-center justify-between

            "

          >

            <div className="flex items-center gap-2.5">



              <div

                className="

                  w-8 h-8

                  rounded-lg

                  bg-white/15

                  border border-white/25

                  flex items-center justify-center

                "

              >

                <Building2

                  size={16}

                  className="text-white"

                  strokeWidth={2.2}

                />

              </div>



              <div>

                <h3 className="text-[14px] font-bold text-white">

                  Store Profile

                </h3>



                <p className="text-[10px] text-white/85 mt-0.5">

                  Update your store information

                </p>

              </div>



            </div>

          </div>



          {/* Form Body */}

          <div className="p-5 space-y-4">



            <div className="grid sm:grid-cols-2 gap-4">



              {/* Store Name */}

              <div>

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">

                  <Store size={12} className="text-[#1689E8]" />

                  Store Name

                </label>



                <input

                  className="

                    w-full h-9

                    rounded-lg

                    border border-[#C9DCEB]

                    bg-white

                    px-3

                    text-[12px]

                    font-medium

                    text-[#111111]

                    outline-none

                    placeholder:text-[#555555]

                    focus:border-[#1689E8]

                    focus:shadow-[0_0_0_3px_rgba(22,137,232,0.10)]

                    transition-all

                  "

                  value={store.name}

                  onChange={(e) =>

                    setStore({

                      ...store,

                      name: e.target.value,

                    })

                  }

                />

              </div>



              {/* Tagline */}

              <div>

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">

                  <Tag size={12} className="text-[#8B5CF6]" />

                  Tagline

                </label>



                <input

                  className="

                    w-full h-9

                    rounded-lg

                    border border-[#C9DCEB]

                    bg-white

                    px-3

                    text-[12px]

                    font-medium

                    text-[#111111]

                    outline-none

                    focus:border-[#8B5CF6]

                    focus:shadow-[0_0_0_3px_rgba(139,92,246,0.10)]

                    transition-all

                  "

                  value={store.subtitle}

                  onChange={(e) =>

                    setStore({

                      ...store,

                      subtitle: e.target.value,

                    })

                  }

                />

              </div>



              {/* Phone */}

              <div>

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">

                  <Phone size={12} className="text-[#19B879]" />

                  Phone

                </label>



                <input

                  className="

                    w-full h-9

                    rounded-lg

                    border border-[#C9DCEB]

                    bg-white

                    px-3

                    text-[12px]

                    font-medium

                    text-[#111111]

                    outline-none

                    focus:border-[#19B879]

                    focus:shadow-[0_0_0_3px_rgba(25,184,121,0.10)]

                    transition-all

                  "

                  value={store.phone}

                  onChange={(e) =>

                    setStore({

                      ...store,

                      phone: e.target.value,

                    })

                  }

                />

              </div>



              {/* Email */}

              <div>

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">

                  <Mail size={12} className="text-[#F2A315]" />

                  Email

                </label>



                <input

                  type="email"

                  className="

                    w-full h-9

                    rounded-lg

                    border border-[#C9DCEB]

                    bg-white

                    px-3

                    text-[12px]

                    font-medium

                    text-[#111111]

                    outline-none

                    focus:border-[#F2A315]

                    focus:shadow-[0_0_0_3px_rgba(242,163,21,0.10)]

                    transition-all

                  "

                  value={store.email}

                  onChange={(e) =>

                    setStore({

                      ...store,

                      email: e.target.value,

                    })

                  }

                />

              </div>



              {/* GSTIN */}

              <div>

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">

                  <FileText size={12} className="text-[#EF4148]" />

                  GSTIN

                </label>



                <input

                  className="

                    w-full h-9

                    rounded-lg

                    border border-[#C9DCEB]

                    bg-white

                    px-3

                    text-[12px]

                    font-medium

                    text-[#111111]

                    outline-none

                    focus:border-[#EF4148]

                    focus:shadow-[0_0_0_3px_rgba(239,65,72,0.10)]

                    transition-all

                  "

                  value={store.gstin}

                  onChange={(e) =>

                    setStore({

                      ...store,

                      gstin: e.target.value,

                    })

                  }

                />

              </div>



              {/* Address */}

              <div className="sm:col-span-2">

                <label className="flex items-center gap-1.5 text-[11px] font-bold text-[#111111] mb-1.5">

                  <MapPin size={12} className="text-[#06A6A6]" />

                  Address

                </label>



                <textarea

                  rows={2}

                  className="

                    w-full

                    rounded-lg

                    border border-[#C9DCEB]

                    bg-white

                    px-3 py-2

                    text-[12px]

                    font-medium

                    text-[#111111]

                    outline-none

                    resize-none

                    focus:border-[#06A6A6]

                    focus:shadow-[0_0_0_3px_rgba(6,166,166,0.10)]

                    transition-all

                  "

                  value={store.address}

                  onChange={(e) =>

                    setStore({

                      ...store,

                      address: e.target.value,

                    })

                  }

                />

              </div>



            </div>



          </div>



          {/* Form Footer */}

          <div

            className="

              px-5 py-3.5

              bg-[#F8FBFE]

              border-t border-[#DCEAF5]

              flex items-center justify-between

              gap-3

              flex-wrap

            "

          >



            <div className="min-h-[20px]">

              {saved && (

                <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#19B879]">

                  <CheckCircle2 size={14} />

                  Saved successfully.

                </span>

              )}

            </div>



            <button

              type="submit"

              className="

                h-9

                px-4

                rounded-lg

                bg-[#1689E8]

                text-white

                text-[11px]

                font-bold

                flex items-center gap-2

                shadow-[0_4px_12px_rgba(22,137,232,0.25)]

                hover:bg-[#1178D0]

                hover:shadow-[0_5px_16px_rgba(22,137,232,0.35)]

                transition-all

              "

            >

              <Save size={14} />

              Save Changes

            </button>



          </div>

        </form>

      )}



      {/* =====================================================*

*          USERS & ROLES*

*      ===================================================== */}

      {tab === 'Users & Roles' && (

        <div

          className="

            bg-white

            rounded-xl

            border border-[#8B5CF6]

            shadow-[0_0_18px_rgba(139,92,246,0.13)]

            overflow-hidden

            max-w-3xl

          "

        >

          <div className="bg-[#8B5CF6] px-5 py-3.5 flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center">

              <Users size={16} className="text-white" />

            </div>



            <div>

              <h3 className="text-[14px] font-bold text-white">

                Users & Roles

              </h3>



              <p className="text-[10px] text-white/85 mt-0.5">

                Manage users and access permissions

              </p>

            </div>

          </div>



          <div className="p-5"><UserManagement /></div>

        </div>

      )}



      {/* =====================================================*

*          TAX & BILLING*

*      ===================================================== */}

      {tab === 'Tax & Billing' && (

        <div

          className="

            bg-white

            rounded-xl

            border border-[#F2A315]

            shadow-[0_0_18px_rgba(242,163,21,0.14)]

            overflow-hidden

            max-w-3xl

          "

        >

          <div className="bg-[#F2A315] px-5 py-3.5 flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center">

              <ReceiptText size={16} className="text-white" />

            </div>



            <div>

              <h3 className="text-[14px] font-bold text-white">

                Tax & Billing

              </h3>



              <p className="text-[10px] text-white/90 mt-0.5">

                Configure billing and tax preferences

              </p>

            </div>

          </div>



          <div className="p-5">

            <div className="rounded-lg border border-[#F8E3B5] bg-[#FFFCF5] p-4">

              <p className="text-[12px] font-bold text-[#111111]">

                Tax & billing configuration

              </p>



              <p className="text-[11px] font-medium text-[#444444] mt-1 leading-5">

                Configure GST rates, invoice prefix, and default discount

                policy here once connected to the backend.

              </p>

            </div>

          </div>

        </div>

      )}



      {/* =====================================================*

*          BACKUP*

*      ===================================================== */}

      {tab === 'Backup' && (

        <div

          className="

            bg-white

            rounded-xl

            border border-[#19B879]

            shadow-[0_0_18px_rgba(25,184,121,0.13)]

            overflow-hidden

            max-w-3xl

          "

        >

          <div className="bg-[#19B879] px-5 py-3.5 flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center">

              <DatabaseBackup size={16} className="text-white" />

            </div>



            <div>

              <h3 className="text-[14px] font-bold text-white">

                Backup

              </h3>



              <p className="text-[10px] text-white/90 mt-0.5">

                Manage database backup and restore

              </p>

            </div>

          </div>



          <div className="p-5">

            <div className="rounded-lg border border-[#CDEFE2] bg-[#F6FFFB] p-4">

              <p className="text-[12px] font-bold text-[#111111]">

                Database backup

              </p>



              <p className="text-[11px] font-medium text-[#444444] mt-1 leading-5">

                Database backup and restore options will appear here once

                the backend is live.

              </p>

            </div>

          </div>

        </div>

      )}



    </div>

  )

}