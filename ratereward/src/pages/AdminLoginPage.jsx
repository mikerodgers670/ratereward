import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'admin@ratereward.com';
const ADMIN_PASSWORD = 'Admin@2025!';

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        nav('/admin/dashboard');
      } else {
        setError('Invalid email or password.');
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f1a',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        background: '#1a1a2e',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        <h2 style={{ color: '#00d4aa', marginBottom: '8px', textAlign: 'center' }}>
          Admin Login
        </h2>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '32px' }}>
          RateReward Admin Panel
        </p>

        {error && (
          <div style={{
            background: '#ff4d4d22',
            border: '1px solid #ff4d4d',
            color: '#ff4d4d',
            padding: '10px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@ratereward.com"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#0f0f1a',
                color: 'white',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ color: '#ccc', display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid #333',
                background: '#0f0f1a',
                color: 'white',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#555' : '#00d4aa',
              color: loading ? '#888' : '#0f0f1a',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
