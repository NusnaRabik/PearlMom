// frontend/src/pages/provider/MothersListPage.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, ChevronRight, Eye } from 'lucide-react';
import MotherSearchBar from '../../components/provider/MotherSearchBar';

const MothersListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mothers = [
    {
      id: 'MOT-2024-001',
      name: 'Elena Rodriguez',
      pregnancy: '2nd Pregnancy',
      age: 32,
      edd: 'Oct 12, 2024',
      status: 'High-risk',
      statusType: 'high-risk',
      lastVisit: '2 days ago',
      color: 'red'
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
      color: 'green'
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
      color: 'blue'
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
      color: 'red'
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
      color: 'green'
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
      color: 'red'
    }
  ];

  // Filter and search logic
  const filteredMothers = useMemo(() => {
    return mothers.filter((mother) => {
      // Search filter
      const searchMatch = 
        searchTerm === '' || 
        mother.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mother.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mother.pregnancy.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const statusMatch = 
        filterStatus === 'all' || 
        mother.statusType === filterStatus;

      return searchMatch && statusMatch;
    });
  }, [searchTerm, filterStatus]);

  // Count high-risk mothers with overdue visits
  const highRiskOverdue = mothers.filter(
    m => m.statusType === 'high-risk' && 
    (m.lastVisit.includes('10') || m.lastVisit.includes('week'))
  ).length;

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assigned Patients</h1>
          <p className="text-gray-500 mt-1">Manage and monitor the health progress of mothers under your clinical care.</p>
        </div>
        <button className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors whitespace-nowrap">
          Add New Patient
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
        
        {/* Search Results Count */}
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
                      <button className="text-pink-600 hover:text-pink-900 font-medium text-sm transition-colors">
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
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-pink-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MothersListPage;