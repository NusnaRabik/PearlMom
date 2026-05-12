// frontend/src/pages/provider/ClinicVisitPage.jsx
import React, { useState } from 'react';
import { 
  Heart, FlaskConical, BookOpen, Calendar, ChevronDown, 
  Search, User, Clock, ArrowRight, AlertCircle, CheckCircle2, Users
} from 'lucide-react';
import VisitForm from '../../components/provider/VisitForm';

const ClinicVisitPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Sample patients database with last visit and next schedule
  const patients = [
    {
      id: '#PM-8829',
      name: 'Elena Rodriguez',
      weeks: 24,
      bloodType: 'A Pos',
      edd: 'Oct 12, 2024',
      lastVisit: 'June 04, 2024',
      nextSchedule: 'July 04, 2024',
      visitStatus: 'upcoming',
      vitals: {
        bp: '120/80',
        weight: '68.5',
        fetalHeartRate: '145'
      },
      labTests: {
        hbLevel: '12.4',
        hbRange: '11-15',
        urineProtein: 'Normal',
        urineSugar: 'Normal'
      },
      healthEducation: [
        { id: 1, title: 'Nutrition & Supplements', completed: true },
        { id: 2, title: 'Breastfeeding Preparation', completed: false },
        { id: 3, title: 'Signs of Labor', completed: true },
        { id: 4, title: 'Warning Signs (PIH/Eclampsia)', completed: true }
      ],
      visitHistory: [
        {
          date: 'June 04, 2024',
          bp: '118/78',
          weight: '67kg',
          fhr: '142',
          notes: 'Patient reporting mild fatigue. Supplements adjusted. Heart rate stable.'
        },
        {
          date: 'May 07, 2024',
          bp: '110/75',
          weight: '65kg',
          fhr: '148',
          notes: 'Initial second trimester screen. Normal ultrasound results.'
        }
      ]
    },
    {
      id: '#PM-9045',
      name: 'Sarah Mitchell',
      weeks: 28,
      bloodType: 'O Neg',
      edd: 'Nov 03, 2024',
      lastVisit: 'July 10, 2024',
      nextSchedule: 'July 24, 2024',
      visitStatus: 'upcoming',
      vitals: {
        bp: '118/75',
        weight: '72.3',
        fetalHeartRate: '152'
      },
      labTests: {
        hbLevel: '11.8',
        hbRange: '11-15',
        urineProtein: 'Normal',
        urineSugar: 'Normal'
      },
      healthEducation: [
        { id: 1, title: 'Nutrition & Supplements', completed: true },
        { id: 2, title: 'Breastfeeding Preparation', completed: true },
        { id: 3, title: 'Signs of Labor', completed: false },
        { id: 4, title: 'Warning Signs (PIH/Eclampsia)', completed: true }
      ],
      visitHistory: [
        {
          date: 'July 10, 2024',
          bp: '116/72',
          weight: '71kg',
          fhr: '150',
          notes: 'Routine third trimester check. All parameters normal.'
        }
      ]
    },
    {
      id: '#PM-9089',
      name: 'Amara Okafor',
      weeks: 4,
      bloodType: 'B Pos',
      edd: '—',
      lastVisit: 'Yesterday',
      nextSchedule: 'Next Week',
      visitStatus: 'recent',
      vitals: {
        bp: '122/82',
        weight: '65.0',
        fetalHeartRate: '—'
      },
      labTests: {
        hbLevel: '13.1',
        hbRange: '11-15',
        urineProtein: 'Normal',
        urineSugar: 'Normal'
      },
      healthEducation: [
        { id: 1, title: 'Postpartum Nutrition', completed: true },
        { id: 2, title: 'Breastfeeding Support', completed: true },
        { id: 3, title: 'Postpartum Exercise', completed: false },
        { id: 4, title: 'Mental Health Check', completed: true }
      ],
      visitHistory: [
        {
          date: 'Yesterday',
          bp: '124/84',
          weight: '65.5kg',
          fhr: '—',
          notes: 'Postpartum check. Recovery progressing well.'
        }
      ]
    }
  ];

  const handleSearch = () => {
    setHasSearched(true);
    if (searchTerm.trim()) {
      const found = patients.find(
        p => 
          p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSelectedPatient(found || null);
    } else {
      setSelectedPatient(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedPatient(null);
    setHasSearched(false);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setHasSearched(true);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Visit Management</h1>
          <p className="text-gray-500 mt-1">Patient Record &gt; Current Visit</p>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="max-w-3xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Search Patient by ID or Name
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter Patient ID (e.g., #PM-8829) or Name"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm 
                         focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                         placeholder-gray-400"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg text-sm font-medium 
                       hover:bg-pink-700 transition-colors whitespace-nowrap"
            >
              Search Patient
            </button>
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium 
                         text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* No Patient Selected - Show Overview */}
      {!selectedPatient && !hasSearched && (
        <>
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Today's Visits</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <CheckCircle2 className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">1</p>
                </div>
                <AlertCircle className="text-red-500" size={24} />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">8</p>
                </div>
                <Calendar className="text-blue-500" size={24} />
              </div>
            </div>
          </div>

          {/* All Mothers Overview Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="mr-2 text-pink-500" size={20} />
                All Assigned Mothers - Visit Overview
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Schedule</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-pink-600">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                            <p className="text-xs text-gray-500">{patient.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{patient.weeks}w</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{patient.lastVisit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{patient.nextSchedule}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          patient.visitStatus === 'recent' 
                            ? 'bg-green-100 text-green-800'
                            : patient.visitStatus === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {patient.visitStatus === 'recent' ? 'Recent' : 
                           patient.visitStatus === 'overdue' ? 'Overdue' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handlePatientSelect(patient)}
                          className="text-pink-600 hover:text-pink-900 font-medium text-sm flex items-center space-x-1 transition-colors"
                        >
                          <span>Start Visit</span>
                          <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Patients Quick Access */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Quick Access - Recent Patients
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {patients.slice(0, 3).map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg 
                           hover:border-pink-300 hover:bg-pink-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-pink-200 transition-colors">
                    <span className="text-sm font-semibold text-pink-600">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{patient.name}</p>
                    <p className="text-xs text-gray-500">{patient.id} • {patient.weeks} Weeks</p>
                    <p className="text-xs text-gray-400 mt-1">Last: {patient.lastVisit}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-pink-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* No Patient Found */}
      {!selectedPatient && hasSearched && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Found</h3>
          <p className="text-gray-500 mb-4">
            No patient matches "{searchTerm}". Please try a different Patient ID or Name.
          </p>
          <button
            onClick={handleClearSearch}
            className="text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            Clear Search & View All Patients
          </button>
        </div>
      )}

      {/* Patient Found - Show Details */}
      {selectedPatient && (
        <>
          {/* Patient Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-pink-600">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                  <p className="text-sm text-gray-500">
                    ID: {selectedPatient.id} | {selectedPatient.weeks} Weeks Pregnant
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Blood Type</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedPatient.bloodType}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">EDD</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedPatient.edd}</p>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ← Back to All Patients
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Vitals & Labs */}
            <div className="lg:col-span-2 space-y-6">
              {/* Vitals */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Heart className="mr-2 text-pink-500" size={20} />
                  Vitals
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">BP (mmHg)</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.bp}</p>
                    <p className="text-xs text-gray-400 mt-1">Normal: 120/80</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Weight (kg)</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.weight}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Fetal HR (bpm)</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedPatient.vitals.fetalHeartRate}</p>
                    <p className="text-xs text-gray-400 mt-1">Normal: 120-160</p>
                  </div>
                </div>
              </div>

              {/* Lab Tests */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FlaskConical className="mr-2 text-purple-500" size={20} />
                  Lab Tests
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Hb Level (g/dL)</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{selectedPatient.labTests.hbLevel}</p>
                      <p className="text-xs text-gray-400">Range: {selectedPatient.labTests.hbRange}</p>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(parseFloat(selectedPatient.labTests.hbLevel) / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">Urine Test</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Protein:</span>
                        <span className={`text-sm font-medium ${
                          selectedPatient.labTests.urineProtein === 'Normal' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedPatient.labTests.urineProtein}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sugar:</span>
                        <span className={`text-sm font-medium ${
                          selectedPatient.labTests.urineSugar === 'Normal' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedPatient.labTests.urineSugar}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visit Form */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Current Visit Notes</h3>
                <VisitForm patientId={selectedPatient.id} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Health Education */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BookOpen className="mr-2 text-blue-500" size={20} />
                  Health Education
                </h3>
                <div className="space-y-3">
                  {selectedPatient.healthEducation.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{item.title}</span>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {item.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Visit */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 text-green-500" size={20} />
                  Next Scheduled Visit
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
                    Schedule Visit
                  </button>
                </div>
              </div>

              {/* Visit History */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Visit History</h3>
                <div className="space-y-4">
                  {selectedPatient.visitHistory.map((visit, index) => (
                    <div key={index} className="border-l-2 border-pink-200 pl-4">
                      <p className="text-sm font-semibold text-gray-900">{visit.date}</p>
                      <div className="mt-2 text-xs text-gray-500 space-y-1">
                        <div className="flex space-x-3">
                          <span>BP: {visit.bp}</span>
                          <span>W: {visit.weight}</span>
                          <span>FHR: {visit.fhr}</span>
                        </div>
                        <p className="text-gray-600 italic mt-1">"{visit.notes}"</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center">
                  View Full Medical History
                  <ChevronDown size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicVisitPage;