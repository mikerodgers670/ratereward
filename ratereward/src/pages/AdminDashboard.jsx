import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SUPABASE_URL = 'https://cajmxqlkxsdnuzypnbxc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_fSRvlD3PY9xNfsaMD5vvuQ_VNBUbKll';

const headers = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function AdminDashboard() {
  const nav = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!sessionStorage.getItem('adminLoggedIn')) {
      nav('/admin');
      return;
    }
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/members?select=*&order=created_at.desc`, { headers });
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }
  const approveMember = async (id) => {
  const { error } = await supabase
    .from("members")
    .update({
      status: "active",
      approved_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (!error) fetchMembers();
};


  async function deleteMember(id) {
    if (!window.confirm('Delete this member?')) return;
    await fetch(`${SUPABASE_URL}/rest/v1/members?id=eq.${id}`, { method: 'DELETE', headers });
    setMembers(prev => prev.filter(m => m.id !== id));
  }

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q);
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = members.reduce((s, m) => s + m.amount_paid, 0);
  const pending = members.filter(m => m.status === 'pending').length;
  const active = members.filter(m => m.status === 'active').length;

  const s = {
    page: { minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Segoe UI, sans-serif' },
    header: { background: '#1a1a2e', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    h1: { color: '#00d4aa', fontSize: '1.4rem', fontWeight: 700, margin: 0 },
    headerBtns: { display: 'flex', gap: '12px' },
    btn: (bg, color) => ({ padding: '8px 18px', background: bg, color, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }),
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '20px', padding: '28px 32px 16px' },
    statCard: (border) => ({ background: 'white', borderRadius: '12px', padding: '24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${border}` }),
    statH3: { fontSize: '2rem', fontWeight: 800, color: '#1a1a2e', margin: 0 },
    statP: { color: '#666', marginTop: '6px', fontSize: '0.9rem', margin: '6px 0 0' },
    filtersRow: { display: 'flex', gap: '16px', padding: '0 32px 20px', flexWrap: 'wrap' },
    input: { padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', flex: 1, minWidth: '200px', background: 'white' },
    select: { padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem', background: 'white' },
    tableWrap: { margin: '0 32px', background: 'white', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { background: '#1a1a2e', color: 'white', padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' },
    td: { padding: '14px 16px', borderBottom: '1px solid #f0f0f0', fontSize: '0.9rem', color: '#333' },
    badge: (status) => {
      const colors = { pending: ['#fff3cd','#856404'], active: ['#d1f7ee','#0a6b4f'], completed: ['#d4edda','#155724'] };
      const [bg, color] = colors[status] || ['#eee','#333'];
      return { padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, background: bg, color };
    },
    actionBtn: (bg) => ({ padding: '5px 12px', background: bg, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, marginRight: '6px' }),
    center: { textAlign: 'center', padding: '60px', color: '#666' },
  };

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1 style={s.h1}>RateReward Admin</h1>
        <div style={s.headerBtns}>
          <button style={s.btn('#00d4aa', '#1a1a2e')} onClick={fetchMembers}>🔄 Refresh</button>
          <button style={s.btn('#e74c3c', 'white')} onClick={() => { sessionStorage.removeItem('adminLoggedIn'); nav('/admin'); }}>Logout</button>
        </div>
      </header>

      <div style={s.statsGrid}>
        <div style={s.statCard('#6c63ff')}>
          <h3 style={s.statH3}>{members.length}</h3>
          <p style={s.statP}>Total Members</p>
        </div>
        <div style={s.statCard('#00d4aa')}>
          <h3 style={s.statH3}>{active}</h3>
          <p style={s.statP}>Active</p>
        </div>
        <div style={s.statCard('#f39c12')}>
          <h3 style={s.statH3}>{pending}</h3>
          <p style={s.statP}>Pending</p>
        </div>
        <div style={s.statCard('#27ae60')}>
          <h3 style={s.statH3}>KES {totalRevenue.toLocaleString()}</h3>
          <p style={s.statP}>Total Collected</p>
        </div>
      </div>

      <div style={s.filtersRow}>
        <input style={s.input} placeholder="Search by name, email or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        <select style={s.select} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {loading ? (
        <div style={s.center}>Loading members...</div>
      ) : filtered.length === 0 ? (
        <div style={s.center}>{members.length === 0 ? 'No members registered yet.' : 'No members match your search.'}</div>
      ) : (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                {['Name','Email','Phone','Plan (KES)','Status','Registered','Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id}>
                  <td style={s.td}>{m.full_name}</td>
                  <td style={s.td}>{m.email}</td>
                  <td style={s.td}>{m.phone}</td>
                  <td style={s.td}>{m.amount_paid.toLocaleString()}</td>
                  <td style={s.td}><span style={s.badge(m.status)}>{m.status}</span></td>
                  <td style={s.td}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td style={s.td}>
                    {m.status === 'pending' && <button style={s.actionBtn('#00d4aa')} onClick={() => updateStatus(m.id, 'active')}>Approve</button>}
                    {m.status === 'active' && <button style={s.actionBtn('#6c63ff')} onClick={() => updateStatus(m.id, 'completed')}>Complete</button>}
                    <button style={s.actionBtn('#e74c3c')} onClick={() => deleteMember(m.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
