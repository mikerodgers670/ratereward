// ─── RateReward Persistent Storage Layer ─────────────────────────────────────
const KEYS = {
  MEMBERS:     'rr_members',
  WITHDRAWALS: 'rr_withdrawals',
  ADMIN_CREDS: 'rr_admin_creds',
}

const DEFAULT_MEMBERS = [
  { id: 'M001', name: 'Grace Wanjiku',    phone: '0712 345 678', email: 'grace@gmail.com',  plan: 1000, stars: 5, status: 'active',         joined: '2025-03-15', payout: '2025-04-05', code: 'GR7X2A', referred: true  },
  { id: 'M002', name: 'Brian Otieno',     phone: '0723 456 789', email: 'brian@gmail.com',  plan: 500,  stars: 4, status: 'active',         joined: '2025-03-16', payout: '2025-04-06', code: 'BR9K4M', referred: true  },
  { id: 'M003', name: 'Faith Kamau',      phone: '0734 567 890', email: 'faith@gmail.com',  plan: 1000, stars: 5, status: 'pending_payout', joined: '2025-03-10', payout: '2025-03-31', code: 'FA2P8Q', referred: true  },
  { id: 'M004', name: 'James Mwangi',     phone: '0745 678 901', email: 'james@gmail.com',  plan: 200,  stars: 3, status: 'paid',           joined: '2025-02-20', payout: '2025-03-13', code: 'JA5T1R', referred: true  },
  { id: 'M005', name: 'Lydia Njeri',      phone: '0756 789 012', email: 'lydia@gmail.com',  plan: 2000, stars: 5, status: 'paid',           joined: '2025-02-18', payout: '2025-03-11', code: 'LY8V3S', referred: true  },
  { id: 'M006', name: 'Peter Kimani',     phone: '0767 890 123', email: 'peter@gmail.com',  plan: 300,  stars: 4, status: 'active',         joined: '2025-03-18', payout: '2025-04-08', code: 'PE3W6U', referred: false },
  { id: 'M007', name: 'Amina Hassan',     phone: '0778 901 234', email: 'amina@gmail.com',  plan: 500,  stars: 5, status: 'active',         joined: '2025-03-19', payout: '2025-04-09', code: 'AM1X9B', referred: true  },
  { id: 'M008', name: 'David Koech',      phone: '0789 012 345', email: 'david@gmail.com',  plan: 1000, stars: 4, status: 'pending_payout', joined: '2025-03-08', payout: '2025-03-29', code: 'DA6Y2C', referred: true  },
  { id: 'M009', name: 'Mary Achieng',     phone: '0790 123 456', email: 'mary@gmail.com',   plan: 200,  stars: 3, status: 'rejected',       joined: '2025-03-14', payout: '2025-04-04', code: 'MA4Z5D', referred: false },
  { id: 'M010', name: 'Samuel Ruto',      phone: '0701 234 567', email: 'samuel@gmail.com', plan: 2000, stars: 5, status: 'paid',           joined: '2025-02-25', payout: '2025-03-18', code: 'SA7A8E', referred: true  },
  { id: 'M011', name: 'Caroline Muthoni', phone: '0712 987 654', email: 'carol@gmail.com',  plan: 300,  stars: 4, status: 'active',         joined: '2025-03-20', payout: '2025-04-10', code: 'CA2B1F', referred: true  },
  { id: 'M012', name: 'Kevin Odhiambo',   phone: '0723 876 543', email: 'kevin@gmail.com',  plan: 1000, stars: 5, status: 'pending_payout', joined: '2025-03-09', payout: '2025-03-30', code: 'KE9C4G', referred: true  },
]

const DEFAULT_WITHDRAWALS = [
  { id: 'W001', admin: 'Admin', amount: 15000, method: 'M-Pesa',        mpesa: '0712 000 001',  note: 'Operations withdrawal', date: '2025-03-20', status: 'completed' },
  { id: 'W002', admin: 'Admin', amount: 8000,  method: 'Bank transfer', mpesa: 'KCB **** 4521', note: 'Platform fees',         date: '2025-03-15', status: 'completed' },
  { id: 'W003', admin: 'Admin', amount: 5000,  method: 'M-Pesa',        mpesa: '0712 000 001',  note: 'Emergency fund',        date: '2025-03-10', status: 'completed' },
]

const DEFAULT_CREDS = { email: 'admin@ratereward.com', passHash: btoa('Admin@2025!') }

function load(key, fallback) {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback }
  catch { return fallback }
}
function save(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

// ── Members ───────────────────────────────────────────────────────────────────
export function getMembers()         { return load(KEYS.MEMBERS, DEFAULT_MEMBERS) }
export function saveMembers(members) { save(KEYS.MEMBERS, members) }

export function addMember(member) {
  const members = getMembers()
  const newId = 'M' + String(members.length + 1).padStart(3, '0')
  const now = new Date()
  const payout = new Date(now)
  payout.setDate(payout.getDate() + 21)
  const full = {
    ...member,
    id: newId,
    status: 'active',
    joined: now.toISOString().split('T')[0],
    payout: payout.toISOString().split('T')[0],
    referred: true,
  }
  saveMembers([full, ...members])
  return full
}

// ── Withdrawals ───────────────────────────────────────────────────────────────
export function getWithdrawals()              { return load(KEYS.WITHDRAWALS, DEFAULT_WITHDRAWALS) }
export function saveWithdrawals(withdrawals)  { save(KEYS.WITHDRAWALS, withdrawals) }

export function addWithdrawal(w) {
  const list = getWithdrawals()
  const newId = 'W' + String(list.length + 1).padStart(3, '0')
  const full = { ...w, id: newId, date: new Date().toISOString().split('T')[0], status: 'completed' }
  const updated = [full, ...list]
  saveWithdrawals(updated)
  return full
}

// ── Admin credentials ─────────────────────────────────────────────────────────
export function getAdminCreds() { return load(KEYS.ADMIN_CREDS, DEFAULT_CREDS) }

export function verifyAdmin(email, password) {
  const creds = getAdminCreds()
  return creds.email === email && creds.passHash === btoa(password)
}

export function updateAdminCreds(email, password) {
  save(KEYS.ADMIN_CREDS, { email, passHash: btoa(password) })
}

// ── CSV Export ────────────────────────────────────────────────────────────────
export function exportMembersCSV() {
  const members = getMembers()
  const headers = ['ID','Name','Phone','Email','Plan (KES)','Reward (KES)','Stars','Status','Joined','Payout Date','Code','Referred']
  const rows = members.map(m => [m.id, m.name, m.phone, m.email, m.plan, m.plan * 2, m.stars, m.status, m.joined, m.payout, m.code, m.referred ? 'Yes' : 'No'])
  _downloadCSV('ratereward-members.csv', headers, rows)
}

export function exportWithdrawalsCSV() {
  const withdrawals = getWithdrawals()
  const headers = ['ID','Amount (KES)','Method','Destination','Note','Date','Status']
  const rows = withdrawals.map(w => [w.id, w.amount, w.method, w.mpesa, w.note, w.date, w.status])
  _downloadCSV('ratereward-withdrawals.csv', headers, rows)
}

function _downloadCSV(filename, headers, rows) {
  const esc = v => '"' + String(v).replace(/"/g, '""') + '"'
  const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
