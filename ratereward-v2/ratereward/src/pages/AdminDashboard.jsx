import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Wallet, ArrowDownToLine, LogOut,
  TrendingUp, Clock, CheckCircle2, XCircle, AlertCircle,
  Search, Filter, ChevronDown, Download, RefreshCw,
  Send, Eye, Ban, MoreHorizontal, Bell, Menu, X
} from 'lucide-react'
import './AdminDashboard.css'

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_MEMBERS = [
  { id: 'M001', name: 'Grace Wanjiku', phone: '0712 345 678', email: 'grace@gmail.com', plan: 1000, stars: 5, status: 'active', joined: '2025-03-15', payout: '2025-04-05', code: 'GR7X2A', referred: true },
  { id: 'M002', name: 'Brian Otieno', phone: '0723 456 789', email: 'brian@gmail.com', plan: 500, stars: 4, status: 'active', joined: '2025-03-16', payout: '2025-04-06', code: 'BR9K4M', referred: true },
  { id: 'M003', name: 'Faith Kamau', phone: '0734 567 890', email: 'faith@gmail.com', plan: 1000, stars: 5, status: 'pending_payout', joined: '2025-03-10', payout: '2025-03-31', code: 'FA2P8Q', referred: true },
  { id: 'M004', name: 'James Mwangi', phone: '0745 678 901', email: 'james@gmail.com', plan: 500, stars: 3, status: 'paid', joined: '2025-02-20', payout: '2025-03-13', code: 'JA5T1R', referred: true },
  { id: 'M005', name: 'Lydia Njeri', phone: '0756 789 012', email: 'lydia@gmail.com', plan: 1000, stars: 5, status: 'paid', joined: '2025-02-18', payout: '2025-03-11', code: 'LY8V3S', referred: true },
  { id: 'M006', name: 'Peter Kimani', phone: '0767 890 123', email: 'peter@gmail.com', plan: 1000, stars: 4, status: 'active', joined: '2025-03-18', payout: '2025-04-08', code: 'PE3W6U', referred: false },
  { id: 'M007', name: 'Amina Hassan', phone: '0778 901 234', email: 'amina@gmail.com', plan: 500, stars: 5, status: 'active', joined: '2025-03-19', payout: '2025-04-09', code: 'AM1X9B', referred: true },
  { id: 'M008', name: 'David Koech', phone: '0789 012 345', email: 'david@gmail.com', plan: 1000, stars: 4, status: 'pending_payout', joined: '2025-03-08', payout: '2025-03-29', code: 'DA6Y2C', referred: true },
  { id: 'M009', name: 'Mary Achieng', phone: '0790 123 456', email: 'mary@gmail.com', plan: 500, stars: 3, status: 'rejected', joined: '2025-03-14', payout: '2025-04-04', code: 'MA4Z5D', referred: false },
  { id: 'M010', name: 'Samuel Ruto', phone: '0701 234 567', email: 'samuel@gmail.com', plan: 1000, stars: 5, status: 'paid', joined: '2025-02-25', payout: '2025-03-18', code: 'SA7A8E', referred: true },
  { id: 'M011', name: 'Caroline Muthoni', phone: '0712 987 654', email: 'carol@gmail.com', plan: 500, stars: 4, status: 'active', joined: '2025-03-20', payout: '2025-04-10', code: 'CA2B1F', referred: true },
  { id: 'M012', name: 'Kevin Odhiambo', phone: '0723 876 543', email: 'kevin@gmail.com', plan: 1000, stars: 5, status: 'pending_payout', joined: '2025-03-09', payout: '2025-03-30', code: 'KE9C4G', referred: true },
]

const SEED_WITHDRAWALS = [
  { id: 'W001', admin: 'Admin', amount: 15000, method: 'M-Pesa', mpesa: '0712 000 001', note: 'Operations withdrawal', date: '2025-03-20', status: 'completed' },
  { id: 'W002', admin: 'Admin', amount: 8000, method: 'Bank', mpesa: 'KCB **** 4521', note: 'Platform fees', date: '2025-03-15', status: 'completed' },
  { id: 'W003', admin: 'Admin', amount: 5000, method: 'M-Pesa', mpesa: '0712 000 001', note: 'Emergency fund', date: '2025-03-10', status: 'completed' },
]

