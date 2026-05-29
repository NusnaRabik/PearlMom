import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Syringe, TrendingUp, AlertTriangle, Plus, X, 
  Loader, Calendar, Building, FileText, Thermometer,
  CheckCircle, AlertCircle, Package, Droplet, Search
} from 'lucide-react';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';

const VaccineStockPage = () => {
  const [loading, setLoading] = useState(true);
  const [stockSummary, setStockSummary] = useState([]);
  const [allBatches, setAllBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [newBatch, setNewBatch] = useState({
    vaccine_name: '',
    vaccine_type: '',
    batch_number: '',
    manufacturer: '',
    doses_received: '',
    received_date: '',
    expiry_date: '',
    storage_temperature: '',
    supplier: '',
    lot_number: '',
    notes: ''
  });

  // Specific vaccines to display in stats cards (only when no search)
  const defaultDisplayVaccines = [
    'Polio Vaccine (OPV)',
    'Rubella Vaccine',
    'BCG Vaccine',
    'Tetanus Toxoid (TT1)'
  ];

  const vaccineTypes = [
    { value: 'tetanus', label: 'Tetanus Toxoid (TT)' },
    { value: 'covid', label: 'COVID-19 Vaccine' },
    { value: 'influenza', label: 'Influenza Vaccine' },
    { value: 'tdap', label: 'Tdap Vaccine' },
    { value: 'hepatitis_b', label: 'Hepatitis B Vaccine' },
    { value: 'rubella', label: 'Rubella Vaccine' },
    { value: 'bcg', label: 'BCG Vaccine' },
    { value: 'polio', label: 'Polio Vaccine' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchStockData();
  }, []);

  useEffect(() => {
    // Filter both stats and batches when search term changes
    if (searchTerm.trim() === '') {
      // No search: show only default 4 vaccines in stats, all batches in table
      const defaultSummary = stockSummary.filter(vaccine => 
        defaultDisplayVaccines.includes(vaccine.vaccine_name)
      );
      setFilteredSummary(defaultSummary);
      setFilteredBatches(allBatches);
    } else {
      // With search: show only matching vaccines in stats AND matching batches in table
      const matchedBatches = allBatches.filter(batch => 
        batch.vaccine_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      // Get unique vaccine names from matched batches
      const matchedVaccineNames = [...new Set(matchedBatches.map(batch => batch.vaccine_name))];
      
      // Filter summary to only show vaccines that have matching batches
      const matchedSummary = stockSummary.filter(vaccine => 
        matchedVaccineNames.includes(vaccine.vaccine_name)
      );
      
      setFilteredSummary(matchedSummary);
      setFilteredBatches(matchedBatches);
    }
  }, [searchTerm, stockSummary, allBatches]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stock/vaccines');
      if (response.data.success) {
        setStockSummary(response.data.data.summary);
        setAllBatches(response.data.data.all_batches);
        
        // Initialize with default view
        const defaultSummary = response.data.data.summary.filter(vaccine => 
          defaultDisplayVaccines.includes(vaccine.vaccine_name)
        );
        setFilteredSummary(defaultSummary);
        setFilteredBatches(response.data.data.all_batches);
      }
    } catch (error) {
      console.error('Error fetching vaccine stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post('/stock/vaccines/batch', newBatch);
      if (response.data.success) {
        setSuccessMessage('Vaccine batch added successfully!');
        setShowAddBatch(false);
        setNewBatch({
          vaccine_name: '',
          vaccine_type: '',
          batch_number: '',
          manufacturer: '',
          doses_received: '',
          received_date: '',
          expiry_date: '',
          storage_temperature: '',
          supplier: '',
          lot_number: '',
          notes: ''
        });
        fetchStockData();
        
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

  const handleRecordUsage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dosesUsed = parseInt(e.target.doses_used.value);
      const response = await api.post('/stock/vaccines/use', {
        batch_id: selectedBatch.vaccine_stock_id,
        doses_used: dosesUsed
      });
      if (response.data.success) {
        setSuccessMessage('Usage recorded successfully!');
        setShowUsageModal(false);
        setSelectedBatch(null);
        fetchStockData();
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error recording usage:', error);
      alert('Failed to record usage');
    } finally {
      setSubmitting(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getVaccineIcon = (type) => {
    switch(type) {
      case 'tetanus': return <Droplet className="h-5 w-5" />;
      case 'covid': return <AlertCircle className="h-5 w-5" />;
      default: return <Syringe className="h-5 w-5" />;
    }
  };

  const getStatusColor = (remaining, total) => {
    const percentage = (remaining / total) * 100;
    if (percentage < 10) return 'text-red-600';
    if (percentage < 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
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
          <h1 className="text-3xl font-bold text-gray-900">Vaccine Stock Management</h1>
          <p className="text-gray-500 mt-1">Track vaccine inventory, manage batches, and monitor cold storage</p>
        </div>
        <Button onClick={() => setShowAddBatch(true)} className="bg-pink-600 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Batch
        </Button>
      </div>

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
              placeholder="Search by Vaccine Name..."
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
            No vaccines found matching "{searchTerm}"
          </p>
        )}
      </div>

      {/* Vaccine Summary Cards - Shows ONLY search results when searching */}
      {filteredSummary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredSummary.map((vaccine) => {
            const remaining = vaccine.remaining;
            const total = vaccine.total_received;
            return (
              <Card key={vaccine.vaccine_name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getVaccineIcon(vaccine.vaccine_type)}
                      <h3 className="font-semibold text-gray-900 text-sm">{vaccine.vaccine_name}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">{vaccine.vaccine_type}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available:</span>
                      <span className={`font-bold ${getStatusColor(remaining, total)}`}>{remaining} doses</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Received:</span>
                      <span>{total} doses</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Used:</span>
                      <span>{vaccine.total_used} doses</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${(remaining / total) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        searchTerm && (
          <div className="text-center py-8 bg-white rounded-xl">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No vaccine statistics found for "{searchTerm}"</p>
          </div>
        )
      )}

      {/* All Batches Table - Shows filtered results */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {searchTerm ? `Search Results for "${searchTerm}"` : 'All Stock Batches'}
            </h3>
            <Badge className="bg-pink-100 text-pink-700">
              {filteredBatches.length} Batches
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vaccine</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Number</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Storage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBatches.map((batch) => {
                  const remaining = batch.doses_received - batch.doses_used - batch.doses_damaged - batch.doses_expired;
                  const isExpiring = new Date(batch.expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  return (
                    <tr key={batch.vaccine_stock_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{batch.vaccine_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{batch.batch_number}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{batch.doses_received}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{batch.doses_used}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{remaining}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(batch.expiry_date, 'short')}
                        {isExpiring && <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">Expiring Soon</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-3 w-3" />
                          <span className="text-sm">{batch.storage_temperature || 'N/A'}°C</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedBatch(batch);
                            setShowUsageModal(true);
                          }}
                          className="text-pink-600"
                        >
                          Record Usage
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {filteredBatches.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                      No stock batches found for "{searchTerm}"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Add Vaccine Batch</h2>
              <button onClick={() => setShowAddBatch(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddBatch} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Name *</label>
                  <input
                    type="text"
                    required
                    value={newBatch.vaccine_name}
                    onChange={(e) => setNewBatch({...newBatch, vaccine_name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="e.g., Tetanus Toxoid"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaccine Type *</label>
                  <select
                    required
                    value={newBatch.vaccine_type}
                    onChange={(e) => setNewBatch({...newBatch, vaccine_type: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  >
                    <option value="">Select Type</option>
                    {vaccineTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={newBatch.batch_number}
                    onChange={(e) => setNewBatch({...newBatch, batch_number: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={newBatch.manufacturer}
                    onChange={(e) => setNewBatch({...newBatch, manufacturer: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doses Received *</label>
                <input
                  type="number"
                  required
                  value={newBatch.doses_received}
                  onChange={(e) => setNewBatch({...newBatch, doses_received: parseInt(e.target.value)})}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatch.storage_temperature}
                    onChange={(e) => setNewBatch({...newBatch, storage_temperature: parseFloat(e.target.value)})}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="2-8"
                  />
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lot Number</label>
                <input
                  type="text"
                  value={newBatch.lot_number}
                  onChange={(e) => setNewBatch({...newBatch, lot_number: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows="2"
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({...newBatch, notes: e.target.value})}
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

      {/* Record Usage Modal */}
      {showUsageModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Record Vaccine Usage</h2>
              <button onClick={() => setShowUsageModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRecordUsage} className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Vaccine: <strong>{selectedBatch.vaccine_name}</strong></p>
                <p className="text-sm text-gray-600">Batch: <strong>{selectedBatch.batch_number}</strong></p>
                <p className="text-sm text-gray-600">Remaining Doses: <strong>{selectedBatch.doses_received - selectedBatch.doses_used - selectedBatch.doses_damaged - selectedBatch.doses_expired}</strong></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doses Used *</label>
                <input
                  type="number"
                  name="doses_used"
                  required
                  min="1"
                  max={selectedBatch.doses_received - selectedBatch.doses_used}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowUsageModal(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50">
                  {submitting ? 'Recording...' : 'Record Usage'}
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

export default VaccineStockPage;