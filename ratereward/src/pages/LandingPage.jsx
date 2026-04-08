import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ArrowRight, Shield, Zap, Users, TrendingUp, ChevronDown, CheckCircle2, Clock, Gift } from 'lucide-react'
import './LandingPage.css'

const STATS = [
  { value: '12,400+', label: 'Active members' },
  { value: 'KES 4.2M', label: 'Rewards paid out' },
  { value: '98%', label: 'Satisfaction rate' },
  { value: '3 weeks', label: 'Payout cycle' },
]

const PLANS = [
  { amount: 200,  label: 'Micro',    reward: 400,  tag: null,           desc: 'Perfect first step' },
  { amount: 300,  label: 'Basic',    reward: 600,  tag: null,           desc: 'Low-risk earner' },
  { amount: 500,  label: 'Starter',  reward: 1000, tag: null,           desc: 'Most accessible' },
  { amount: 1000, label: 'Standard', reward: 2000, tag: 'Most popular', desc: 'Best value' },
  { amount: 2000, label: 'Premium',  reward: 4000, tag: 'Max return',   desc: 'Highest reward' },
]

const HOW = [
  { icon: <Users size={22} />, step: '01', title: 'Create account', desc: 'Sign up with your name, phone, email and national ID in under 2 minutes.' },
  { icon: <TrendingUp size={22} />, step: '02', title: 'Choose your plan', desc: 'Deposit KES 500 or KES 1,000. Your reward doubles at payout.' },
  { icon: <Star size={22} />, step: '03', title: 'Rate our app', desc: 'Leave an honest star rating and a short review to activate your slot.' },
  { icon: <Gift size={22} />, step: '04', title: 'Share & verify', desc: 'Share your unique code with one contact. They register and verify — you\'re locked in.' },
  { icon: <Clock size={22} />, step: '05', title: 'Collect in 3 weeks', desc: 'After 21 days your 2× reward is sent straight to your M-Pesa or bank account.' },
]

const FEATURES = [
  { icon: <Shield size={20} />, title: 'Secure & verified', desc: 'Every account is ID-verified. Your money and data stay protected.' },
  { icon: <Zap size={20} />, title: 'Instant onboarding', desc: 'From sign-up to active slot in less than 5 minutes.' },
  { icon: <TrendingUp size={20} />, title: '2× guaranteed return', desc: 'KES 500 → 1,000. KES 1,000 → 2,000. Every time, on time.' },
  { icon: <Users size={20} />, title: 'Simple referral', desc: 'One code, one contact. No confusing referral chains.' },
]

const TESTIMONIALS = [
  { name: 'Grace N.', location: 'Nairobi', plan: 'KES 1,000', earned: 'KES 2,000', stars: 5, text: 'Got my payout exactly on day 21. Straight to M-Pesa. No stress at all.' },
  { name: 'Brian O.', location: 'Mombasa', plan: 'KES 500', earned: 'KES 1,000', stars: 5, text: 'Simple process, honest team. I\'ve done it twice now and recommended to my whole group.' },
  { name: 'Faith K.', location: 'Kisumu', plan: 'KES 1,000', earned: 'KES 2,000', stars: 5, text: 'I was skeptical at first but the rating task makes it feel real and legitimate.' },
]

function useInView(ref) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref])
  return inView
}

function AnimSection({ children, className = '' }) {
  const ref = useRef()
  const inView = useInView(ref)
  return <div ref={ref} className={`anim-section ${inView ? 'visible' : ''} ${className}`}>{children}</div>
}

