// frontend/src/hooks/useMother.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for mother-related data and operations
 */
export const useMother = (motherId = null) => {
  const [motherData, setMotherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [labReports, setLabReports] = useState([]);

  // Mock mother data
  const mockMotherData = {
    id: 'MTH-2024-001',
    fullName: 'Elena Richardson',
    age: 28,
    bloodGroup: 'O+',
    edd: 'Feb 14, 2025',
    currentWeek: 28,
    trimester: 3,
    status: 'Low Risk',
    weight: 68.5,
    height: 165,
    bmi: 25.2,
    phone: '+94 77 123 4567',
    email: 'elena.r@example.com',
    address: '42, Galle Road, Colombo 03',
    gravida: 2,
    para: 1,
    lastVisit: 'Oct 28, 2024',
    nextAppointment: 'Nov 24, 2024'
  };

  // Fetch mother data
  const fetchMotherData = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In real app, fetch from API
      const data = mockMotherData;
      setMotherData(data);
      
      // Fetch related data
      fetchAppointments(id);
      fetchVaccinations(id);
      fetchLabReports(id);
      
      return data;
    } catch (err) {
      setError('Failed to fetch mother data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch appointments
  const fetchAppointments = useCallback(async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setAppointments([
        { id: 1, date: 'Nov 24, 2024', time: '10:30 AM', clinic: 'Green Valley Center', doctor: 'Dr. Perera', type: 'Routine Checkup', status: 'confirmed' },
        { id: 2, date: 'Oct 28, 2024', time: '9:00 AM', clinic: 'Green Valley Center', doctor: 'Dr. Perera', type: 'Routine Checkup', status: 'completed' },
        { id: 3, date: 'Sep 15, 2024', time: '11:00 AM', clinic: 'Green Valley Center', doctor: 'Dr. Chen', type: 'Ultrasound', status: 'completed' },
        { id: 4, date: 'Aug 20, 2024', time: '2:00 PM', clinic: 'Riverside Maternity', doctor: 'Dr. Perera', type: 'Initial Booking', status: 'completed' }
      ]);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  }, []);

  // Fetch vaccinations
  const fetchVaccinations = useCallback(async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      setVaccinations([
        { id: 1, name: 'Influenza (Annual)', dueDate: 'Oct 12, 2024', administeredDate: 'Oct 12, 2024', status: 'completed' },
        { id: 2, name: 'Tdap Booster', dueDate: 'Nov 12, 2024', administeredDate: null, status: 'upcoming' },
        { id: 3, name: 'Hepatitis B', dueDate: 'Dec 2024', administeredDate: null, status: 'pending' },
        { id: 4, name: 'RhoGAM Shot', dueDate: 'Week 28-30', administeredDate: null, status: 'pending' }
      ]);
    } catch (err) {
      console.error('Failed to fetch vaccinations:', err);
    }
  }, []);

  // Fetch lab reports
  const fetchLabReports = useCallback(async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setLabReports([
        { id: 1, name: 'Full Blood Count (FBC)', date: 'Oct 05, 2024', status: 'Normal', labId: '#77821' },
        { id: 2, name: 'Glucose Tolerance Test (GTT)', date: 'Sep 20, 2024', status: 'Pending Review', labId: '#76994' },
        { id: 3, name: 'Anatomy Ultrasound Scan', date: 'Sep 14, 2024', status: 'Complete', labId: '#RAD-401' },
        { id: 4, name: 'Urine Analysis', date: 'Aug 25, 2024', status: 'Normal', labId: '#76550' }
      ]);
    } catch (err) {
      console.error('Failed to fetch lab reports:', err);
    }
  }, []);

  // Calculate pregnancy week
  const calculatePregnancyWeek = useCallback((edd) => {
    const eddDate = new Date(edd);
    const today = new Date();
    const diffTime = eddDate - today;
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return 40 - diffWeeks;
  }, []);

  // Get trimester
  const getTrimester = useCallback((week) => {
    if (week <= 12) return 1;
    if (week <= 26) return 2;
    return 3;
  }, []);

  // Get risk level color
  const getRiskColor = useCallback((risk) => {
    const colors = {
      'Low Risk': 'bg-green-100 text-green-800',
      'Medium Risk': 'bg-yellow-100 text-yellow-800',
      'High Risk': 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  }, []);

  // Load data on mount if motherId provided
  useEffect(() => {
    if (motherId) {
      fetchMotherData(motherId);
    }
  }, [motherId, fetchMotherData]);

  return {
    motherData,
    appointments,
    vaccinations,
    labReports,
    loading,
    error,
    fetchMotherData,
    fetchAppointments,
    fetchVaccinations,
    fetchLabReports,
    calculatePregnancyWeek,
    getTrimester,
    getRiskColor
  };
};

export default useMother;