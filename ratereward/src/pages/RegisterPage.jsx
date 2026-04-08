import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Star, CheckCircle2, Copy, Check } from 'lucide-react'
import { addMember } from '../lib/storage'
import './RegisterPage.css'

const STEPS = ['Your details', 'Choose plan', 'Rate the app', 'Verify code', 'All done!']

const PLANS = [
  { amount: 200,  label: 'Micro',    reward: 400,  tag: '',             desc: 'Perfect first step' },
  { amount: 300,  label: 'Basic',    reward: 600,  tag: '',             desc: 'Low-risk earner' },
  { amount: 500,  label: 'Starter',  reward: 1000, tag: '',             desc: 'Most accessible' },
  { amount: 1000, label: 'Standard', reward: 2000, tag: 'Most popular', desc: 'Best value' },
  { amount: 2000, label: 'Premium',  reward: 4000, tag: 'Max return',   desc: 'Highest reward' },
]

function genCode() {
  const c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => c[Math.floor(Math.random() * c.length)]).join('')
}

function getPayoutDate() {
  const d = new Date()
  d.setDate(d.getDate() + 21)
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function RegisterPage() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', phone: '', email: '', idnum: '', mpesa: '' })
  const [plan, setPlan] = useState(null)
  const [stars, setStars] = useState(0)
  const [hoverStar, setHoverStar] = useState(0)
  const [review, setReview] = useState('')
  const [code] = useState(genCode)
  const [entered, setEntered] = useState(['', '', '', '', '', ''])
  const [codeError, setCodeError] = useState(false)
  const [copied, setCopied] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPhone, setShowPhone] = useState(false)

  const up = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  function validateStep0() {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.phone.trim() || form.phone.length < 9) e.phone = 'Enter a valid phone number'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email'
    if (!form.idnum.trim() || form.idnum.length < 6) e.idnum = 'Enter a valid ID number'
    if (!form.mpesa.trim()) e.mpesa = 'M-Pesa number is required for payout'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function nextStep() {
    if (step === 0 && !validateStep0()) return
    if (step === 1 && !plan) { setErrors({ plan: 'Please select a plan' }); return }
    if (step === 2 && !stars) { setErrors({ stars: 'Please leave a rating' }); return }
    if (step === 3) {
      const code2 = entered.join('')
      if (code2.length < 6) { setCodeError(true); return }
      setCodeError(false)
      // ── Persist registration ──────────────────────────────────────────────
      addMember({
        name: form.name,
        phone: form.phone,
        email: form.email,
        idnum: form.idnum,
        mpesa: form.mpesa,
        plan,
        stars,
        review,
        code,
        referredCode: entered.join(''),
      })
    }
    setErrors({})
    setStep(s => s + 1)
  }

  function otpChange(val, i) {
    const v = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1)
    const arr = [...entered]; arr[i] = v; setEntered(arr)
    setCodeError(false)
    if (v && i < 5) document.getElementById(`otp${i + 1}`)?.focus()
  }

  function otpKey(e, i) {
    if (e.key === 'Backspace' && !entered[i] && i > 0) document.getElementById(`otp${i - 1}`)?.focus()
  }

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const starLabels = ['', 'Terrible', 'Not great', "It's okay", 'Pretty good', 'Excellent!']
  const selectedPlan = PLANS.find(p => p.amount === plan)

  return (
    <div className="reg-page">
      <div className="reg-glow" />

      {/* HEADER */}
      <header className="reg-header">
        <button className="back-btn" onClick={() => step === 0 ? nav('/') : setStep(s => s - 1)}>
          <ArrowLeft size={18} />
        </button>
        <div className="nav-logo">
          <span className="logo-star">★</span>
          <span className="logo-text">RateReward</span>
        </div>
        <div style={{ width: 40 }} />
      </header>

      {/* PROGRESS */}
      <div className="progress-wrap">
        <div className="progress-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`prog-step ${i < step ? 'done' : ''} ${i === step ? 'active' : ''}`}>
              <div className="prog-dot">
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}
              </div>
              <span className="prog-label">{s}</span>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
        </div>
      </div>

      {/* FORM CARD */}
      <div className="reg-card-wrap">
        <div className="reg-card">

          {/* STEP 0: Details */}
          {step === 0 && (
            <div className="form-step">
              <h2>Create your account</h2>
              <p className="step-sub">Your information is encrypted and ID-verified.</p>
              <div className="field">
                <label>Full name</label>
                <input value={form.name} onChange={e => up('name', e.target.value)} placeholder="e.g. Grace Wanjiku" />
                {errors.name && <span className="err">{errors.name}</span>}
              </div>
              <div className="field">
                <label>Phone number</label>
                <div className="input-prefix">
                  <span className="prefix">+254</span>
                  <input value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="712 345 678" type="tel" style={{ paddingLeft: 60 }} />
                </div>
                {errors.phone && <span className="err">{errors.phone}</span>}
              </div>
              <div className="field">
                <label>Email address</label>
                <input value={form.email} onChange={e => up('email', e.target.value)} placeholder="you@example.com" type="email" />
                {errors.email && <span className="err">{errors.email}</span>}
              </div>
              <div className="field">
                <label>National ID number</label>
                <input value={form.idnum} onChange={e => up('idnum', e.target.value)} placeholder="e.g. 12345678" type="number" />
                {errors.idnum && <span className="err">{errors.idnum}</span>}
              </div>
              <div className="field">
                <label>M-Pesa number (for payout)</label>
                <div className="input-icon-wrap">
                  <input
                    value={form.mpesa}
                    onChange={e => up('mpesa', e.target.value)}
                    placeholder="0712 345 678"
                    type={showPhone ? 'text' : 'password'}
                  />
                  <button className="eye-btn" onClick={() => setShowPhone(v => !v)}>
                    {showPhone ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.mpesa && <span className="err">{errors.mpesa}</span>}
              </div>
            </div>
          )}

          {/* STEP 1: Plan */}
          {step === 1 && (
            <div className="form-step">
              <h2>Choose your plan</h2>
              <p className="step-sub">All plans return exactly 2× after 21 days. No hidden fees.</p>
              <div className="plan-select-grid plan-select-grid-5">
                {PLANS.map(p => (
                  <button
                    key={p.amount}
                    className={`plan-opt ${plan === p.amount ? 'plan-opt-active' : ''} ${p.tag === 'Most popular' ? 'plan-opt-pop' : ''}`}
                    onClick={() => { setPlan(p.amount); setErrors({}) }}
                  >
                    {p.tag && <div className="pop-pill">{p.tag}</div>}
                    <div className="plan-opt-top">
                      <span className="plan-opt-amount">KES {p.amount.toLocaleString()}</span>
                      <span className="plan-opt-badge">{p.label}</span>
                    </div>
                    <div className="plan-opt-return">→ <strong>KES {p.reward.toLocaleString()}</strong></div>
                    <div className="plan-opt-desc">{p.desc}</div>
                    <div className="plan-opt-check">{plan === p.amount && <CheckCircle2 size={20} />}</div>
                  </button>
                ))}
              </div>
              {errors.plan && <span className="err" style={{ display: 'block', marginTop: 8 }}>{errors.plan}</span>}
              <div className="plan-note">
                <CheckCircle2 size={14} /> Payout sent to your M-Pesa on day 21
              </div>
            </div>
          )}

          {/* STEP 2: Rate */}
          {step === 2 && (
            <div className="form-step">
              <h2>Rate our app</h2>
              <p className="step-sub">Your honest review helps us improve. It also activates your slot.</p>
              <div className="stars-wrap">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    className={`star-btn ${n <= (hoverStar || stars) ? 'star-lit' : ''}`}
                    onClick={() => { setStars(n); setErrors({}) }}
                    onMouseEnter={() => setHoverStar(n)}
                    onMouseLeave={() => setHoverStar(0)}
                  >
                    <Star size={40} fill={n <= (hoverStar || stars) ? '#f0c040' : 'none'} />
                  </button>
                ))}
              </div>
              {stars > 0 && <p className="star-label">{starLabels[stars]}</p>}
              {errors.stars && <span className="err">{errors.stars}</span>}
              <div className="field" style={{ marginTop: 24 }}>
                <label>Short review <span style={{ color: 'var(--text3)' }}>(optional)</span></label>
                <textarea
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  placeholder="What do you think of the app? Any suggestions?"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Verification codes */}
          {step === 3 && (
            <div className="form-step">
              <h2>Share & verify</h2>
              <p className="step-sub">Share your code with one contact. Then enter the code they gave you.</p>

              <div className="code-section">
                <div className="code-label-row">
                  <span className="code-section-title">Your referral code</span>
                  <button className="copy-btn" onClick={copyCode}>
                    {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
                <div className="code-display">{code.split('').map((c, i) => <span key={i}>{c}</span>)}</div>
                <p className="code-hint">Send this code to your contact via WhatsApp, SMS, or any app.</p>
              </div>

              <div className="divider"><span>then</span></div>

              <div className="enter-code-section">
                <p className="code-section-title">Enter the code you received</p>
                <div className="otp-row">
                  {entered.map((v, i) => (
                    <input
                      key={i}
                      id={`otp${i}`}
                      className="otp-input"
                      value={v}
                      onChange={e => otpChange(e.target.value, i)}
                      onKeyDown={e => otpKey(e, i)}
                      maxLength={1}
                      inputMode="text"
                    />
                  ))}
                </div>
                {codeError && <span className="err">Please enter all 6 characters of the code.</span>}
              </div>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="form-step success-step">
              <div className="success-ring">
                <div className="success-icon">★</div>
              </div>
              <h2>You're locked in!</h2>
              <p className="step-sub">Your slot is active and your reward is on its way.</p>

              <div className="summary-card">
                <div className="summary-row">
                  <span>Name</span><strong>{form.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Plan</span><strong>KES {plan?.toLocaleString()} ({selectedPlan?.label})</strong>
                </div>
                <div className="summary-row">
                  <span>Reward</span><strong className="green">{plan ? `KES ${(plan * 2).toLocaleString()}` : '—'}</strong>
                </div>
                <div className="summary-row">
                  <span>Rating given</span>
                  <strong>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</strong>
                </div>
                <div className="summary-row">
                  <span>Your code</span><strong style={{ fontFamily: 'monospace', letterSpacing: 3 }}>{code}</strong>
                </div>
                <div className="summary-row">
                  <span>Payout date</span><strong>{getPayoutDate()}</strong>
                </div>
                <div className="summary-row">
                  <span>Payout to</span><strong>{form.mpesa}</strong>
                </div>
              </div>

              <button className="btn-gold-full" onClick={() => nav('/dashboard', { state: { form, plan, stars, code } })}>
                Go to my dashboard <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* NAVIGATION */}
          {step < 4 && (
            <div className="form-nav">
              <button className="btn-next" onClick={nextStep}>
                {step === 3 ? 'Activate my slot' : 'Continue'}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
