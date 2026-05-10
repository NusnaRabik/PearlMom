// frontend/src/pages/provider/ClinicVisitPage.jsx
import React, { useState } from 'react';
import { Heart, Activity, FlaskConical, BookOpen, Calendar, ChevronDown } from 'lucide-react';
import VisitForm from '../../components/provider/VisitForm';

const ClinicVisitPage = () => {
  const [selectedPatient, setSelectedPatient] = useState({
    name: 'Elena Rodriguez',
    id: '#PM-8829',
    weeks: 24,
    bloodType: 'A Pos',
    edd: 'Oct 12, 2024'
  });

  const vitals = {
    bp: '120/80',
    weight: '68.5',
    fetalHeartRate: '145'
  };

  const labTests = {
    hbLevel: '12.4',
    hbRange: '11-15',
    urineProtein: 'Normal',
    urineSugar: 'Normal'
  };

  const healthEducation = [
    { id: 1, title: 'Nutrition & Supplements', completed: true },
    { id: 2, title: 'Breastfeeding Preparation', completed: false },
    { id: 3, title: 'Signs of Labor', completed: true },
    { id: 4, title: 'Warning Signs (PIH/Eclampsia)', completed: true }
  ];

  const visitHistory = [
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
    },
    {
      date: 'April 02, 2024',
      bp: '115/70',
      weight: '64kg',
      fhr: '155',
      notes: 'Transition to prenatal diet. Patient educated on morning sickness.'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinic Visit Management</h1>
          <p className="text-gray-500 mt-1">Patient Record &gt; Current Visit</p>
        </div>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
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
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">BLOOD TYPE</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.bloodType}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">EDD</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.edd}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vitals Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="mr-2 text-pink-500" size={20} />
              Vitals
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">BP (mmHg)</p>
                <p className="text-xl font-bold text-gray-900">{vitals.bp}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Weight (kg)</p>
                <p className="text-xl font-bold text-gray-900">{vitals.weight}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Fetal Heart Rate (bpm)</p>
                <p className="text-xl font-bold text-gray-900">{vitals.fetalHeartRate}</p>
              </div>
            </div>
          </div>

          {/* Lab Tests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FlaskConical className="mr-2 text-purple-500" size={20} />
              Lab Tests
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hb Level (g/dL)</p>
                <p className="text-lg font-semibold text-gray-900">{labTests.hbLevel}</p>
                <p className="text-xs text-gray-400">Normal Range: {labTests.hbRange}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Urine Test (Protein/Sugar)</p>
                <p className="text-lg font-semibold text-gray-900">{labTests.urineProtein}</p>
                <p className="text-xs text-gray-400">Sugar: {labTests.urineSugar}</p>
              </div>
            </div>
          </div>

          {/* Visit Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Current Visit Notes</h3>
            <VisitForm patientId={selectedPatient.id} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Health Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <BookOpen className="mr-2 text-blue-500" size={20} />
              Health Education
            </h3>
            <div className="space-y-3">
              {healthEducation.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.title}</span>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Visit */}
          <div className="bg-white rounded-lg shadow p-6">
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
              <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700">
                Schedule Visit
              </button>
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Visit History</h3>
            <div className="space-y-4">
              {visitHistory.map((visit, index) => (
                <div key={index} className="border-l-2 border-pink-200 pl-4">
                  <p className="text-sm font-semibold text-gray-900">{visit.date}</p>
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    <p>BP: {visit.bp} | W: {visit.weight} | FHR: {visit.fhr}</p>
                    <p className="text-gray-600 italic">"{visit.notes}"</p>
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
    </div>
  );
};

export default ClinicVisitPage;