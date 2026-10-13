import { useEffect, useMemo, useState } from 'react'
import { Check, Pencil, Plus, RefreshCw, Save, ShieldCheck, UserRound, X } from 'lucide-react'
import { createUser, getCurrentUser, getUsers, updateUser } from '../services/api'

const SECTIONS = [
  ['dashboard', 'Dashboard'], ['billing', 'Billing'], ['products', 'Products'],
  ['purchase', 'Purchase'], ['inventory', 'Inventory'], ['expiry', 'Expiry'],
  ['suppliers', 'Suppliers'], ['reports', 'Reports'], ['returns', 'Returns'], ['settings', 'Settings'],
]
const ACTIONS = ['view', 'create', 'edit', 'delete']
const emptyPermissions = () => Object.fromEntries(SECTIONS.map(([key]) => [key, Object.fromEntries(ACTIONS.map((action) => [action, false]))]))
const fullPermissions = () => Object.fromEntries(SECTIONS.map(([key]) => [key, Object.fromEntries(ACTIONS.map((action) => [action, true]))]))
const blankForm = () => ({ name: '', username: '', password: '', role: 'staff', is_active: true, permissions: emptyPermissions() })
const isPrivileged = (user) => ['admin', 'super_admin', 'superadmin'].includes(String(user?.role || '').toLowerCase().replace(/[ -]+/g, '_'))

export default function UserManagement() {
  const currentUser = getCurrentUser()
  const canManage = isPrivileged(currentUser)
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(blankForm())
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try { const rows = await getUsers(); setUsers(Array.isArray(rows) ? rows : []); setError('') }
    catch (e) { setError(e?.response?.data?.message || e?.message || 'Could not load users.') }
    finally { setLoading(false) }
  }
  useEffect(() => { loadUsers() }, [])

  const startCreate = () => { setEditingId(null); setForm(blankForm()); setMessage(''); setError(''); setShowForm(true) }
  const startEdit = (user) => {
    setEditingId(user.id)
    setForm({ name: user.name || '', username: user.username || '', password: '', role: 'staff', is_active: Boolean(user.is_active), permissions: { ...emptyPermissions(), ...(user.permissions || {}) } })
    setMessage(''); setError(''); setShowForm(true)
  }
  const togglePermission = (section, action, checked) => setForm((old) => ({ ...old, permissions: { ...old.permissions, [section]: { ...old.permissions[section], [action]: checked } } }))
  const setSection = (section, checked) => setForm((old) => ({ ...old, permissions: { ...old.permissions, [section]: Object.fromEntries(ACTIONS.map((action) => [action, checked])) } }))

  async function submit(e) {
    e.preventDefault(); setSaving(true); setError(''); setMessage('')
    try {
      const payload = { name: form.name.trim(), username: form.username.trim(), role: 'staff', is_active: form.is_active, permissions: form.permissions }
      if (form.password) payload.password = form.password
      if (!editingId && !form.password) throw new Error('Set a password for the new staff account.')
      if (editingId) await updateUser(editingId, payload); else await createUser(payload)
      setMessage(editingId ? 'Staff account updated.' : 'Staff account created.')
      setShowForm(false); setForm(blankForm()); setEditingId(null); await loadUsers()
    } catch (e) { setError(e?.response?.data?.message || e?.message || 'Could not save user.') }
    finally { setSaving(false) }
  }

  const staffUsers = useMemo(() => users.filter((user) => !isPrivileged(user)), [users])
  if (!canManage) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">Only Admin and Super Admin can manage staff accounts.</div>

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="text-sm font-bold text-[#111111]">Staff accounts and permissions</h3><p className="mt-1 text-xs text-[#444444]">Passwords are stored securely as hashes and are never displayed here.</p></div>
      <div className="flex gap-2"><button onClick={loadUsers} type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"><RefreshCw size={14}/> Refresh</button><button onClick={startCreate} type="button" className="inline-flex items-center gap-2 rounded-lg bg-[#1689E8] px-3 py-2 text-xs font-bold text-white"><Plus size={15}/> Add Staff</button></div>
    </div>
    {message && <p role="status" className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-semibold text-green-700">{message}</p>}
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
    {showForm && <form onSubmit={submit} className="space-y-4 rounded-xl border border-[#1689E8]/40 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between"><h4 className="flex items-center gap-2 text-sm font-bold text-[#123B66]"><UserRound size={16}/>{editingId ? 'Edit Staff' : 'Create Staff'}</h4><button type="button" onClick={() => setShowForm(false)} aria-label="Close" className="rounded p-1 text-slate-600 hover:bg-slate-100"><X size={18}/></button></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs font-semibold text-slate-700">Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
        <label className="text-xs font-semibold text-slate-700">Username<input required autoCapitalize="none" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
        <label className="text-xs font-semibold text-slate-700 sm:col-span-2">{editingId ? 'New password (leave blank to keep current password)' : 'Password'}<input type="password" minLength={8} required={!editingId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" className="mt-1 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
        {editingId && <label className="flex items-center gap-2 text-xs font-semibold text-slate-700"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })}/> Account active</label>}
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <div className="flex items-center gap-2 border-b bg-slate-50 px-3 py-3 text-xs font-bold text-slate-800"><ShieldCheck size={16}/> Section permissions <span className="font-normal text-slate-500">(View / Create / Edit / Delete)</span></div>
        <table className="w-full min-w-[560px] text-left text-xs"><thead className="bg-white text-slate-600"><tr><th className="px-3 py-2">Section</th>{ACTIONS.map((a) => <th key={a} className="px-3 py-2 capitalize">{a}</th>)}</tr></thead><tbody>{SECTIONS.map(([key, label]) => <tr key={key} className="border-t border-slate-100"><td className="px-3 py-2 font-semibold text-slate-800"><label className="flex items-center gap-2"><input type="checkbox" checked={ACTIONS.every((a) => form.permissions?.[key]?.[a])} onChange={(e) => setSection(key, e.target.checked)}/>{label}</label></td>{ACTIONS.map((action) => <td key={action} className="px-3 py-2"><input aria-label={`${label} ${action}`} type="checkbox" checked={Boolean(form.permissions?.[key]?.[action])} onChange={(e) => togglePermission(key, action, e.target.checked)} /></td>)}</tr>)}</tbody></table>
      </div>
      <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#123B66] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"><Save size={14}/>{saving ? 'Saving…' : 'Save Staff'}</button></div>
    </form>}
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-4 py-3">Staff member</th><th className="px-4 py-3">Username</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Permissions</th><th className="px-4 py-3">Action</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">Loading users…</td></tr> : staffUsers.length === 0 ? <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-500">No staff accounts yet. Select Add Staff to create one.</td></tr> : staffUsers.map((user) => <tr key={user.id} className="border-t border-slate-100"><td className="px-4 py-3 font-semibold text-slate-800">{user.name}</td><td className="px-4 py-3 text-slate-700">{user.username}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{user.is_active ? 'Active' : 'Inactive'}</span></td><td className="px-4 py-3 text-xs text-slate-600">{SECTIONS.filter(([key]) => user.permissions?.[key]?.view).length} sections visible</td><td className="px-4 py-3"><button onClick={() => startEdit(user)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"><Pencil size={13}/> Edit</button></td></tr>)}
      </tbody></table>
    </div>
  </div>
}
