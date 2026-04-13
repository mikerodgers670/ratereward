import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import './AdminLoginPage.css';

const ADMIN_EMAIL = 'admin@ratereward.com';
const ADMIN_PASSWORD = 'Admin@2025!';

export default function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
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
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <ShieldCheck size={40} color="#00d4aa" />
        </div>
        <h2>Admin Login</h2>
        <p className="admin-login-subtitle">RateReward Admin Panel</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="admin@ratereward.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group password-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Enter password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pass"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? 'Logging in...' : (
              <><Lock size={16} /> Login</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
