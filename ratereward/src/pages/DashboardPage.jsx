import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, Star, Gift, Share2, CheckCircle2, Bell, ChevronRight, Copy, Check } from 'lucide-react'
import './DashboardPage.css'

const TOTAL_DAYS = 21

function getPayoutDate() {
  const d = new Date()
  d.setDate(d.getDate() + TOTAL_DAYS)
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function DashboardPage() {
  const { state } = useLocation()
  const nav = useNavigate()
  const [copied, setCopied] = useState(false)
  const [daysLeft] = useState(21)

  const form = state?.form || { name: 'Demo User', mpesa: '0712 345 678' }
  const plan = state?.plan || 1000
  const stars = state?.stars || 5
  const code = state?.code || 'ABC123'
  const reward = plan * 2
  const progress = Math.round(((TOTAL_DAYS - daysLeft) / TOTAL_DAYS) * 100)
  const firstName = form.name?.split(' ')[0] || 'there'

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const activities = [
    { icon: <CheckCircle2 size={16} />, color: 'green', text: 'Account verified successfully', time: 'Just now' },
    { icon: <Star size={16} />, color: 'gold', text: `You rated the app ${stars} star${stars !== 1 ? 's' : ''}`, time: 'Just now' },
    { icon: <Gift size={16} />, color: 'gold', text: `Reward of KES ${reward.toLocaleString()} activated`, time: 'Just now' },
    { icon: <Clock size={16} />, color: 'amber', text: `Payout scheduled for ${getPayoutDate()}`, time: 'Processing' },
  ]

  return (
    <div className="dash-page">
      <div className="dash-glow" />

      {/* HEADER */}
      <header className="dash-header">
        <div className="dash-header-inner">
          <div className="nav-logo">
            <span className="logo-star">★</span>
            <span className="logo-text">RateReward</span>
          </div>
          <div className="dash-user">
            <div className="dash-avatar">{firstName[0]?.toUpperCase()}</div>
            <span className="dash-username">{firstName}</span>
          </div>
        </div>
      </header>

      <div className="dash-content">
        {/* GREETING */}
        <div className="dash-greeting">
          <h1>Welcome, {firstName}! 👋</h1>
          <p>Your reward slot is active. Here's your full overview.</p>
        </div>

        {/* HERO CARD */}
        <div className="reward-hero-card">
          <div className="reward-hero-top">
            <div>
              <div className="rh-label">Your reward</div>
              <div className="rh-amount">KES {reward.toLocaleString()}</div>
              <div className="rh-sub">Deposited KES {plan.toLocaleString()} · 2× return</div>
            </div>
            <div className="rh-ring">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none" stroke="#f0c040" strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="44" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Syne,sans-serif">{progress}%</text>
              </svg>
            </div>
          </div>
          <div className="rh-progress-section">
            <div className="rh-days-row">
              <span>{TOTAL_DAYS - daysLeft} days elapsed</span>
              <span><strong>{daysLeft} days</strong> remaining</span>
            </div>
            <div className="rh-bar"><div className="rh-fill" style={{ width: `${Math.max(4, progress)}%` }} /></div>
            <div className="rh-payout">Payout to {form.mpesa} on {getPayoutDate()}</div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="dash-stats">
          <div className="d-stat">
            <div className="d-stat-icon" style={{ background: 'rgba(240,192,64,0.12)', color: 'var(--gold)' }}><Star size={18} /></div>
            <div className="d-stat-val">{'★'.repeat(stars)}</div>
            <div className="d-stat-lbl">Rating given</div>
          </div>
          <div className="d-stat">
            <div className="d-stat-icon" style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--green)' }}><CheckCircle2 size={18} /></div>
            <div className="d-stat-val" style={{ color: 'var(--green)' }}>Active</div>
            <div className="d-stat-lbl">Slot status</div>
          </div>
          <div className="d-stat">
            <div className="d-stat-icon" style={{ background: 'rgba(240,192,64,0.12)', color: 'var(--gold)' }}><Clock size={18} /></div>
            <div className="d-stat-val">{daysLeft}</div>
            <div className="d-stat-lbl">Days left</div>
          </div>
          <div className="d-stat">
            <div className="d-stat-icon" style={{ background: 'rgba(240,192,64,0.12)', color: 'var(--gold)' }}><Gift size={18} /></div>
            <div className="d-stat-val">KES {reward.toLocaleString()}</div>
            <div className="d-stat-lbl">Expected</div>
          </div>
        </div>

        {/* REFERRAL CODE */}
        <div className="section-card">
          <div className="sc-header">
            <Share2 size={18} />
            <h3>Your referral code</h3>
          </div>
          <p className="sc-sub">Share this with friends so they can join and verify your slot.</p>
          <div className="ref-code-row">
            <div className="ref-code">{code}</div>
            <button className="copy-pill" onClick={copyCode}>
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
          <div className="share-platforms">
            <a className="share-pill whatsapp" href={`https://wa.me/?text=Join%20RateReward%20and%20earn%20double!%20Use%20my%20code:%20${code}`} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="share-pill sms" href={`sms:?body=Join%20RateReward,%20use%20my%20code%20${code}%20to%20activate%20your%20slot`}>
              SMS
            </a>
          </div>
        </div>

        {/* ACTIVITY */}
        <div className="section-card">
          <div className="sc-header">
            <Bell size={18} />
            <h3>Activity</h3>
          </div>
          <div className="activity-list">
            {activities.map((a, i) => (
              <div key={i} className="activity-item">
                <div className={`activity-icon activity-icon-${a.color}`}>{a.icon}</div>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* NEXT STEPS */}
        <div className="section-card">
          <div className="sc-header">
            <CheckCircle2 size={18} />
            <h3>What happens next</h3>
          </div>
          {[
            { done: true, text: 'Account created & verified' },
            { done: true, text: `KES ${plan.toLocaleString()} deposited` },
            { done: true, text: 'App rated & review submitted' },
            { done: true, text: 'Referral code shared' },
            { done: false, text: `Wait 21 days — payout on ${getPayoutDate()}` },
            { done: false, text: `KES ${reward.toLocaleString()} sent to ${form.mpesa}` },
          ].map((s, i) => (
            <div key={i} className="next-item">
              <div className={`next-dot ${s.done ? 'next-dot-done' : ''}`}>
                {s.done && <Check size={11} />}
              </div>
              <span style={{ color: s.done ? 'var(--text)' : 'var(--text2)' }}>{s.text}</span>
            </div>
          ))}
        </div>

        <button className="btn-ghost-full" onClick={() => nav('/')}>
          Back to home
        </button>
      </div>
    </div>
  )
}
