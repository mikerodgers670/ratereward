import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { verifyAdmin } from '../lib/storage'
import './AdminLoginPage.css'

export default function AdminLoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      if (verifyAdmin(email, pass)) {
        sessionStorage.setItem('rr_admin', '1')
        nav('/admin/dashboard')
      } else {
        setError('Invalid email or password.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="admin-login-page">
      <div className="al-glow" />
      <div className="al-card">
        <div className="al-icon-wrap">
          <ShieldCheck size={28} />
        </div>
        <h1>Admin portal</h1>
        <p className="al-sub">RateReward control center</p>

        <form onSubmit={handleLogin}>
          <div className="al-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              placeholder="admin@ratereward.com"
              autoComplete="username"
            />
          </div>
          <div className="al-field">
            <label>Password</label>
            <div className="al-pass-wrap">
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError('') }}
                placeholder="••••••••••"
                autoComplete="current-password"
              />
              <button type="button" className="al-eye" onClick={() => setShowPass(v => !v)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          {error && <p className="al-error">{error}</p>}
          <button type="submit" className="al-btn" disabled={loading}>
            {loading ? <span className="al-spinner" /> : <><Lock size={15} /> Sign in</>}
          </button>
        </form>

        <p className="al-hint">
          Default: <code>admin@ratereward.com</code> / <code>Admin@2025!</code><br />
          <span style={{ fontSize: 11, opacity: 0.5 }}>Change credentials in Settings tab after login.</span>
        </p>
        <a className="al-back" href="/">← Back to site</a>
      </div>
    </div>
  )
}