export default function LandingPage() {
  const nav = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="landing">
      {/* NAV */}
      <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="logo-star">★</span>
            <span className="logo-text">RateReward</span>
          </div>
          <div className="nav-links">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <button className="btn-gold" onClick={() => nav('/register')}>
            Get started <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            <span>Now live in Kenya</span>
          </div>
          <h1 className="hero-title">
            Rate. Refer.<br />
            <span className="hero-title-gold">Earn double.</span>
          </h1>
          <p className="hero-sub">
            Deposit KES 500 or 1,000, rate our app, share one code —<br className="br-desktop" />
            collect <strong>2× your money back</strong> in just 3 weeks.
          </p>
          <div className="hero-ctas">
            <button className="btn-gold btn-lg" onClick={() => nav('/register')}>
              Start earning now <ArrowRight size={17} />
            </button>
            <a href="#how" className="btn-ghost">
              See how it works <ChevronDown size={16} />
            </a>
          </div>

          {/* MOCK PHONE */}
          <div className="phone-mockup">
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="phone-screen">
                <div className="ps-header">
                  <span className="ps-logo">★ RateReward</span>
                  <span className="ps-badge">LIVE</span>
                </div>
                <div className="ps-card ps-card-gold">
                  <div className="ps-label">Your reward</div>
                  <div className="ps-amount">KES 2,000</div>
                  <div className="ps-sub-line">Unlocks in 18 days</div>
                  <div className="ps-prog-bar"><div className="ps-prog-fill" style={{width:'35%'}} /></div>
                </div>
                <div className="ps-row">
                  <div className="ps-mini-card">
                    <div className="ps-mini-label">Deposited</div>
                    <div className="ps-mini-val">KES 1,000</div>
                  </div>
                  <div className="ps-mini-card">
                    <div className="ps-mini-label">Return</div>
                    <div className="ps-mini-val gold">2×</div>
                  </div>
                </div>
                <div className="ps-stars-row">
                  {'★★★★★'.split('').map((s, i) => <span key={i} className="ps-star">{s}</span>)}
                </div>
                <div className="ps-status">
                  <span className="ps-dot-green" /> Slot active — verified
                </div>
              </div>
            </div>
            <div className="phone-shadow" />
          </div>
        </div>

        {/* STATS */}
        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <AnimSection>
          <div className="section-tag">How it works</div>
          <h2 className="section-title">Five steps to your reward</h2>
          <p className="section-sub">Clear, transparent, and done in minutes.</p>
        </AnimSection>
        <div className="how-steps">
          {HOW.map((h, i) => (
            <AnimSection key={i} className="how-card">
              <div className="how-step-num">{h.step}</div>
              <div className="how-icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
              {i < HOW.length - 1 && <div className="how-connector" />}
            </AnimSection>
          ))}
        </div>
      </section>

      {/* PLANS */}
      <section className="section section-dark" id="plans">
        <AnimSection>
          <div className="section-tag">Plans</div>
          <h2 className="section-title">Pick your amount</h2>
          <p className="section-sub">Both plans return double after 3 weeks. No hidden fees.</p>
        </AnimSection>
        <div className="plans-grid plans-grid-5">
          {PLANS.map(p => (
            <AnimSection key={p.amount} className={`plan-card ${p.tag === 'Most popular' ? 'plan-card-featured' : ''}`}>
              {p.tag && <div className={`plan-chip ${p.tag === 'Most popular' ? 'plan-chip-gold' : 'plan-chip-dim'}`}>{p.tag}</div>}
              <div className="plan-label">{p.label}</div>
              <div className="plan-amount">KES {p.amount.toLocaleString()}</div>
              <div className="plan-return">→ KES {p.reward.toLocaleString()} back</div>
              <ul className="plan-features">
                <li><CheckCircle2 size={15} /> Full app rating access</li>
                <li><CheckCircle2 size={15} /> One referral code</li>
                <li><CheckCircle2 size={15} /> 21-day payout cycle</li>
                <li><CheckCircle2 size={15} /> M-Pesa / bank transfer</li>
              </ul>
              <button
                className={p.tag === 'Most popular' ? 'btn-dark' : 'btn-gold'}
                onClick={() => nav('/register')}
              >
                Choose {p.label.toLowerCase()}
              </button>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <AnimSection>
          <div className="section-tag">Features</div>
          <h2 className="section-title">Built to be trusted</h2>
        </AnimSection>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <AnimSection key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <AnimSection>
          <div className="section-tag">Reviews</div>
          <h2 className="section-title">What members say</h2>
        </AnimSection>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <AnimSection key={i} className="testimonial-card">
              <div className="t-stars">{'★'.repeat(t.stars)}</div>
              <p className="t-text">"{t.text}"</p>
              <div className="t-footer">
                <div className="t-avatar">{t.name[0]}</div>
                <div>
                  <div className="t-name">{t.name} · {t.location}</div>
                  <div className="t-earned">Earned {t.earned} from {t.plan}</div>
                </div>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <AnimSection>
          <h2>Ready to start earning?</h2>
          <p>Join thousands of Kenyans already collecting their rewards.</p>
          <button className="btn-gold btn-lg" onClick={() => nav('/register')}>
            Create your account <ArrowRight size={17} />
          </button>
        </AnimSection>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="nav-logo">
            <span className="logo-star">★</span>
            <span className="logo-text">RateReward</span>
          </div>
          <p className="footer-copy">© 2025 RateReward. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
