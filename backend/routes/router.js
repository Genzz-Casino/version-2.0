const express = require('express');
const router = express.Router();
const LoanApplication = require("../Models/LoanApplication");
const Admin = require("../Models/Admin");
const jwt = require('jsonwebtoken'); // Install: npm install jsonwebtoken

// JWT Secret (store in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// ============= ADMIN ROUTES =============

// Admin Registration
router.post('/admin/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        error: 'Admin already exists with this email' 
      });
    }
    
    // Create new admin
    const admin = new Admin({
      email,
      password,
      name
    });
    
    await admin.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return admin info without password
    const adminData = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    };
    
    res.json({
      success: true,
      message: 'Admin registered successfully',
      data: adminData,
      token
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return admin info without password
    const adminData = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    };
    
    res.json({
      success: true,
      message: 'Login successful',
      data: adminData,
      token
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get all admins (protected - requires authentication)
router.get('/admins', async (req, res) => {
  try {
    const admins = await Admin.find().select('-password'); // Exclude password
    res.json({
      success: true,
      data: admins
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get single admin by ID (protected - requires authentication)
router.get('/admin/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        error: 'Admin not found' 
      });
    }
    
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============= LOAN APPLICATION ROUTES =============

// Get all loan applications
router.get('/applications', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      step, 
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    let filter = {};
    if (step) filter.step = parseInt(step);
    if (category) filter.category = category;
    
    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination info
    const total = await LoanApplication.countDocuments(filter);
    
    // Get applications with pagination
    const loans = await LoanApplication.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: loans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get single loan application by ID
router.get('/applications/:id', async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        error: 'Loan application not found' 
      });
    }
    
    res.json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete loan application by ID
router.delete('/applications/:id', async (req, res) => {
  try {
    const loan = await LoanApplication.findByIdAndDelete(req.params.id);
    
    if (!loan) {
      return res.status(404).json({ 
        success: false, 
        error: 'Loan application not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Loan application deleted successfully',
      data: loan
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete multiple loan applications
router.delete('/applications', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide an array of application IDs to delete' 
      });
    }
    
    const result = await LoanApplication.deleteMany({ _id: { $in: ids } });
    
    res.json({
      success: true,
      message: `${result.deletedCount} loan application(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get application statistics
router.get('/applications/stats/summary', async (req, res) => {
  try {
    const total = await LoanApplication.countDocuments();
    const completed = await LoanApplication.countDocuments({ step: 5 });
    const inProgress = await LoanApplication.countDocuments({ step: { $lt: 5 } });
    
    // Group by step
    const stepStats = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$step',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Group by category
    const categoryStats = await LoanApplication.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        completed,
        inProgress,
        byStep: stepStats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============= LOAN APPLICATION ROUTES =============

// Create new application (Step 1)
router.post('/create', async (req, res) => {
  try {
    const { amount, category, useWallet } = req.body;
    
    const loan = new LoanApplication({
      amount,
      category,
      useWallet,
      step: 2
    });
    
    await loan.save();
    res.json({ 
      success: true, 
      message: 'Loan request created',
      data: loan 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update account number (Step 2)
router.put('/update-account/:id', async (req, res) => {
  try {
    const { accountNumber } = req.body;
    
    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { 
        accountNumber, 
        step: 3,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!loan) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Account number updated',
      data: loan 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update OTP (Step 3)
router.put('/update-otp/:id', async (req, res) => {
  try {
    const { otp, phoneNumber } = req.body;
    
    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { 
        otp, 
        phoneNumber,
        step: 4,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!loan) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'OTP verified',
      data: loan 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update PIN (Step 4 - Final)
router.put('/update-pin/:id', async (req, res) => {
  try {
    const { pin } = req.body;
    
    const loan = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { 
        pin, 
        step: 5,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!loan) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'PIN verified, application completed',
      data: loan 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get application by ID
router.get('/:id', async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const loans = await LoanApplication.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;