const TABS = ['Overview', 'Members', 'Payouts', 'Withdrawals']

const STATUS_META = {
  active:          { label: 'Active',          color: 'blue'   },
  pending_payout:  { label: 'Pending payout',  color: 'amber'  },
  paid:            { label: 'Paid out',         color: 'green'  },
  rejected:        { label: 'Rejected',         color: 'red'    },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n)   { return `KES ${Number(n).toLocaleString()}` }
function fmtDate(d) { return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) }

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const nav = useNavigate()
  const [tab, setTab] = useState(0)
  const [members, setMembers] = useState(SEED_MEMBERS)
  const [withdrawals, setWithdrawals] = useState(SEED_WITHDRAWALS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sideOpen, setSideOpen] = useState(false)
  const [detailMember, setDetailMember] = useState(null)
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [wForm, setWForm] = useState({ amount: '', method: 'M-Pesa', mpesa: '', note: '' })
  const [wError, setWError] = useState('')
  const [wSuccess, setWSuccess] = useState(false)
  const [notification, setNotification] = useState(null)

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

  // ── Derived financials ──────────────────────────────────────────────────────
  const totalDeposited   = members.reduce((s, m) => s + m.plan, 0)
  const totalOwed        = members.filter(m => m.status !== 'paid' && m.status !== 'rejected').reduce((s, m) => s + m.plan * 2, 0)
  const totalPaidOut     = members.filter(m => m.status === 'paid').reduce((s, m) => s + m.plan * 2, 0)
  const totalWithdrawn   = withdrawals.filter(w => w.status === 'completed').reduce((s, w) => s + w.amount, 0)
  const availableBalance = totalDeposited - totalWithdrawn
  const pendingPayouts   = members.filter(m => m.status === 'pending_payout')
  const activeMembers    = members.filter(m => m.status === 'active')

  // ── Member actions ──────────────────────────────────────────────────────────
  function markPaid(id) {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: 'paid' } : m))
    notify(`Payment marked as sent`)
    setDetailMember(null)
  }
  function rejectMember(id) {
    setMembers(ms => ms.map(m => m.id === id ? { ...m, status: 'rejected' } : m))
    notify(`Member rejected`, 'warning')
    setDetailMember(null)
  }

  // ── Withdrawal submit ───────────────────────────────────────────────────────
  function submitWithdrawal() {
    const amt = Number(wForm.amount)
    if (!amt || amt <= 0)           { setWError('Enter a valid amount'); return }
    if (amt > availableBalance)     { setWError(`Insufficient balance. Available: ${fmt(availableBalance)}`); return }
    if (!wForm.mpesa.trim())        { setWError('Enter destination account'); return }
    const newW = {
      id: `W${String(withdrawals.length + 1).padStart(3, '0')}`,
      admin: 'Admin',
      amount: amt,
      method: wForm.method,
      mpesa: wForm.mpesa,
      note: wForm.note || 'Admin withdrawal',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
    }
    setWithdrawals(ws => [newW, ...ws])
    setWSuccess(true)
    setWForm({ amount: '', method: 'M-Pesa', mpesa: '', note: '' })
    setWError('')
    setTimeout(() => { setWithdrawModal(false); setWSuccess(false) }, 2000)
    notify(`${fmt(amt)} withdrawal recorded`)
  }

  // ── Filtered members ────────────────────────────────────────────────────────
  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                        m.phone.includes(search) || m.id.includes(search)
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  // ─────────────────────────────────────────────────────────────────────────────
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
            {[<LayoutDashboard size={17} />, <Users size={17} />, <Clock size={17} />, <Wallet size={17} />][i]}
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
            {['Overview', 'Members', 'Pending payouts', 'Withdrawals'][tab]}
          </div>
          <div className="topbar-right">
            <div className="admin-badge">Admin</div>
          </div>
        </header>

        <div className="admin-body">

          {/* ── TAB 0: OVERVIEW ── */}
          {tab === 0 && (
            <div>
              {/* BALANCE HERO */}
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

              {/* STAT CARDS */}
              <div className="stat-grid">
                {[
                  { label: 'Total deposited',   val: fmt(totalDeposited),  icon: <TrendingUp size={18} />, color: 'gold'  },
                  { label: 'Total owed (2×)',    val: fmt(totalOwed),       icon: <Clock size={18} />,      color: 'amber' },
                  { label: 'Total paid out',     val: fmt(totalPaidOut),    icon: <CheckCircle2 size={18} />, color: 'green' },
                  { label: 'Total withdrawn',    val: fmt(totalWithdrawn),  icon: <ArrowDownToLine size={18} />, color: 'red' },
                  { label: 'Active members',     val: activeMembers.length, icon: <Users size={18} />,      color: 'blue'  },
                  { label: 'Pending payouts',    val: pendingPayouts.length,icon: <Bell size={18} />,       color: 'amber' },
                ].map((s, i) => (
                  <div key={i} className={`stat-card stat-card-${s.color}`}>
                    <div className="sc-icon">{s.icon}</div>
                    <div className="sc-val">{s.val}</div>
                    <div className="sc-lbl">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* RECENT MEMBERS */}
              <div className="section-panel">
                <div className="sp-header">
                  <h3>Recent members</h3>
                  <button className="sp-link" onClick={() => setTab(1)}>View all →</button>
                </div>
                <MembersTable
                  members={members.slice(0, 5)}
                  onView={setDetailMember}
                  onMarkPaid={markPaid}
                  onReject={rejectMember}
                />
              </div>

              {/* PENDING PAYOUTS ALERT */}
              {pendingPayouts.length > 0 && (
                <div className="alert-banner">
                  <AlertCircle size={18} />
                  <span><strong>{pendingPayouts.length} member{pendingPayouts.length > 1 ? 's' : ''}</strong> are due for payout. Go to the Payouts tab to action them.</span>
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
              </div>
              <div className="panel">
                <MembersTable
                  members={filteredMembers}
                  onView={setDetailMember}
                  onMarkPaid={markPaid}
                  onReject={rejectMember}
                  full
                />
                {filteredMembers.length === 0 && (
                  <div className="empty-state">No members match your search.</div>
                )}
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

              {/* Paid history */}
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
                <button className="btn-gold-admin" onClick={() => setWithdrawModal(true)}>
                  <ArrowDownToLine size={16} /> New withdrawal
                </button>
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
                {withdrawals.length === 0 && (
                  <div className="empty-state">No withdrawals yet.</div>
                )}
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
                  <input
                    type="number"
                    value={wForm.amount}
                    onChange={e => { setWForm(f => ({ ...f, amount: e.target.value })); setWError('') }}
                    placeholder="e.g. 5000"
                  />
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
                  <input
                    value={wForm.mpesa}
                    onChange={e => { setWForm(f => ({ ...f, mpesa: e.target.value })); setWError('') }}
                    placeholder={wForm.method === 'M-Pesa' ? '0712 345 678' : wForm.method === 'Bank transfer' ? 'Account number' : 'Name'}
                  />
                </div>
                <div className="al-field">
                  <label>Note (optional)</label>
                  <input
                    value={wForm.note}
                    onChange={e => setWForm(f => ({ ...f, note: e.target.value }))}
                    placeholder="e.g. Operations cost"
                  />
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

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatusPill({ status, label }) {
  const meta = STATUS_META[status] || { label: status, color: 'gray' }
  const txt = label || meta.label
  return <span className={`status-pill status-pill-${meta.color}`}>{txt}</span>
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
              {full && <td><span className="date-tag">{new Date(m.joined).toLocaleDateString('en-KE', { day:'numeric', month:'short' })}</span></td>}
              <td><span className="date-tag">{new Date(m.payout).toLocaleDateString('en-KE', { day:'numeric', month:'short' })}</span></td>
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
