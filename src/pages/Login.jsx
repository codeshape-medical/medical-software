import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react'
import { login } from '../services/api'

/* Glowing, fully rounded field */
function GlowField({ icon: Icon, children }) {
  return (
    <div className="group relative">
      {/* Glow halo on focus */}
      <div
        className="
          pointer-events-none absolute -inset-[2px] rounded-full
          bg-gradient-to-r from-[#1689E8] via-[#5CC2FF] to-[#1689E8]
          opacity-0 blur-[6px]
          transition-opacity duration-300
          group-focus-within:opacity-60
        "
      />
      {/* Gradient border */}
      <div
        className="
          relative rounded-full p-[1.5px]
          bg-[#D6E6F5]
          transition-all duration-300
          group-hover:bg-[#B5D5F0]
          group-focus-within:bg-gradient-to-r
          group-focus-within:from-[#1689E8]
          group-focus-within:via-[#5CC2FF]
          group-focus-within:to-[#1689E8]
        "
      >
        <div className="relative rounded-full bg-white">
          <Icon
            size={16}
            className="
              absolute left-4 top-1/2 -translate-y-1/2
              text-[#7B93AA]
              transition-colors duration-300
              group-focus-within:text-[#1689E8]
            "
          />
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ username, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillAdminCredentials = () => {
    setUsername('admin')
    setPassword('admin123')
    setError('')
  }

  /* text-[16px] on mobile prevents iOS auto-zoom on focus */
  const inputClass = `
    w-full
    h-[42px]
    sm:h-[41px]
    rounded-full
    bg-transparent
    text-[16px]
    sm:text-[13px]
    text-[#17212B]
    outline-none
    placeholder:text-[#A5B4C2]
  `

  return (
    <div className="min-h-[100dvh] w-full bg-[#F3F8FD] flex items-center justify-center px-3 py-6 sm:p-4 relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#1689E8]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#1689E8]/10 blur-3xl" />

      {/* =================================================
          CARD WRAPPER WITH GLOWING BORDER
      ================================================= */}
      <div className="relative z-10 w-full max-w-[900px]">

        {/* Outer glow */}
        <div
          className="
            pointer-events-none
            absolute
            -inset-[3px]
            rounded-[22px]
            bg-gradient-to-br
            from-[#1689E8]
            via-[#8FD3FF]
            to-[#1689E8]
            opacity-50
            blur-lg
          "
        />

        {/* Glowing gradient border line */}
        <div
          className="
            pointer-events-none
            absolute
            -inset-[1.5px]
            rounded-[17px]
            bg-gradient-to-br
            from-[#1689E8]
            via-[#BFE4FF]
            to-[#1689E8]
          "
        />

        {/* Main Login Card */}
        <div
          className="
            relative
            w-full
            md:min-h-[540px]
            grid
            md:grid-cols-2
            overflow-hidden
            rounded-2xl
            bg-white
            shadow-[0_20px_60px_rgba(7,26,54,0.14)]
          "
        >

          {/* =================================================
              LEFT PANEL - BACKGROUND IMAGE (desktop)
          ================================================= */}
          <div
            className="
              hidden
              md:flex
              relative
              flex-col
              justify-between
              overflow-hidden
              bg-[#071A36]
            "
          >
            {/* Background Image */}
            <img
              src="/images/login-bg.jpg"
              alt="Narayan Hospital"
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-[#071A36]/26" />

            {/* Blue Gradient Overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-b
                from-[#071A36]/35
                via-transparent
                to-[#071A36]/80
              "
            />

            {/* LOGO + HOSPITAL NAME */}
            <div className="relative z-10 p-8">

              <div className="flex items-center gap-3">

                {/* Logo */}
                <div
                  className="
                    w-[58px]
                    h-[58px]
                    shrink-0
                    rounded-full
                    bg-white
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    border
                    border-white/70
                    shadow-[0_6px_25px_rgba(0,0,0,0.25)]
                  "
                >
                  <img
                    src="/images/logo.png"
                    alt="Narayan Hospital Logo"
                    className="w-[50px] h-[50px] object-contain rounded-full"
                  />
                </div>

                {/* Hospital Name */}
                <div>
                  <p className="text-[27px] font-bold text-[#071A36] tracking-wide">
                    Narayan Hospital
                  </p>

                  <p className="text-[11px] text-white mt-0.5">
                    Medical Store Management
                  </p>
                </div>

              </div>

            </div>

            {/* LEFT SIDE MESSAGE */}
            <div className="relative z-10 p-8 pb-9">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-white/10
                  border
                  border-white/20
                  backdrop-blur-sm
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <ShieldCheck size={23} className="text-[#071A36]" />
              </div>

              <h2 className="text-[27px] font-bold text-white leading-tight">
                Welcome Back
              </h2>

              <p className="text-[13px] text-white/80 leading-6 max-w-[300px] mt-3">
                Sign in to manage inventory, billing, purchases and reports
                for your medical store.
              </p>

              <div className="mt-6 flex items-center gap-2">

                <div className="w-8 h-[2px] bg-[#1689E8]" />

                <span className="text-[10px] text-white/65 uppercase tracking-widest">
                  Secure Access
                </span>

              </div>

              {/* Copyright */}
              <p className="text-[10px] text-white/50 mt-7">
                © {new Date().getFullYear()} Narayan Hospital. All rights reserved.
              </p>

            </div>

          </div>

          {/* =================================================
              RIGHT PANEL - GLOWING FORM
          ================================================= */}
          <div className="flex flex-col justify-center">

            {/* ---------- Mobile Header (image + logo + name) ---------- */}
            <div className="md:hidden relative overflow-hidden bg-[#071A36] px-5 py-6">

              <img
                src="/images/login-bg.jpg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-[#071A36]/45" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#071A36]/30 to-[#071A36]/80" />

              <div className="relative z-10 flex items-center gap-3">

                <div
                  className="
                    w-[52px]
                    h-[52px]
                    shrink-0
                    rounded-full
                    bg-white
                    flex
                    items-center
                    justify-center
                    overflow-hidden
                    border
                    border-white/70
                    shadow-[0_6px_22px_rgba(0,0,0,0.3)]
                  "
                >
                  <img
                    src="/images/logo.png"
                    alt="Narayan Hospital Logo"
                    className="w-[44px] h-[44px] object-contain rounded-full"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[20px] font-bold text-white leading-tight truncate">
                    Narayan Hospital
                  </p>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    Medical Store Management
                  </p>
                </div>

              </div>

            </div>

            {/* ---------- Form Area ---------- */}
            <div className="p-5 sm:p-9 md:p-10">

              {/* Heading */}
              <div className="mb-6 md:mb-7">

                <p className="text-[11px] font-semibold text-[#1689E8] uppercase tracking-wider mb-1.5">
                  Secure Login
                </p>

                <h1 className="text-[22px] sm:text-[23px] font-bold text-[#123B66]">
                  Sign in to your account
                </h1>

                <p className="text-[12px] text-[#6B86A5] mt-1.5">
                  Login to manage inventory, billing, and reports
                </p>

              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="
                      text-[12px]
                      text-[#D9363E]
                      bg-[#FFF3F3]
                      border
                      border-[#F4C7CA]
                      rounded-2xl
                      px-4
                      py-2.5
                    "
                  >
                    {error}
                  </div>
                )}

                {/* Username */}
                <div>

                  <label className="block text-[11px] font-semibold text-[#425466] mb-1.5 ml-4">
                    Username
                  </label>

                  <GlowField icon={User}>
                    <input
                      className={`${inputClass} pl-10 pr-4`}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      autoComplete="username"
                      autoCapitalize="none"
                      required
                    />
                  </GlowField>

                </div>

                {/* Password */}
                <div>

                  <label className="block text-[11px] font-semibold text-[#425466] mb-1.5 ml-4">
                    Password
                  </label>

                  <GlowField icon={Lock}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClass} pl-10 pr-12`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="
                        absolute
                        right-1.5
                        top-1/2
                        -translate-y-1/2
                        w-9
                        h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        text-[#7B93AA]
                        hover:text-[#1689E8]
                        hover:bg-[#EEF6FD]
                        transition-colors
                      "
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </GlowField>

                </div>

                {/* Login Button (glowing pill) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    relative
                    w-full
                    h-12
                    sm:h-11
                    rounded-full
                    overflow-hidden
                    bg-gradient-to-r
                    from-[#1689E8]
                    via-[#2FA0F5]
                    to-[#0B6FCB]
                    border
                    border-white/40
                    text-white
                    text-[14px]
                    sm:text-[13px]
                    font-semibold
                    shadow-[0_8px_24px_rgba(22,137,232,0.45)]
                    hover:shadow-[0_10px_30px_rgba(22,137,232,0.65)]
                    active:scale-[0.99]
                    disabled:opacity-60
                    transition-all
                    duration-200
                  "
                >
                  <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                  <span className="relative">
                    {loading ? 'Signing in...' : 'Login'}
                  </span>
                </button>

                {/* Admin Quick Login */}
                <div className="flex justify-center pt-1">

                  <button
                    type="button"
                    onClick={fillAdminCredentials}
                    className="
                      px-4
                      py-2
                      sm:py-1.5
                      rounded-full
                      border
                      border-[#BFE0F7]
                      bg-[#F5FAFE]
                      text-[#1689E8]
                      text-[11px]
                      sm:text-[10px]
                      font-semibold
                      hover:bg-[#EAF5FD]
                      hover:border-[#1689E8]
                      hover:shadow-[0_0_14px_rgba(22,137,232,0.30)]
                      transition-all
                      duration-200
                    "
                  >
                    Use Admin
                  </button>

                </div>

                {/* Bottom Text */}
                <p className="text-[10px] text-center text-[#9AAABA] pt-1">
                  Click “Use Admin” to automatically fill demo credentials.
                </p>

              </form>

              {/* Mobile copyright */}
              <p className="md:hidden text-[10px] text-center text-[#9AAABA] mt-5">
                © {new Date().getFullYear()} Narayan Hospital. All rights reserved.
              </p>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}