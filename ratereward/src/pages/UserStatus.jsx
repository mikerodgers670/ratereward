import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "./UserStatus.css";

export default function UserStatus() {
  const [phone, setPhone] = useState("");
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheck = async () => {
    setLoading(true);
    setError("");
    setMember(null);

    const cleaned = phone.trim();
    if (!cleaned) {
      setError("Please enter your phone number.");
      setLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase
      .from("members")
      .select("*")
      .eq("phone", cleaned)
      .single();

    if (dbError || !data) {
      setError("No account found with that phone number.");
    } else {
      setMember(data);
    }

    setLoading(false);
  };

  const getDaysInfo = (member) => {
    // Only show countdown if status is active AND approved_at exists
    if (member.status !== "active" || !member.approved_at) return null;

    const approvedDate = new Date(member.approved_at);
    const now = new Date();
    const totalDays = 14;
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysPassed = Math.floor((now - approvedDate) / msPerDay);
    const daysRemaining = Math.max(totalDays - daysPassed, 0);
    const progress = Math.min(((totalDays - daysRemaining) / totalDays) * 100, 100);
    const payoutDate = new Date(approvedDate);
    payoutDate.setDate(payoutDate.getDate() + totalDays);

    return { daysRemaining, progress, payoutDate };
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return { label: "Pending Approval", emoji: "⏳", cls: "status-pending" };
      case "active": return { label: "Active", emoji: "✅", cls: "status-active" };
      case "completed": return { label: "Completed", emoji: "🎉", cls: "status-completed" };
      default: return { label: status, emoji: "❓", cls: "" };
    }
  };

  const daysInfo = member ? getDaysInfo(member) : null;
  const statusInfo = member ? getStatusLabel(member.status) : null;

  return (
    <div className="us-wrapper">
      <div className="us-card">
        {/* Header */}
        <div className="us-header">
          <div className="us-logo">Rate<span>Reward</span></div>
          <p className="us-subtitle">Check your investment status</p>
        </div>

        {/* Search */}
        {!member && (
          <div className="us-search-section">
            <label className="us-label">Enter your phone number</label>
            <input
              className="us-input"
              type="tel"
              placeholder="e.g. 0712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            />
            {error && <p className="us-error">{error}</p>}
            <button className="us-btn" onClick={handleCheck} disabled={loading}>
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        )}

        {/* Result */}
        {member && (
          <div className="us-result">
            {/* Name & Status */}
            <div className="us-name-row">
              <div className="us-avatar">{member.full_name?.charAt(0).toUpperCase()}</div>
              <div>
                <h2 className="us-name">{member.full_name}</h2>
                <span className={`us-badge ${statusInfo.cls}`}>
                  {statusInfo.emoji} {statusInfo.label}
                </span>
              </div>
            </div>

            {/* Plan Details */}
            <div className="us-details">
              <div className="us-detail-row">
                <span>Plan</span>
                <span>{member.plan}</span>
              </div>
              <div className="us-detail-row">
                <span>Deposit</span>
                <span>KSh {Number(member.amount).toLocaleString()}</span>
              </div>
              <div className="us-detail-row highlight">
                <span>You Receive</span>
                <span>KSh {Number(member.reward).toLocaleString()}</span>
              </div>
              <div className="us-detail-row">
                <span>Registered</span>
                <span>{new Date(member.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Status Messages */}
            {member.status === "pending" && (
              <div className="us-notice pending">
                <span>⏳</span>
                <div>
                  <strong>Awaiting Approval</strong>
                  <p>Once you deposit and we confirm your payment, your account will be activated and your 14-day countdown begins.</p>
                </div>
              </div>
            )}

            {member.status === "active" && daysInfo && (
              <div className="us-countdown">
                <div className="us-countdown-header">
                  <span>⏱ Days Remaining</span>
                  <span className="us-days-num">{daysInfo.daysRemaining} days</span>
                </div>
                <div className="us-progress-bar">
                  <div className="us-progress-fill" style={{ width: `${daysInfo.progress}%` }} />
                </div>
                <p className="us-payout-date">
                  Expected payout: <strong>{daysInfo.payoutDate.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })}</strong>
                </p>
              </div>
            )}

            {member.status === "completed" && (
              <div className="us-notice completed">
                <span>🎉</span>
                <div>
                  <strong>Payout Complete!</strong>
                  <p>Your reward of KSh {Number(member.reward).toLocaleString()} has been sent. Thank you for investing with RateReward!</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="us-actions">
              <button className="us-btn-ghost" onClick={() => { setMember(null); setPhone(""); }}>
                Check Another
              </button>
              <button className="us-btn" onClick={() => navigate("/")}>
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
