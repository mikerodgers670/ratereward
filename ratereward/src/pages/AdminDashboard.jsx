import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Wallet, ArrowDownToLine, LogOut,
  TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Download, Send, Eye, Ban, Bell, Menu, X,
  Settings, Lock, KeyRound
} from 'lucide-react'
import {
  getMembers, saveMembers, getWithdrawals, addWithdrawal,
  exportMembersCSV, exportWithdrawalsCSV,
  getAdminCreds, updateAdminCreds
} from '../lib/storage'
import './AdminDashboard.css'

const TABS = ['Overview', 'Members', 'Payouts', 'Withdrawals', 'Settings']

const STATUS_META = {
  active:          { label: 'Active',         color: 'blue'  },
  pending_payout:  { label: 'Pending payout', color: 'amber' },
  paid:            { label: 'Paid out',        color: 'green' },
  rejected:        { label: 'Rejected',        color: 'red'   },
}

function fmt(n)     { return `KES ${Number(n).toLocaleString()}` }
function fmtDate(d) { return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) }

export default function AdminDashboard() {
  const nav = useNavigate()
  const [tab, setTab] = useState(0)

  // ── Persistent state ───────────────────────────────────────────────────────
  const [members, setMembers]         = useState(() => getMembers())
  const [withdrawals, setWithdrawals] = useState(() => getWithdrawals())

  // Sync members back to storage whenever they change
  useEffect(() => { saveMembers(members) }, [members])

  // ── UI state ───────────────────────────────────────────────────────────────
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sideOpen, setSideOpen]       = useState(false)
  const [detailMember, setDetailMember] = useState(null)
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [wForm, setWForm]             = useState({ amount: '', method: 'M-Pesa', mpesa: '', note: '' })
  const [wError, setWError]           = useState('')
  const [wSuccess, setWSuccess]       = useState(false)
  const [notification, setNotification] = useState(null)

  // ── Settings state ─────────────────────────────────────────────────────────
  const [creds]                       = useState(() => getAdminCreds())
  const [newEmail, setNewEmail]       = useState(creds.email)
  const [newPass, setNewPass]         = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [credsMsg, setCredsMsg]       = useState(null)

  // Auth guard
  useEffect(() => {
    if (!sessionStorage.getItem('rr_admin')) nav('/admin')
  }, [nav])

  function logout() {
    sessionStorage.removeItem('rr_admin')
    nav('/admin')
  }

  function notify(msg, type = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  // ── Derived financials ─────────────────────────────────────────────────────
  const totalDeposited  = members.reduce((s, m) => s + m.plan, 0)
  const totalOwed       = members.filter(m => m.status !== 'paid' && m.status !== 'rejected').reduce((s, m) => s + m.plan * 2, 0)
  const totalPaidOut    = members.filter(m => m.status === 'paid').reduce((s, m) => s + m.plan * 2, 0)
  const totalWithdrawn  = withdrawals.filter(w => w.status === 'completed').reduce((s, w) => s + w.amount, 0)
  const availableBalance = totalDeposited - totalWithdrawn
  const pendingPayouts  = members.filter(m => m.status === 'pending_payout')
  const activeMembers   = members.filter(m => m.status === 'active')

  // ── Member actions ─────────────────────────────────────────────────────────
  function markPaid(id) {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: 'paid' } : m))
    notify('Payment marked as sent')
    setDetailMember(null)
  }
  function rejectMember(id) {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: 'rejected' } : m))
    notify('Member rejected', 'warning')
    setDetailMember(null)
  }

  // ── Withdrawal submit ──────────────────────────────────────────────────────
  function submitWithdrawal() {
    const amt = Number(wForm.amount)
    if (!amt || amt <= 0)       { setWError('Enter a valid amount'); return }
    if (amt > availableBalance) { setWError(`Insufficient balance. Available: ${fmt(availableBalance)}`); return }
    if (!wForm.mpesa.trim())    { setWError('Enter destination account'); return }
    const saved = addWithdrawal({ admin: 'Admin', amount: amt, method: wForm.method, mpesa: wForm.mpesa, note: wForm.note || 'Admin withdrawal' })
    setWithdrawals(getWithdrawals())
    setWSuccess(true)
    setWForm({ amount: '', method: 'M-Pesa', mpesa: '', note: '' })
    setWError('')
    setTimeout(() => { setWithdrawModal(false); setWSuccess(false) }, 2000)
    notify(`${fmt(amt)} withdrawal recorded`)
  }

  // ── Credentials update ────────────────────────────────────────────────────
  function saveCredentials() {
    if (!newEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setCredsMsg({ text: 'Enter a valid email', ok: false }); return }
    if (newPass && newPass.length < 8) { setCredsMsg({ text: 'Password must be at least 8 characters', ok: false }); return }
    if (newPass && newPass !== confirmPass) { setCredsMsg({ text: 'Passwords do not match', ok: false }); return }
    updateAdminCreds(newEmail, newPass || atob(creds.passHash))
    setCredsMsg({ text: 'Credentials updated successfully!', ok: true })
    setNewPass(''); setConfirmPass('')
    setTimeout(() => setCredsMsg(null), 3000)
  }

  // ── Filtered members ───────────────────────────────────────────────────────
  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.phone.includes(search) || m.id.includes(search)
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {notification.msg}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sideOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-star">★</span>
          <span className="logo-text">RateReward</span>
          <button className="sidebar-close" onClick={() => setSideOpen(false)}><X size={18} /></button>
        </div>
        <div className="sidebar-label">Navigation</div>
        {TABS.map((t, i) => (
          <button
            key={i}
            className={`sidebar-item ${tab === i ? 'sidebar-item-active' : ''}`}
            onClick={() => { setTab(i); setSideOpen(false) }}
          >
            {[<LayoutDashboard size={17} />, <Users size={17} />, <Clock size={17} />, <Wallet size={17} />, <Settings size={17} />][i]}
            {t}
          </button>
        ))}
        <div className="sidebar-spacer" />
        <div className="sidebar-label">Account</div>
        <button className="sidebar-item sidebar-logout" onClick={logout}>
          <LogOut size={17} /> Sign out
        </button>
      </aside>

      {/* MAIN */}
      <div className="admin-main">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <button className="menu-btn" onClick={() => setSideOpen(v => !v)}><Menu size={20} /></button>
          <div className="topbar-title">
            {['Overview', 'Members', 'Pending payouts', 'Withdrawals', 'Settings'][tab]}
          </div>
          <div className="topbar-right">
            <div className="admin-badge">Admin</div>
          </div>
        </header>

        <div className="admin-body">

          {/* ── TAB 0: OVERVIEW ── */}
          {tab === 0 && (
            <div>
              <div className="balance-hero">
                <div className="bh-left">
                  <div className="bh-label">Available balance</div>
                  <div className="bh-amount">{fmt(availableBalance)}</div>
                  <div className="bh-sub">Total deposited minus withdrawn</div>
                </div>
                <button className="withdraw-hero-btn" onClick={() => setWithdrawModal(true)}>
                  <ArrowDownToLine size={18} /> Withdraw funds
                </button>
              </div>

              <div className="stat-grid">
                {[
                  { label: 'Total deposited',  val: fmt(totalDeposited),   icon: <TrendingUp size={18} />,      color: 'gold'  },
                  { label: 'Total owed (2×)',   val: fmt(totalOwed),        icon: <Clock size={18} />,           color: 'amber' },
                  { label: 'Total paid out',    val: fmt(totalPaidOut),     icon: <CheckCircle2 size={18} />,    color: 'green' },
                  { label: 'Total withdrawn',   val: fmt(totalWithdrawn),   icon: <ArrowDownToLine size={18} />, color: 'red'   },
                  { label: 'Active members',    val: activeMembers.length,  icon: <Users size={18} />,           color: 'blue'  },
                  { label: 'Pending payouts',   val: pendingPayouts.length, icon: <Bell size={18} />,            color: 'amber' },
                ].map((s, i) => (
                  <div key={i} className={`stat-card stat-card-${s.color}`}>
                    <div className="sc-icon">{s.icon}</div>
                    <div className="sc-val">{s.val}</div>
                    <div className="sc-lbl">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="section-panel">
                <div className="sp-header">
                  <h3>Recent members</h3>
                  <button className="sp-link" onClick={() => setTab(1)}>View all →</button>
                </div>
                <MembersTable members={members.slice(0, 5)} onView={setDetailMember} onMarkPaid={markPaid} onReject={rejectMember} />
              </div>

              {pendingPayouts.length > 0 && (
                <div className="alert-banner">
                  <AlertCircle size={18} />
                  <span><strong>{pendingPayouts.length} member{pendingPayouts.length > 1 ? 's' : ''}</strong> are due for payout.</span>
                  <button className="alert-btn" onClick={() => setTab(2)}>Review →</button>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 1: MEMBERS ── */}
          {tab === 1 && (
            <div>
              <div className="table-toolbar">
                <div className="search-wrap">
                  <Search size={15} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, ID…" />
                </div>
                <select className="filter-sel" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="pending_payout">Pending payout</option>
                  <option value="paid">Paid out</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button className="export-btn" onClick={exportMembersCSV} title="Export members CSV">
                  <Download size={15} /> Export CSV
                </button>
              </div>
              <div className="panel">
                <MembersTable members={filteredMembers} onView={setDetailMember} onMarkPaid={markPaid} onReject={rejectMember} full />
                {filteredMembers.length === 0 && <div className="empty-state">No members match your search.</div>}
              </div>
            </div>
          )}

          {/* ── TAB 2: PAYOUTS ── */}
          {tab === 2 && (
            <div>
              {pendingPayouts.length === 0 ? (
                <div className="panel empty-state" style={{ padding: 60 }}>
                  <CheckCircle2 size={40} style={{ color: 'var(--green)', margin: '0 auto 16px', display: 'block' }} />
                  <p>All payouts are up to date!</p>
                </div>
              ) : (
                <div className="panel">
                  <div className="sp-header" style={{ padding: '16px 20px 0' }}>
                    <h3>{pendingPayouts.length} pending payout{pendingPayouts.length > 1 ? 's' : ''}</h3>
                    <span style={{ fontSize: 13, color: 'var(--text2)' }}>Total: {fmt(pendingPayouts.reduce((s, m) => s + m.plan * 2, 0))}</span>
                  </div>
                  {pendingPayouts.map(m => (
                    <div key={m.id} className="payout-row">
                      <div className="pr-avatar">{m.name[0]}</div>
                      <div className="pr-info">
                        <div className="pr-name">{m.name}</div>
                        <div className="pr-detail">{m.phone} · Joined {fmtDate(m.joined)}</div>
                      </div>
                      <div className="pr-amount">
                        <div className="pr-val">{fmt(m.plan * 2)}</div>
                        <div className="pr-plan">from {fmt(m.plan)}</div>
                      </div>
                      <div className="pr-due">
                        <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>Due</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)' }}>{fmtDate(m.payout)}</div>
                      </div>
                      <div className="pr-actions">
                        <button className="action-btn action-btn-green" onClick={() => markPaid(m.id)}>
                          <Send size={14} /> Mark sent
                        </button>
                        <button className="action-btn action-btn-red" onClick={() => rejectMember(m.id)}>
                          <XCircle size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="panel" style={{ marginTop: 20 }}>
                <div className="sp-header" style={{ padding: '16px 20px 0' }}>
                  <h3>Payout history</h3>
                </div>
                {members.filter(m => m.status === 'paid').map(m => (
                  <div key={m.id} className="payout-row payout-row-dim">
                    <div className="pr-avatar" style={{ opacity: 0.5 }}>{m.name[0]}</div>
                    <div className="pr-info">
                      <div className="pr-name">{m.name}</div>
                      <div className="pr-detail">{m.phone} · Paid {fmtDate(m.payout)}</div>
                    </div>
                    <div className="pr-amount">
                      <div className="pr-val" style={{ color: 'var(--green)' }}>{fmt(m.plan * 2)}</div>
                      <div className="pr-plan">sent ✓</div>
                    </div>
                    <StatusPill status="paid" />
                  </div>
                ))}
                {members.filter(m => m.status === 'paid').length === 0 && (
                  <div className="empty-state">No completed payouts yet.</div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB 3: WITHDRAWALS ── */}
          {tab === 3 && (
            <div>
              <div className="wd-top">
                <div className="wd-balance-card">
                  <div className="wdb-label">Available to withdraw</div>
                  <div className="wdb-amount">{fmt(availableBalance)}</div>
                </div>
                <div className="wd-top-actions">
                  <button className="export-btn" onClick={exportWithdrawalsCSV}>
                    <Download size={15} /> Export CSV
                  </button>
                  <button className="btn-gold-admin" onClick={() => setWithdrawModal(true)}>
                    <ArrowDownToLine size={16} /> New withdrawal
                  </button>
                </div>
              </div>

              <div className="panel">
                <div className="sp-header" style={{ padding: '16px 20px 0' }}>
                  <h3>Withdrawal history</h3>
                </div>
                {withdrawals.map(w => (
                  <div key={w.id} className="wd-row">
                    <div className="wd-icon"><ArrowDownToLine size={16} /></div>
                    <div className="wd-info">
                      <div className="wd-note">{w.note}</div>
                      <div className="wd-meta">{w.method} → {w.mpesa} · {fmtDate(w.date)}</div>
                    </div>
                    <div className="wd-amount">−{fmt(w.amount)}</div>
                    <StatusPill status={w.status === 'completed' ? 'paid' : 'pending_payout'} label={w.status === 'completed' ? 'Completed' : 'Pending'} />
                  </div>
                ))}
                {withdrawals.length === 0 && <div className="empty-state">No withdrawals yet.</div>}
              </div>
            </div>
          )}

          {/* ── TAB 4: SETTINGS ── */}
          {tab === 4 && (
            <div>
              <div className="settings-card">
                <div className="settings-icon"><KeyRound size={22} /></div>
                <h3>Admin credentials</h3>
                <p className="settings-sub">Update your login email and password. Changes take effect immediately.</p>

                <div className="al-field">
                  <label>Admin email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="admin@ratereward.com"
                  />
                </div>
                <div className="al-field">
                  <label>New password <span style={{ color: 'var(--text3)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    placeholder="Min 8 characters"
                  />
                </div>
                {newPass && (
                  <div className="al-field">
                    <label>Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Repeat new password"
                    />
                  </div>
                )}
                {credsMsg && (
                  <p className={credsMsg.ok ? 'settings-ok' : 'al-error'}>{credsMsg.text}</p>
                )}
                <button className="btn-gold-admin" style={{ marginTop: 8 }} onClick={saveCredentials}>
                  <Lock size={15} /> Save credentials
                </button>
              </div>

              <div className="settings-card settings-danger-zone">
                <h3>Data management</h3>
                <p className="settings-sub">Export all data as CSV files for your records.</p>
                <div className="settings-export-row">
                  <button className="export-btn export-btn-lg" onClick={exportMembersCSV}>
                    <Download size={16} /> Download members CSV
                  </button>
                  <button className="export-btn export-btn-lg" onClick={exportWithdrawalsCSV}>
                    <Download size={16} /> Download withdrawals CSV
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── MEMBER DETAIL MODAL ── */}
      {detailMember && (
        <div className="modal-overlay" onClick={() => setDetailMember(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Member details</h3>
              <button className="modal-close" onClick={() => setDetailMember(null)}><X size={18} /></button>
            </div>
            <div className="modal-avatar-row">
              <div className="modal-avatar">{detailMember.name[0]}</div>
              <div>
                <div className="modal-name">{detailMember.name}</div>
                <StatusPill status={detailMember.status} />
              </div>
            </div>
            {[
              ['ID', detailMember.id],
              ['Phone', detailMember.phone],
              ['Email', detailMember.email],
              ['Plan', fmt(detailMember.plan)],
              ['Reward', fmt(detailMember.plan * 2)],
              ['Rating', '★'.repeat(detailMember.stars) + '☆'.repeat(5 - detailMember.stars)],
              ['Joined', fmtDate(detailMember.joined)],
              ['Payout date', fmtDate(detailMember.payout)],
              ['Referral code', detailMember.code],
              ['Verified referral', detailMember.referred ? '✓ Yes' : '✗ No'],
            ].map(([k, v]) => (
              <div key={k} className="modal-row">
                <span>{k}</span><strong>{v}</strong>
              </div>
            ))}
            {detailMember.status === 'pending_payout' && (
              <div className="modal-actions">
                <button className="action-btn action-btn-green" style={{ flex: 1, justifyContent: 'center' }} onClick={() => markPaid(detailMember.id)}>
                  <Send size={14} /> Mark payout sent
                </button>
                <button className="action-btn action-btn-red" style={{ flex: 1, justifyContent: 'center' }} onClick={() => rejectMember(detailMember.id)}>
                  <Ban size={14} /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── WITHDRAWAL MODAL ── */}
      {withdrawModal && (
        <div className="modal-overlay" onClick={() => { setWithdrawModal(false); setWSuccess(false); setWError('') }}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Withdraw funds</h3>
              <button className="modal-close" onClick={() => { setWithdrawModal(false); setWSuccess(false); setWError('') }}><X size={18} /></button>
            </div>
            {wSuccess ? (
              <div className="wd-success">
                <CheckCircle2 size={44} style={{ color: 'var(--green)' }} />
                <p>Withdrawal recorded successfully!</p>
              </div>
            ) : (
              <>
                <div className="wd-balance-inline">
                  Available balance: <strong>{fmt(availableBalance)}</strong>
                </div>
                <div className="al-field">
                  <label>Amount (KES)</label>
                  <input type="number" value={wForm.amount} onChange={e => { setWForm(f => ({ ...f, amount: e.target.value })); setWError('') }} placeholder="e.g. 5000" />
                </div>
                <div className="al-field">
                  <label>Withdrawal method</label>
                  <select className="filter-sel full-sel" value={wForm.method} onChange={e => setWForm(f => ({ ...f, method: e.target.value }))}>
                    <option>M-Pesa</option>
                    <option>Bank transfer</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div className="al-field">
                  <label>{wForm.method === 'M-Pesa' ? 'M-Pesa number' : wForm.method === 'Bank transfer' ? 'Bank account' : 'Recipient'}</label>
                  <input value={wForm.mpesa} onChange={e => { setWForm(f => ({ ...f, mpesa: e.target.value })); setWError('') }} placeholder={wForm.method === 'M-Pesa' ? '0712 345 678' : wForm.method === 'Bank transfer' ? 'Account number' : 'Name'} />
                </div>
                <div className="al-field">
                  <label>Note (optional)</label>
                  <input value={wForm.note} onChange={e => setWForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Operations cost" />
                </div>
                {wError && <p className="al-error">{wError}</p>}
                <button className="btn-gold-admin full-btn" onClick={submitWithdrawal}>
                  <ArrowDownToLine size={16} /> Confirm withdrawal
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatusPill({ status, label }) {
  const meta = STATUS_META[status] || { label: status, color: 'gray' }
  return <span className={`status-pill status-pill-${meta.color}`}>{label || meta.label}</span>
}

function MembersTable({ members, onView, onMarkPaid, onReject, full }) {
  return (
    <div className="members-table-wrap">
      <table className="members-table">
        <thead>
          <tr>
            <th>Member</th>
            <th>Plan</th>
            <th>Reward</th>
            {full && <th>Joined</th>}
            <th>Payout</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.id}>
              <td>
                <div className="member-cell">
                  <div className="mc-avatar">{m.name[0]}</div>
                  <div>
                    <div className="mc-name">{m.name}</div>
                    <div className="mc-phone">{m.phone}</div>
                  </div>
                </div>
              </td>
              <td><span className="plan-tag">{fmt(m.plan)}</span></td>
              <td><span className="reward-tag">{fmt(m.plan * 2)}</span></td>
              {full && <td><span className="date-tag">{new Date(m.joined).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</span></td>}
              <td><span className="date-tag">{new Date(m.payout).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}</span></td>
              <td><StatusPill status={m.status} /></td>
              <td>
                <div className="table-actions">
                  <button className="tbl-btn" title="View" onClick={() => onView(m)}><Eye size={14} /></button>
                  {m.status === 'pending_payout' && (
                    <button className="tbl-btn tbl-btn-green" title="Mark paid" onClick={() => onMarkPaid(m.id)}><Send size={14} /></button>
                  )}
                  {(m.status === 'active' || m.status === 'pending_payout') && (
                    <button className="tbl-btn tbl-btn-red" title="Reject" onClick={() => onReject(m.id)}><Ban size={14} /></button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
