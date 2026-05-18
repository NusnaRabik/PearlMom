import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, ChevronRight, Eye, Plus, X, Calendar, User, Droplet, Phone, MapPin, Activity, Heart } from 'lucide-react';
import MotherSearchBar from '../../components/provider/MotherSearchBar';

const MothersListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedMother, setSelectedMother] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);

  // New Mother Form
  const [newMother, setNewMother] = useState({
    motherId: '',
    fullName: '',
    age: '',
    edd: '',
    bloodGroup: ''
  });

  const [mothers, setMothers] = useState([
    {
      id: 'MOT-2024-001',
      name: 'Elena Rodriguez',
      pregnancy: '2nd Pregnancy',
      age: 32,
      edd: 'Oct 12, 2024',
      status: 'High-risk',
      statusType: 'high-risk',
      lastVisit: '2 days ago',
      color: 'red',
      bloodGroup: 'A+',
      phone: '+94 77 123 4567',
      address: '42, Galle Road, Colombo 03',
      weeks: 24,
      bp: '120/80',
      weight: '68.5 kg',
      fhr: '145 bpm'
    },
    {
      id: 'MOT-2024-045',
      name: 'Sarah Mitchell',
      pregnancy: '1st Pregnancy',
      age: 28,
      edd: 'Nov 03, 2024',
      status: 'Normal',
      statusType: 'normal',
      lastVisit: '1 week ago',
      color: 'green',
      bloodGroup: 'O+',
      phone: '+94 71 234 5678',
      address: '15, Kandy Road, Kandy',
      weeks: 28,
      bp: '118/75',
      weight: '72.3 kg',
      fhr: '152 bpm'
    },
    {
      id: 'MOT-2024-089',
      name: 'Amara Okafor',
      pregnancy: 'Postpartum (Week 4)',
      age: 31,
      edd: '—',
      status: 'Postnatal',
      statusType: 'postnatal',
      lastVisit: 'Yesterday',
      color: 'blue',
      bloodGroup: 'B+',
      phone: '+94 76 345 6789',
      address: '8, Main Street, Jaffna',
      weeks: 4,
      bp: '122/82',
      weight: '65.0 kg',
      fhr: '—'
    },
    {
      id: 'MOT-2024-112',
      name: 'Isabella Chen',
      pregnancy: 'Gestational Diabetes',
      age: 35,
      edd: 'Dec 18, 2024',
      status: 'High-risk',
      statusType: 'high-risk',
      lastVisit: '3 days ago',
      color: 'red',
      bloodGroup: 'AB-',
      phone: '+94 70 456 7890',
      address: '25, Sea Street, Colombo 11',
      weeks: 32,
      bp: '135/88',
      weight: '75.8 kg',
      fhr: '140 bpm'
    },
    {
      id: 'MOT-2024-156',
      name: 'Maria Santos',
      pregnancy: '3rd Pregnancy',
      age: 29,
      edd: 'Jan 05, 2025',
      status: 'Normal',
      statusType: 'normal',
      lastVisit: '5 days ago',
      color: 'green',
      bloodGroup: 'A-',
      phone: '+94 77 567 8901',
      address: '12, Hill Street, Nuwara Eliya',
      weeks: 20,
      bp: '115/72',
      weight: '63.2 kg',
      fhr: '148 bpm'
    },
    {
      id: 'MOT-2024-203',
      name: 'Jennifer Adams',
      pregnancy: '1st Pregnancy',
      age: 26,
      edd: 'Feb 14, 2025',
      status: 'High-risk',
      statusType: 'high-risk',
      lastVisit: '1 day ago',
      color: 'red',
      bloodGroup: 'O-',
      phone: '+94 71 678 9012',
      address: '5, Temple Road, Galle',
      weeks: 18,
      bp: '130/85',
      weight: '58.6 kg',
      fhr: '155 bpm'
    }
  ]);

  const filteredMothers = useMemo(() => {
    return mothers.filter((mother) => {
      const searchMatch = 
        searchTerm === '' || 
        mother.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mother.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mother.pregnancy.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = 
        filterStatus === 'all' || 
        mother.statusType === filterStatus;

      return searchMatch && statusMatch;
    });
  }, [searchTerm, filterStatus, mothers]);

  const highRiskOverdue = mothers.filter(
    m => m.statusType === 'high-risk' && 
    (m.lastVisit.includes('10') || m.lastVisit.includes('week'))
  ).length;

  const handleAddMother = () => {
    if (!newMother.motherId || !newMother.fullName || !newMother.age) return;

    const mother = {
      id: newMother.motherId,
      name: newMother.fullName,
      pregnancy: 'New Registration',
      age: parseInt(newMother.age),
      edd: newMother.edd || '—',
      status: 'Normal',
      statusType: 'normal',
      lastVisit: 'Never',
      color: 'green',
      bloodGroup: newMother.bloodGroup || 'N/A',
      phone: 'N/A',
      address: 'N/A',
      weeks: 0,
      bp: 'N/A',
      weight: 'N/A',
      fhr: 'N/A'
    };

    setMothers([mother, ...mothers]);
    setAddSuccess(true);

    setTimeout(() => {
      setShowAddModal(false);
      setAddSuccess(false);
      setNewMother({
        motherId: '',
        fullName: '',
        age: '',
        edd: '',
        bloodGroup: ''
      });
    }, 1500);
  };

  const handleViewProfile = (mother) => {
    setSelectedMother(mother);
    setShowProfileModal(true);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Patients</h1>
          <p className="text-gray-500 mt-1">Manage and monitor the health progress of mothers under your clinical care.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors whitespace-nowrap flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add New Mother</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <MotherSearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by Mother ID, Name, or Pregnancy details"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="high-risk">High Risk</option>
            <option value="normal">Normal</option>
            <option value="postnatal">Postnatal</option>
          </select>
        </div>
        
        {(searchTerm || filterStatus !== 'all') && (
          <div className="mt-3 text-sm text-gray-500">
            Found {filteredMothers.length} {filteredMothers.length === 1 ? 'patient' : 'patients'}
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {filterStatus !== 'all' && <span> with status "{filterStatus}"</span>}
          </div>
        )}
      </div>

      {/* Clinical Priority Alert */}
      {highRiskOverdue > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Clinical Priority Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">
                There are {highRiskOverdue} high-risk {highRiskOverdue === 1 ? 'mother' : 'mothers'} whose last visit was over 10 days ago. 
                It is recommended to schedule an immediate check-up or telehealth call.
              </p>
            </div>
            <button className="text-sm font-medium text-yellow-600 hover:text-yellow-800 whitespace-nowrap transition-colors">
              Review High-Risk List →
            </button>
          </div>
        </div>
      )}

      {/* Patient Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mother ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EDD</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMothers.length > 0 ? (
                filteredMothers.map((mother) => (
                  <tr key={mother.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">{mother.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{mother.name}</p>
                        <p className="text-xs text-gray-500">{mother.pregnancy}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{mother.age}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{mother.edd}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        mother.color === 'red' ? 'bg-red-100 text-red-800' :
                        mother.color === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {mother.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          mother.lastVisit.includes('day') && !mother.lastVisit.includes('days') ? 'bg-green-400' :
                          mother.lastVisit.includes('Today') || mother.lastVisit.includes('Yesterday') ? 'bg-green-400' :
                          mother.lastVisit.includes('week') ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`}></span>
                        <span className="text-sm text-gray-500">{mother.lastVisit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleViewProfile(mother)}
                        className="text-pink-600 hover:text-pink-900 font-medium text-sm transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Search className="mx-auto text-gray-300 mb-3" size={48} />
                    <p className="text-gray-500 text-sm">No patients found matching your search criteria</p>
                    {(searchTerm || filterStatus !== 'all') && (
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilterStatus('all');
                        }}
                        className="mt-3 text-pink-600 hover:text-pink-700 text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredMothers.length} of {mothers.length} patients
          </p>
          {filteredMothers.length > 0 && (
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-pink-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Next</button>
            </div>
          )}
        </div>
      </div>

      {/* Add New Mother Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <User className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Mother</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mother Added Successfully!</h3>
                  <p className="text-sm text-gray-500">The new mother has been registered.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mother ID *</label>
                    <input
                      type="text"
                      placeholder="e.g., MOT-2024-001"
                      value={newMother.motherId}
                      onChange={(e) => setNewMother({...newMother, motherId: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Elena Rodriguez"
                      value={newMother.fullName}
                      onChange={(e) => setNewMother({...newMother, fullName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      placeholder="e.g., 28"
                      value={newMother.age}
                      onChange={(e) => setNewMother({...newMother, age: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Due Date (EDD)</label>
                    <input
                      type="date"
                      value={newMother.edd}
                      onChange={(e) => setNewMother({...newMother, edd: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    <select
                      value={newMother.bloodGroup}
                      onChange={(e) => setNewMother({...newMother, bloodGroup: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {!addSuccess && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMother}
                  disabled={!newMother.motherId || !newMother.fullName || !newMother.age}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                    !newMother.motherId || !newMother.fullName || !newMother.age
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700'
                  }`}
                >
                  Add Mother
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && selectedMother && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-semibold text-gray-900">Mother Profile</h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-semibold text-pink-600">
                    {selectedMother.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedMother.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMother.id}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    selectedMother.color === 'red' ? 'bg-red-100 text-red-800' :
                    selectedMother.color === 'green' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedMother.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">EDD</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedMother.edd}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Droplet size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Blood Group</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedMother.bloodGroup}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <User size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Age</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedMother.age} years</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Pregnancy Week</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedMother.weeks} Weeks</p>
                </div>
              </div>

              {/* Vitals */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Vitals</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-pink-50 rounded-lg text-center border border-pink-100">
                    <p className="text-xs text-gray-500 mb-1">BP</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedMother.bp}</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg text-center border border-pink-100">
                    <p className="text-xs text-gray-500 mb-1">Weight</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedMother.weight}</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg text-center border border-pink-100">
                    <p className="text-xs text-gray-500 mb-1">FHR</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedMother.fhr}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMother.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMother.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Visit</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMother.lastVisit}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MothersListPage;