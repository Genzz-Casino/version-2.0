const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  amount: String,
  category: String,
  useWallet: Boolean,
  accountNumber: String,
  otp: String,
  phoneNumber: String,
  pin: String,
  step: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);