import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Calendar, Download, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown, Syringe, Baby, Clock, MapPin, User, FileText, AlertCircle, Bell, CalendarDays, Droplet, Shield, Plus, X, Stethoscope, Phone, Mail } from 'lucide-react';
import { formatDate, getMonthName, getShortMonthName } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ChatWidget from '../../components/common/ChatWidget';

const VaccinationSchedulerPage = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [vaccinations, setVaccinations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [motherData, setMotherData] = useState(null);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState(null);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Fetch data on component mount
  useEffect(() => {
    if (user && user.role === 'mother') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const profileResponse = await api.get('/mothers/profile');
      if (profileResponse.data.success) {
        const mother = profileResponse.data.data?.mother || profileResponse.data.mother;
        setMotherData(mother);
        
        const vaccinationResponse = await api.get('/vaccinations');
        if (vaccinationResponse.data.success) {
          setVaccinations(vaccinationResponse.data.data?.vaccinations || []);
        }
        
        const appointmentResponse = await api.get('/appointments/my');
        if (appointmentResponse.data.success) {
          setAppointments(appointmentResponse.data.data?.appointments || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (year, month, day) => {
    const dateEvents = {
      vaccinations: [],
      appointments: []
    };
    
    // Check for vaccinations on this date
    vaccinations.forEach(vacc => {
      if (vacc.due_date) {
        const vaccDate = new Date(vacc.due_date);
        if (vaccDate.getFullYear() === year && vaccDate.getMonth() === month && vaccDate.getDate() === day) {
          dateEvents.vaccinations.push(vacc);
        }
      }
    });
    
    // Check for appointments on this date
    appointments.forEach(app => {
      if (app.appointment_date) {
        const appDate = new Date(app.appointment_date);
        if (appDate.getFullYear() === year && appDate.getMonth() === month && appDate.getDate() === day) {
          dateEvents.appointments.push(app);
        }
      }
    });
    
    return dateEvents;
  };

  // Handle date click
  const handleDateClick = (day) => {
    const events = getEventsForDate(currentYear, currentMonth, day);
    if (events.vaccinations.length > 0 || events.appointments.length > 0) {
      setSelectedDateEvents(events);
      setShowDayEventsModal(true);
    }
  };

  // Handle appointment click from modal
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
    setShowDayEventsModal(false);
  };

  // Handle vaccine click from modal
  const handleViewVaccine = (vaccine) => {
    setSelectedVaccine(vaccine);
    setShowVaccineModal(true);
    setShowDayEventsModal(false);
  };

  // Get highlighted dates from vaccinations and appointments
  const getHighlightedDates = () => {
    const highlighted = {};
    
    vaccinations.forEach(vacc => {
      if (vacc.due_date) {
        const date = new Date(vacc.due_date);
        const month = date.getMonth();
        const day = date.getDate();
        if (!highlighted[month]) highlighted[month] = [];
        if (!highlighted[month].includes(day)) {
          highlighted[month].push(day);
        }
      }
    });
    
    appointments.forEach(app => {
      if (app.appointment_date) {
        const date = new Date(app.appointment_date);
        const month = date.getMonth();
        const day = date.getDate();
        if (!highlighted[month]) highlighted[month] = [];
        if (!highlighted[month].includes(day)) {
          highlighted[month].push(day);
        }
      }
    });
    
    return highlighted;
  };

  const highlightedDates = getHighlightedDates();

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    if (currentMonth === 0) setCurrentYear(prev => prev - 1);
    setShowMonthSelector(false);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    if (currentMonth === 11) setCurrentYear(prev => prev + 1);
    setShowMonthSelector(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(monthIndex);
    setShowMonthSelector(false);
  };

  const getDaysInMonth = (month, year) => {
    if (month === 1) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      return isLeapYear ? 29 : 28;
    }
    return daysInMonth[month];
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Group vaccinations by status
  const getVaccinationStatus = () => {
    const completed = vaccinations.filter(v => v.status === 'given' || v.status === 'completed');
    const upcoming = vaccinations.filter(v => v.status === 'due' || v.status === 'scheduled');
    const pending = vaccinations.filter(v => v.status === 'pending' || !v.status);
    const overdue = vaccinations.filter(v => {
      if ((v.status === 'due' || v.status === 'scheduled') && v.due_date) {
        return new Date(v.due_date) < new Date();
      }
      return false;
    });
    
    return { completed, upcoming, pending, overdue };
  };

  const { completed: completedVaccinations, upcoming: upcomingVaccinations, pending: pendingVaccinations, overdue: overdueVaccinations } = getVaccinationStatus();

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const total = vaccinations.length;
    const completed = completedVaccinations.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Get next upcoming vaccine
  const getNextVaccine = () => {
    const allUpcoming = [...upcomingVaccinations, ...pendingVaccinations];
    if (allUpcoming.length === 0) return null;
    return allUpcoming.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))[0];
  };

  const nextVaccine = getNextVaccine();
  const completionPercentage = getCompletionPercentage();

  // Download appointment as PDF
  const handleDownloadReport = async (appointment) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(219, 39, 119);
      doc.text('Appointment Report', 20, 20);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
      doc.line(20, 40, 190, 40);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Appointment Details', 20, 55);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const details = [
        ['Date:', formatDate(appointment.appointment_date, 'long')],
        ['Time:', appointment.appointment_time || 'Not specified'],
        ['Type:', appointment.appointment_type || 'N/A'],
        ['Status:', appointment.status || 'N/A'],
        ['Clinic:', appointment.Clinic?.clinic_name || appointment.clinic_name || 'Not specified'],
        ['Location:', appointment.Clinic?.address || 'Not specified'],
        ['Notes:', appointment.notes || 'No additional notes']
      ];
      
      let y = 70;
      details.forEach(detail => {
        doc.setFont('helvetica', 'bold');
        doc.text(detail[0], 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(detail[1], 70, y);
        y += 10;
      });
      
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('This is an electronically generated report from PearlMom System', 20, 280);
      doc.text('For any queries, please contact your healthcare provider.', 20, 290);
      
      doc.save(`Appointment_Report_${appointment.appointment_date}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate report');
    }
  };

  // Download vaccination certificate
  const handleDownloadVaccinationCertificate = async (vaccination) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(24);
      doc.setTextColor(219, 39, 119);
      doc.text('Vaccination Certificate', 20, 30);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Certificate ID: ${vaccination.vaccination_id || 'N/A'}`, 20, 50);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 60);
      doc.line(20, 65, 190, 65);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Vaccination Details', 20, 80);
      
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      
      const details = [
        ['Vaccine Name:', vaccination.vaccine_name],
        ['Vaccine Type:', vaccination.vaccine_type?.toUpperCase() || 'N/A'],
        ['Dose Number:', `Dose ${vaccination.dose_number || 1}`],
        ['Due Date:', formatDate(vaccination.due_date, 'long')],
        ['Administered Date:', vaccination.given_date ? formatDate(vaccination.given_date, 'long') : 'Not yet administered'],
        ['Status:', vaccination.status?.toUpperCase() || 'PENDING'],
        ['Batch Number:', vaccination.batch_number || 'N/A'],
        ['Notes:', vaccination.notes || 'No additional notes']
      ];
      
      let y = 95;
      details.forEach(detail => {
        doc.setFont('helvetica', 'bold');
        doc.text(detail[0], 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(detail[1], 80, y);
        y += 12;
      });
      
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text('This is an electronically generated certificate from PearlMom System', 20, 280);
      doc.text('Keep this record for your medical history.', 20, 290);
      
      doc.save(`Vaccination_Certificate_${vaccination.vaccine_name.replace(/\s/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('Failed to generate certificate');
    }
  };

  // Get vaccine icon
  const getVaccineIcon = (vaccineName) => {
    const name = vaccineName?.toLowerCase() || '';
    if (name.includes('tetanus') || name.includes('tdap')) return <Shield className="h-5 w-5" />;
    if (name.includes('influenza') || name.includes('flu')) return <Droplet className="h-5 w-5" />;
    if (name.includes('covid')) return <Syringe className="h-5 w-5" />;
    if (name.includes('hepatitis')) return <AlertCircle className="h-5 w-5" />;
    return <Syringe className="h-5 w-5" />;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
      case 'given':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'due':
        return 'bg-yellow-100 text-yellow-800';
      case 'missed':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'given':
      case 'completed':
        return 'COMPLETED';
      case 'scheduled':
        return 'SCHEDULED';
      case 'due':
        return 'DUE';
      case 'missed':
        return 'MISSED';
      default:
        return status?.toUpperCase() || 'PENDING';
    }
  };

  const getAppointmentTypeColor = (type) => {
    switch(type?.toLowerCase()) {
      case 'antenatal':
      case 'routine checkup':
        return 'bg-blue-100 text-blue-800';
      case 'vaccination':
        return 'bg-green-100 text-green-800';
      case 'ultrasound':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vaccination & Care</h2>
        <p className="text-gray-500">Manage your pregnancy milestones and upcoming pediatric appointments in one serene space.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          {/* Calendar Section */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <button
                      onClick={() => setShowMonthSelector(!showMonthSelector)}
                      className="flex items-center space-x-1 text-lg font-bold text-gray-900 hover:text-pink-600 transition-colors"
                    >
                      <span>{months[currentMonth]}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showMonthSelector ? 'rotate-180' : ''}`} />
                    </button>
                    {showMonthSelector && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowMonthSelector(false)}></div>
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-20 w-48 max-h-64 overflow-y-auto py-2">
                          {months.map((month, index) => (
                            <button key={month} onClick={() => handleMonthSelect(index)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${index === currentMonth ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}>
                              {month} {currentYear}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <span className="text-lg font-bold text-gray-900">{currentYear}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Previous Month">
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => {
                    setCurrentMonth(new Date().getMonth());
                    setCurrentYear(new Date().getFullYear());
                  }} className="px-2 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                    Today
                  </button>
                  <button onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Next Month">
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-[10px] font-bold text-gray-400 tracking-widest py-1">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: getFirstDayOfMonth(currentMonth, currentYear) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square p-1"></div>
                ))}
                {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }).map((_, i) => {
                  const day = i + 1;
                  const isHighlighted = highlightedDates[currentMonth]?.includes(day);
                  const isToday = day === new Date().getDate() && 
                                  currentMonth === new Date().getMonth() && 
                                  currentYear === new Date().getFullYear();
                  const events = getEventsForDate(currentYear, currentMonth, day);
                  const hasMultipleEvents = (events.vaccinations.length + events.appointments.length) > 1;
                  
                  return (
                    <div 
                      key={day}
                      onClick={() => handleDateClick(day)}
                      className={`aspect-square p-1 rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition-all relative ${
                        isToday ? 'bg-pink-600 text-white font-bold shadow-md' :
                        isHighlighted ? 'bg-pink-100 text-pink-700 font-semibold border border-pink-200 hover:bg-pink-200' :
                        'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{day}</span>
                      {isHighlighted && !isToday && (
                        <div className="flex gap-0.5 mt-0.5">
                          {events.vaccinations.length > 0 && <span className="h-1 w-1 rounded-full bg-pink-500"></span>}
                          {events.appointments.length > 0 && <span className="h-1 w-1 rounded-full bg-blue-500"></span>}
                          {hasMultipleEvents && <span className="h-1 w-1 rounded-full bg-green-500"></span>}
                        </div>
                      )}
                      {isToday && <span className="h-1 w-1 rounded-full bg-white mt-0.5"></span>}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-pink-500 mr-2"></span> Vaccination</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span> Appointment</span>
                <span className="flex items-center"><span className="h-2 w-2 rounded-full bg-pink-600 mr-2"></span> Today</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Month Select */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Month Select</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {months.map((month, index) => (
                  <button key={month} onClick={() => handleMonthSelect(index)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      index === currentMonth ? 'bg-pink-600 text-white shadow-sm' : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-gray-200'
                    }`}>
                    {getShortMonthName(index)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Immunization Tip */}
          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200 flex">
            <div className="mr-4">
              <div className="h-10 w-10 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700 text-lg">💡</div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Immunization Tip</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Vaccines during pregnancy provide early protection for your baby that lasts for several months after birth.</p>
            </div>
          </div>
        </div>

        {/* Vaccination Track */}
        <div>
          <Card className="h-full bg-white relative overflow-hidden">
            <div className="p-5 pb-2 border-b border-gray-100 flex justify-between items-center relative z-10 bg-white">
              <div>
                <h3 className="text-lg font-bold text-pink-600">Vaccination Track</h3>
                <p className="text-xs text-gray-500 mt-1">{completionPercentage}% Complete</p>
              </div>
              <Badge className="bg-pink-600 text-white hover:bg-pink-700 border-none px-3 py-1 text-[10px] uppercase font-bold tracking-wider">Growth Phase</Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="px-5 pt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Next Vaccine Reminder */}
            {nextVaccine && (
              <div className="mx-5 mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <Bell className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-800">Next Upcoming</p>
                    <p className="text-sm font-medium text-gray-900">{nextVaccine.vaccine_name}</p>
                    <p className="text-xs text-blue-600">
                      Due on {formatDate(nextVaccine.due_date, 'long')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-5 pt-4 relative z-10">
              <div className="relative border-l border-gray-200 ml-3 space-y-6 py-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                
                {/* Overdue Vaccinations */}
                {overdueVaccinations.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 ml-2">
                      <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      <p className="text-xs font-semibold text-red-600 uppercase tracking-wider">Overdue</p>
                    </div>
                    {overdueVaccinations.map((vacc) => (
                      <div key={`overdue-${vacc.vaccination_id}`} className="relative pl-8 mb-4 cursor-pointer hover:bg-red-50 rounded-lg transition-colors" onClick={() => handleViewVaccine(vacc)}>
                        <div className="absolute left-[-10px] top-0 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                          <AlertCircle className="h-3 w-3" />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{vacc.vaccine_name}</h4>
                            <p className="text-xs text-red-600 font-medium">
                              Overdue since {formatDate(vacc.due_date, 'short')}
                            </p>
                          </div>
                          <Badge className="bg-red-100 text-red-800 text-[10px] tracking-wider font-bold border-none">OVERDUE</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="ghost" className="text-pink-600 text-xs p-1 h-auto" onClick={(e) => { e.stopPropagation(); handleDownloadVaccinationCertificate(vacc); }}>
                            <Download className="h-3 w-3 mr-1" /> Certificate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Vaccinations */}
                {completedVaccinations.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 ml-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Completed</p>
                    </div>
                    {completedVaccinations.map((vacc) => (
                      <div key={`completed-${vacc.vaccination_id}`} className="relative pl-8 mb-4 cursor-pointer hover:bg-green-50 rounded-lg transition-colors" onClick={() => handleViewVaccine(vacc)}>
                        <div className="absolute left-[-12px] top-0 h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{vacc.vaccine_name}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Administered {vacc.given_date ? formatDate(vacc.given_date, 'short') : formatDate(vacc.due_date, 'short')}
                            </p>
                            {vacc.batch_number && (
                              <p className="text-xs text-gray-400 mt-0.5">Batch: {vacc.batch_number}</p>
                            )}
                          </div>
                          <Badge variant="success" className="text-[10px] tracking-wider font-bold">COMPLETED</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="ghost" className="text-pink-600 text-xs p-1 h-auto" onClick={(e) => { e.stopPropagation(); handleDownloadVaccinationCertificate(vacc); }}>
                            <Download className="h-3 w-3 mr-1" /> Certificate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upcoming Vaccinations */}
                {upcomingVaccinations.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 ml-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                      <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Upcoming</p>
                    </div>
                    {upcomingVaccinations.map((vacc) => (
                      <div key={`upcoming-${vacc.vaccination_id}`} className="relative pl-8 mb-4 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors" onClick={() => handleViewVaccine(vacc)}>
                        <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-blue-400 border border-white"></div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{vacc.vaccine_name}</h4>
                            <p className="text-xs text-blue-600 font-medium mt-0.5">
                              Scheduled for {formatDate(vacc.due_date, 'short')}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">Dose {vacc.dose_number || 1}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 text-[10px] tracking-wider font-bold border-none">UPCOMING</Badge>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <Button size="sm" variant="ghost" className="text-pink-600 text-xs p-1 h-auto" onClick={(e) => { e.stopPropagation(); handleDownloadVaccinationCertificate(vacc); }}>
                            <Download className="h-3 w-3 mr-1" /> Info
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pending Vaccinations */}
                {pendingVaccinations.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3 ml-2">
                      <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</p>
                    </div>
                    {pendingVaccinations.map((vacc) => (
                      <div key={`pending-${vacc.vaccination_id}`} className="relative pl-8 mb-4 opacity-70 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors" onClick={() => handleViewVaccine(vacc)}>
                        <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-gray-300 border-2 border-white"></div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-gray-600 text-sm">{vacc.vaccine_name}</h4>
                            <p className="text-xs text-gray-400 italic mt-0.5">
                              {vacc.due_date ? formatDate(vacc.due_date, 'short') : 'Awaiting schedule'}
                            </p>
                          </div>
                          <Badge className="bg-gray-100 text-gray-400 border-none text-[10px] tracking-wider font-bold">PENDING</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {vaccinations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Syringe className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p>No vaccination records found</p>
                    <p className="text-xs mt-1">Vaccinations will appear here once scheduled</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Appointment History Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Appointment History</h3>
        </div>
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 border-b border-gray-200">
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">DATE</th>
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">TIME</th>
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">TYPE</th>
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">CLINIC</th>
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">STATUS</th>
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">NOTES</th>
                  <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">REPORT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((appointment, index) => (
                  <tr key={appointment.appointment_id || index} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewAppointment(appointment)}>
                    <td className="py-4 px-4 font-bold text-gray-900">
                      {formatDate(appointment.appointment_date, 'short')}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {appointment.appointment_time || 'Not set'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`rounded-md px-3 py-1 ${getAppointmentTypeColor(appointment.appointment_type)} border-none`}>
                        {appointment.appointment_type?.toUpperCase() || 'CHECKUP'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {appointment.Clinic?.clinic_name || appointment.clinic_name || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={`${getStatusColor(appointment.status)} border-none`}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                      {appointment.notes || '-'}
                    </td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDownloadReport(appointment); }} 
                        className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                      >
                        <Download className="h-4 w-4" /><span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No appointment history found</p>
            <p className="text-sm text-gray-400 mt-1">Your appointments will appear here once scheduled</p>
          </div>
        )}
      </div>

      {/* Day Events Modal - Shows all events on a selected date */}
      {showDayEventsModal && selectedDateEvents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Schedule Details</h2>
                  <p className="text-xs text-gray-500">
                    {selectedDateEvents.appointments.length + selectedDateEvents.vaccinations.length} events on this day
                  </p>
                </div>
              </div>
              <button onClick={() => setShowDayEventsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Vaccinations */}
              {selectedDateEvents.vaccinations.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Syringe className="h-4 w-4 text-pink-500" />
                    <h3 className="font-semibold text-gray-900">Vaccinations ({selectedDateEvents.vaccinations.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedDateEvents.vaccinations.map((vacc, idx) => (
                      <div key={`modal-vacc-${idx}`} className="border border-gray-200 rounded-lg p-3 hover:bg-pink-50 cursor-pointer transition-colors" onClick={() => handleViewVaccine(vacc)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{vacc.vaccine_name}</p>
                            <p className="text-xs text-gray-500 mt-1">Due Date: {formatDate(vacc.due_date, 'long')}</p>
                            <Badge className={`mt-2 ${getStatusColor(vacc.status)}`}>{getStatusText(vacc.status)}</Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments */}
              {selectedDateEvents.appointments.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Stethoscope className="h-4 w-4 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">Appointments ({selectedDateEvents.appointments.length})</h3>
                  </div>
                  <div className="space-y-3">
                    {selectedDateEvents.appointments.map((app, idx) => (
                      <div key={`modal-app-${idx}`} className="border border-gray-200 rounded-lg p-3 hover:bg-blue-50 cursor-pointer transition-colors" onClick={() => handleViewAppointment(app)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{app.appointment_type?.toUpperCase() || 'APPOINTMENT'}</p>
                            <p className="text-xs text-gray-500 mt-1">Time: {app.appointment_time || 'Not specified'}</p>
                            <p className="text-xs text-gray-500">Clinic: {app.Clinic?.clinic_name || app.clinic_name || 'N/A'}</p>
                            <Badge className={`mt-2 ${getStatusColor(app.status)}`}>{getStatusText(app.status)}</Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
                  <p className="text-xs text-gray-500">{selectedAppointment.appointment_type?.toUpperCase() || 'Medical Appointment'}</p>
                </div>
              </div>
              <button onClick={() => setShowAppointmentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selectedAppointment.appointment_date, 'long')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedAppointment.appointment_time || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <Badge className={getAppointmentTypeColor(selectedAppointment.appointment_type)}>
                    {selectedAppointment.appointment_type?.toUpperCase() || 'CHECKUP'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {getStatusText(selectedAppointment.status)}
                  </Badge>
                </div>
              </div>

              {/* Clinic Information */}
              {(selectedAppointment.Clinic?.clinic_name || selectedAppointment.clinic_name) && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Clinic Location
                  </p>
                  <p className="text-sm text-gray-800 font-medium">
                    {selectedAppointment.Clinic?.clinic_name || selectedAppointment.clinic_name}
                  </p>
                  {selectedAppointment.Clinic?.address && (
                    <p className="text-xs text-gray-500 mt-1">{selectedAppointment.Clinic.address}</p>
                  )}
                  {selectedAppointment.Clinic?.contact_number && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {selectedAppointment.Clinic.contact_number}
                    </p>
                  )}
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Additional Notes</p>
                  <p className="text-sm text-gray-700">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vaccine Details Modal */}
      {showVaccineModal && selectedVaccine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  {getVaccineIcon(selectedVaccine.vaccine_name)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedVaccine.vaccine_name}</h2>
                  <p className="text-xs text-gray-500">Vaccination Details</p>
                </div>
              </div>
              <button onClick={() => setShowVaccineModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Vaccine Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedVaccine.vaccine_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Dose Number</p>
                  <p className="font-medium text-gray-900">{selectedVaccine.dose_number || 1}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedVaccine.due_date, 'long')}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className={getStatusColor(selectedVaccine.status)}>{getStatusText(selectedVaccine.status)}</Badge>
                </div>
                {selectedVaccine.given_date && (
                  <div>
                    <p className="text-xs text-gray-500">Administered Date</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedVaccine.given_date, 'long')}</p>
                  </div>
                )}
                {selectedVaccine.batch_number && (
                  <div>
                    <p className="text-xs text-gray-500">Batch Number</p>
                    <p className="font-medium text-gray-900">{selectedVaccine.batch_number}</p>
                  </div>
                )}
              </div>
              {selectedVaccine.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{selectedVaccine.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f472b6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ec4899;
        }
      `}</style>
      <ChatWidget />
    </div>
  );
};

export default VaccinationSchedulerPage;