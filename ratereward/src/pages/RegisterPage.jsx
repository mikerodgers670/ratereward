import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const SUPABASE_URL = "https://cajmxqlkxsdnuzypnbxc.supabase.co";
const SUPABASE_KEY = "sb_publishable_fSRvlD3PY9xNfsaMD5vvuQ_VNBUbKll";


const plans = [
  { amount: 200, label: "KES 200", returns: "KES 300" },
  { amount: 300, label: "KES 300", returns: "KES 450" },
  { amount: 500, label: "KES 500", returns: "KES 750" },
  { amount: 1000, label: "KES 1,000", returns: "KES 1,500" },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    plan: "",
  });
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

    const { error: dbError } = await supabase.from("members").insert([
      {
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        plan: parseInt(form.plan),
        amount_paid: selectedPlan.amount,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (dbError) {
      setError("Registration failed. Please try again.");
      console.error(dbError);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card success-card">
          <div className="success-icon">✅</div>
          <h2>Registration Successful!</h2>
          <p>
            Thank you, <strong>{form.full_name}</strong>! Your registration has
            been received.
          </p>
          <p>
            Selected plan: <strong>KES {form.plan}</strong>
          </p>
          <p>Our team will contact you on <strong>{form.phone}</strong> with payment instructions.</p>
          <button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account</h2>
        <p className="register-subtitle">Join RateReward and start earning</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              placeholder="John Doe"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="07XXXXXXXX"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
