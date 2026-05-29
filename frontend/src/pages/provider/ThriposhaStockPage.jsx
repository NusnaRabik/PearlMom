import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Package, TrendingUp, AlertTriangle, Plus, X, 
  Loader, Calendar, Building, FileText, Settings,
  CheckCircle, AlertCircle, Search
} from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';

const ThriposhaStockPage = () => {
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState(null);
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ low_stock_threshold: 200, critical_stock_threshold: 50 });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newBatch, setNewBatch] = useState({
    batch_number: '',
    packets_received: '',
    received_date: '',
    expiry_date: '',
    supplier: '',
    batch_notes: ''
  });

  useEffect(() => {
    fetchStockData();
    fetchSettings();
  }, []);

  useEffect(() => {
    // Filter batches when search term changes
    if (searchTerm.trim() === '') {
      setFilteredBatches(batches);
    } else {
      const filtered = batches.filter(batch => 
        batch.batch_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBatches(filtered);
    }
  }, [searchTerm, batches]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock/thriposha');
      if (response.data.success) {
        setStockData(response.data.data.summary);
        setBatches(response.data.data.batches);
        setFilteredBatches(response.data.data.batches);
      }
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await api.get('/stock/thriposha/settings');
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/stock/thriposha/batch', newBatch);
      if (response.data.success) {
        setSuccessMessage('Stock batch added successfully!');
        setShowAddBatch(false);
        setNewBatch({
          batch_number: '',
          packets_received: '',
          received_date: '',
          expiry_date: '',
          supplier: '',
          batch_notes: ''
        });
        fetchStockData();
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding batch:', error);
      alert(error.response?.data?.message || 'Failed to add batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/stock/thriposha/settings', settings);
      setSuccessMessage('Settings updated successfully!');
      setShowSettings(false);
      fetchStockData();
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  const remainingStock = stockData?.remaining_stock || 0;
  const isLowStock = stockData?.is_low_stock || false;

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 animate-slide-in-right">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="text-green-700 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thriposha Stock Management</h1>
          <p className="text-gray-500 mt-1">Track inventory, manage batches, and monitor stock levels</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowSettings(true)} variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </Button>
          <Button onClick={() => setShowAddBatch(true)} className="bg-pink-600 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Stock Batch
          </Button>
        </div>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Total Received</p>
              <Package className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stockData?.total_received || 0}</p>
            <p className="text-sm text-gray-500 mt-1">packets received</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Distributed</p>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stockData?.total_distributed || 0}</p>
            <p className="text-sm text-gray-500 mt-1">packets distributed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Remaining Stock</p>
              <Package className="h-5 w-5 text-pink-500" />
            </div>
            <p className={`text-3xl font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
              {remainingStock}
            </p>
            <p className="text-sm text-gray-500 mt-1">packets available</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Damaged/Expired</p>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {(stockData?.total_damaged || 0) + (stockData?.total_expired || 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">packets lost</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {isLowStock && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Low Stock Alert!</p>
              <p className="text-sm text-red-600">
                Remaining stock ({remainingStock} packets) is below threshold ({stockData?.low_stock_threshold || 200} packets).
                Please restock soon.
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddBatch(true)} className="bg-red-600 text-white hover:bg-red-700">
            Restock Now
          </Button>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Batch Number..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
        {searchTerm && filteredBatches.length === 0 && (
          <p className="text-sm text-gray-500 mt-3 text-center">
            No batches found matching "{searchTerm}"
          </p>
        )}
      </div>

      {/* Batches Table - Full Width */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">Stock Batches</h3>
            <Badge className="bg-pink-100 text-pink-700">
              {filteredBatches.length} Batches
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distributed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBatches.map((batch) => {
                  const remaining = batch.packets_received - batch.packets_distributed - batch.packets_damaged - batch.packets_expired;
                  const isExpiring = new Date(batch.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  return (
                    <tr key={batch.stock_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{batch.batch_number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{batch.packets_received}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{batch.packets_distributed}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{remaining}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(batch.expiry_date, 'short')}
                        {isExpiring && (
                          <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">Expiring Soon</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={batch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {batch.status === 'active' ? 'Active' : batch.status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
                {filteredBatches.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No stock batches found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Batch Modal */}
      {showAddBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Add Stock Batch</h2>
              <button onClick={() => setShowAddBatch(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBatch} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
                <input
                  type="text"
                  required
                  value={newBatch.batch_number}
                  onChange={(e) => setNewBatch({...newBatch, batch_number: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="e.g., TH-2026-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Packets Received *</label>
                <input
                  type="number"
                  required
                  value={newBatch.packets_received}
                  onChange={(e) => setNewBatch({...newBatch, packets_received: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Received Date *</label>
                  <input
                    type="date"
                    required
                    value={newBatch.received_date}
                    onChange={(e) => setNewBatch({...newBatch, received_date: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={newBatch.expiry_date}
                    onChange={(e) => setNewBatch({...newBatch, expiry_date: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <input
                  type="text"
                  value={newBatch.supplier}
                  onChange={(e) => setNewBatch({...newBatch, supplier: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={newBatch.batch_notes}
                  onChange={(e) => setNewBatch({...newBatch, batch_notes: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowAddBatch(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50">
                  {submitting ? 'Adding...' : 'Add Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Stock Alert Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdateSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  value={settings.low_stock_threshold}
                  onChange={(e) => setSettings({...settings, low_stock_threshold: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this number</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Critical Stock Threshold</label>
                <input
                  type="number"
                  value={settings.critical_stock_threshold}
                  onChange={(e) => setSettings({...settings, critical_stock_threshold: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Email</label>
                <input
                  type="email"
                  value={settings.alert_email || ''}
                  onChange={(e) => setSettings({...settings, alert_email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="admin@pearlmom.lk"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowSettings(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ThriposhaStockPage;