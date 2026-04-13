
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const SUPABASE_URL = "https://cajmxqlkxsdnuzypnbxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_fSRvlD3PY9xNfsaMD5vvuQ_VNBUbKll";

const plans = [
  { amount: 200,  label: "KES 200",   returns: "KES 400" },
  { amount: 300,  label: "KES 300",   returns: "KES 600" },
  { amount: 500,  label: "KES 500",   returns: "KES 1,000" },
  { amount: 1000, label: "KES 1,000", returns: "KES 2,000" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", plan: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.phone || !form.plan) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const selectedPlan = plans.find((p) => p.amount === parseInt(form.plan));
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          plan: parseInt(form.plan),
          amount_paid: selectedPlan.amount,
          status: "pending",
        }),
      });
      if (response.ok) {
        setSuccess(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="rp-container">
        <div className="rp-card success-card">
          <div className="success-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>Thank you, <strong>{form.full_name}</strong>!</p>
          <p>Selected plan: <strong className="gold">KES {form.plan}</strong></p>
          <p>Our team will contact you on <strong>{form.phone}</strong> with payment instructions.</p>
          <button className="rp-btn" onClick={() => navigate("/")}>Back to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="rp-container">
      <div className="rp-card">
        {/* Header */}
        <div className="rp-header">
          <div className="rp-logo">
            <span className="rp-star">★</span>
            <span className="rp-logo-text">RateReward</span>
          </div>
          <h2>Create Account</h2>
          <p>Join thousands earning double in 3 weeks</p>
        </div>

        {error && <div className="rp-error">{error}</div>}

        <form onSubmit={handleSubmit} className="rp-form">
          <div className="rp-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="John Doe"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="rp-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="rp-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="07XXXXXXXX"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="rp-group">
            <label>Select Investment Plan</label>
            <select name="plan" value={form.plan} onChange={handleChange}>
              <option value="">-- Choose a plan --</option>
              {plans.map((p) => (
                <option key={p.amount} value={p.amount}>
                  {p.label} → Returns {p.returns}
                </option>
              ))}
            </select>
          </div>

          {/* Plan cards */}
          {form.plan && (
            <div className="rp-plan-preview">
              <div className="rp-plan-row">
                <span>You deposit</span>
                <span className="gold">KES {parseInt(form.plan).toLocaleString()}</span>
              </div>
              <div className="rp-plan-row">
                <span>You receive</span>
                <span className="gold">{plans.find(p => p.amount === parseInt(form.plan))?.returns}</span>
              </div>
              <div className="rp-plan-row">
                <span>In</span>
                <span className="gold">21 days</span>
              </div>
            </div>
          )}

          <button type="submit" className="rp-btn" disabled={loading}>
            {loading ? "Submitting..." : "Register Now →"}
          </button>
        </form>

        <p className="rp-footer-text">Already have questions? <a href="/">Contact us</a></p>
      </div>
    </div>
  );
}
