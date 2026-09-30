
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Cross,
  User,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react'
import { login } from '../services/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
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

  return (
    <div className="min-h-screen w-full bg-[#F3F8FD] flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Decoration */}
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#1689E8]/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#1689E8]/10 blur-3xl" />

      {/* Main Login Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[900px]
          min-h-[540px]
          grid
          md:grid-cols-2
          overflow-hidden
          rounded-2xl
          bg-white
          border
          border-[#D9EAF7]
          shadow-[0_20px_60px_rgba(7,26,54,0.14)]
        "
      >

        {/* =================================================
            LEFT PANEL
        ================================================= */}
       {/* =================================================
    LEFT PANEL - BACKGROUND IMAGE
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
    alt="City Care Hospital"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
    onError={(e) => {
      e.currentTarget.style.display = 'none'
    }}
  />

  {/* Dark Overlay */}
  <div
    className="
      absolute
      inset-0
      bg-[#071A36]/26
    "
  />

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

  {/* =================================================
      LOGO + HOSPITAL NAME
  ================================================= */}
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
          alt="City Care Hospital Logo"
          className="
            w-[50px]
            h-[50px]
            object-contain
            rounded-full
          "
        />
      </div>

      {/* Hospital Name */}
      <div>
        <p className="text-[27px] font-bold text-[#071A36] tracking-wide">
          City Care Hospital
        </p>

        <p className="text-[11px] text-white mt-0.5">
          Medical Store Management
        </p>
      </div>

    </div>

  </div>

  {/* =================================================
      LEFT SIDE MESSAGE
  ================================================= */}
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
      <ShieldCheck
        size={23}
        className="text-[#071A36]"
      />
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
      © {new Date().getFullYear()} City Care Hospital. All rights reserved.
    </p>

  </div>

</div>

        {/* =================================================
            RIGHT PANEL
        ================================================= */}
        <div className="flex flex-col justify-center p-7 sm:p-9 md:p-10">

          {/* Mobile Brand */}
          <div className="md:hidden flex items-center gap-2.5 mb-7">

            <div
              className="
                w-10
                h-10
                rounded-lg
                bg-[#071A36]
                flex
                items-center
                justify-center
              "
            >
              <img
                src="/images/logo.png"
                alt="City Care Hospital"
                className="w-7 h-7 object-contain"
              />
            </div>

            <div>
              <p className="text-[15px] font-bold text-[#123B66]">
                City Care Hospital
              </p>

              <p className="text-[10px] text-[#6B86A5]">
                Medical Store
              </p>
            </div>

          </div>

          {/* Heading */}
          <div className="mb-7">

            <p className="text-[11px] font-semibold text-[#1689E8] uppercase tracking-wider mb-1.5">
              Secure Login
            </p>

            <h1 className="text-[23px] font-bold text-[#123B66]">
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
                className="
                  text-[12px]
                  text-[#D9363E]
                  bg-[#FFF3F3]
                  border
                  border-[#F4C7CA]
                  rounded-lg
                  px-3
                  py-2.5
                "
              >
                {error}
              </div>
            )}

            {/* Username */}
            <div>

              <label className="block text-[11px] font-semibold text-[#425466] mb-1.5">
                Username
              </label>

              <div className="relative">

                <User
                  size={16}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7B93AA]
                  "
                />

                <input
                  className="
                    w-full
                    h-11
                    rounded-lg
                    border
                    border-[#D8E7F2]
                    bg-[#FAFCFE]
                    pl-9
                    pr-3
                    text-[13px]
                    text-[#17212B]
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-[#A5B4C2]
                    focus:border-[#1689E8]
                    focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(22,137,232,0.08)]
                  "
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />

              </div>

            </div>

            {/* Password */}
            <div>

              <label className="block text-[11px] font-semibold text-[#425466] mb-1.5">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={16}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7B93AA]
                  "
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  className="
                    w-full
                    h-11
                    rounded-lg
                    border
                    border-[#D8E7F2]
                    bg-[#FAFCFE]
                    pl-9
                    pr-10
                    text-[13px]
                    text-[#17212B]
                    outline-none
                    transition-all
                    duration-200
                    placeholder:text-[#A5B4C2]
                    focus:border-[#1689E8]
                    focus:bg-white
                    focus:shadow-[0_0_0_3px_rgba(22,137,232,0.08)]
                  "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#7B93AA]
                    hover:text-[#1689E8]
                    transition-colors
                  "
                >
                  {showPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>

              </div>

            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-[11px]">

              <label className="flex items-center gap-2 text-[#56616F] cursor-pointer">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="
                    w-3.5
                    h-3.5
                    rounded
                    border-[#C9D9E6]
                    text-[#1689E8]
                    focus:ring-[#1689E8]
                  "
                />

                Remember me

              </label>

              <button
                type="button"
                className="
                  text-[#1689E8]
                  font-medium
                  hover:underline
                "
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-11
                rounded-lg
                bg-[#1689E8]
                text-white
                text-[13px]
                font-semibold
                shadow-[0_6px_18px_rgba(22,137,232,0.22)]
                hover:bg-[#1178D0]
                hover:shadow-[0_7px_22px_rgba(22,137,232,0.30)]
                active:scale-[0.99]
                disabled:opacity-60
                transition-all
                duration-200
              "
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            {/* Admin Quick Login */}
            <div className="flex justify-center pt-1">

              <button
                type="button"
                onClick={fillAdminCredentials}
                className="
                  px-3
                  py-1.5
                  rounded-md
                  border
                  border-[#CFE4F5]
                  bg-[#F5FAFE]
                  text-[#1689E8]
                  text-[10px]
                  font-semibold
                  hover:bg-[#EAF5FD]
                  hover:border-[#1689E8]
                  hover:shadow-[0_0_10px_rgba(22,137,232,0.12)]
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

        </div>

      </div>
    </div>
  )
}