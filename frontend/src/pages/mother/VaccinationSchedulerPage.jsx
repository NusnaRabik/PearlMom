import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Calendar, Download, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown } from 'lucide-react';

const VaccinationSchedulerPage = () => {
  const [currentMonth, setCurrentMonth] = useState(0); // 0 = January 2026
  const [currentYear] = useState(2026);
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Highlight dates for 2026
  const highlightedDates = {
    0: [5, 12, 20],  // January
    1: [3, 15, 25],  // February
    2: [8, 18, 28],  // March
    3: [2, 14, 22],  // April
    4: [7, 16, 26],  // May
    5: [4, 11, 19],  // June
    6: [9, 17, 27],  // July
    7: [1, 13, 23],  // August
    8: [6, 15, 24],  // September
    9: [3, 12, 21],  // October
    10: [8, 18, 28], // November
    11: [5, 14, 25]  // December
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setShowMonthSelector(false);
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setShowMonthSelector(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(monthIndex);
    setShowMonthSelector(false);
  };

  const getDaysInMonth = (month) => {
    return daysInMonth[month];
  };

  const getFirstDayOfMonth = (month) => {
    // For 2026, January 1st is Thursday (4)
    const firstDays = [4, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2];
    return firstDays[month];
  };

  const handleDownloadReport = (appointment) => {
    const reportContent = `
APPOINTMENT REPORT
==================
Date: ${appointment.date}
Clinic: ${appointment.clinic}
Type: ${appointment.type}
Specialist: ${appointment.specialist}
Outcome: ${appointment.outcome}

Status: Completed
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Appointment_Report_${appointment.date.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const appointmentHistory = [
    {
      date: 'Oct 24, 2024',
      clinic: "St. Mary's Women's Center",
      type: 'Routine Checkup',
      specialist: 'Dr. Sarah Chen',
      outcome: 'All parameters normal',
      status: 'completed'
    },
    {
      date: 'Sep 30, 2024',
      clinic: 'Pearl Health Riverside',
      type: 'Lab Test',
      specialist: 'Lab Tech J. Doe',
      outcome: 'Glucose screen passed',
      status: 'completed'
    },
    {
      date: 'Aug 15, 2024',
      clinic: "St. Mary's Women's Center",
      type: 'Ultrasound',
      specialist: 'Dr. Sarah Chen',
      outcome: 'Healthy development',
      status: 'completed'
    }
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen pb-8">
      
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Vaccination & Care</h2>
        <p className="text-gray-500">Manage your pregnancy milestones and upcoming pediatric appointments in one serene space.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Calendar */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Calendar View */}
          <Card className="bg-white">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center space-x-2">
                  {/* Month Selector Button */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowMonthSelector(!showMonthSelector);
                        setShowYearSelector(false);
                      }}
                      className="flex items-center space-x-1 text-lg font-bold text-gray-900 hover:text-pink-600 transition-colors"
                    >
                      <span>{months[currentMonth]}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${showMonthSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Month Dropdown */}
                    {showMonthSelector && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMonthSelector(false)}
                        ></div>
                        <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 z-20 w-48 max-h-64 overflow-y-auto py-2">
                          {months.map((month, index) => (
                            <button
                              key={month}
                              onClick={() => handleMonthSelect(index)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                index === currentMonth
                                  ? 'bg-pink-50 text-pink-600 font-medium'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {month} 2026
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <span className="text-lg font-bold text-gray-900">{currentYear}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <button 
                    onClick={handlePrevMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Previous Month"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setCurrentMonth(new Date().getMonth())}
                    className="px-2 py-1 text-xs font-medium text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Next Month"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-[10px] font-bold text-gray-400 tracking-widest py-1">{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before first day of month */}
                {Array.from({ length: getFirstDayOfMonth(currentMonth) }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square p-1"></div>
                ))}
                
                {/* Days of month */}
                {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, i) => {
                  const day = i + 1;
                  const isHighlighted = highlightedDates[currentMonth]?.includes(day);
                  const isToday = day === 5 && currentMonth === 5; // Example: June 5, 2026 as today
                  
                  return (
                    <div
                      key={day}
                      className={`aspect-square p-1 rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition-all relative ${
                        isToday
                          ? 'bg-pink-600 text-white font-bold shadow-md'
                          : isHighlighted
                          ? 'bg-pink-100 text-pink-700 font-semibold border border-pink-200 hover:bg-pink-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{day}</span>
                      {isHighlighted && !isToday && (
                        <span className="h-1 w-1 rounded-full bg-pink-500 mt-0.5"></span>
                      )}
                      {isToday && (
                        <span className="h-1 w-1 rounded-full bg-white mt-0.5"></span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex gap-6 text-xs text-gray-500 font-medium">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-pink-500 mr-2"></span> Vaccination
                </span>
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span> Routine Checkup
                </span>
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-pink-600 mr-2"></span> Today
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Month Selection Grid */}
          <Card className="bg-white">
            <CardContent className="p-4">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Month Select</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {months.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      index === currentMonth
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600 border border-gray-200'
                    }`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Immunization Tip */}
          <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200 flex">
            <div className="mr-4">
              <div className="h-10 w-10 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-700 text-lg">
                💡
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">Immunization Tip</h4>
              <p className="text-gray-700 text-sm leading-relaxed">Vaccines during pregnancy provide early protection for your baby that lasts for several months after birth.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Vaccination Track */}
        <div>
          <Card className="h-full bg-white relative overflow-hidden">
            <div className="p-5 pb-2 border-b border-gray-100 flex justify-between items-center relative z-10 bg-white">
              <h3 className="text-lg font-bold text-pink-600">Vaccination Track</h3>
              <Badge className="bg-pink-600 text-white hover:bg-pink-700 border-none px-3 py-1 text-[10px] uppercase font-bold tracking-wider">Growth Phase</Badge>
            </div>
            
            <CardContent className="p-5 pt-4 relative z-10">
              <div className="relative border-l border-gray-200 ml-3 space-y-8 py-4">
                
                {/* Item 1 */}
                <div className="relative pl-8">
                  <div className="absolute left-[-12px] top-0 h-6 w-6 rounded-full bg-pink-600 text-white flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">Influenza (Annual)</h4>
                      <p className="text-xs text-gray-500 mt-1">Administered Oct 12, 2024</p>
                    </div>
                    <Badge variant="success" className="text-[10px] tracking-wider font-bold">COMPLETED</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">Standard seasonal protection for expectant mothers. No side effects reported.</p>
                </div>

                {/* Item 2 */}
                <div className="relative pl-8">
                  <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-blue-400 border border-white"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">Tdap Booster</h4>
                      <p className="text-xs text-blue-600 font-medium mt-1">Scheduled for Nov 12, 2024</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-[10px] tracking-wider font-bold border-none">UPCOMING</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">Crucial for protecting the newborn against pertussis (whooping cough).</p>
                </div>

                {/* Item 3 */}
                <div className="relative pl-8 opacity-60">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-500 text-base">Hepatitis B</h4>
                      <p className="text-xs text-gray-400 italic mt-1">2nd Trimester Window</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-400 border-none text-[10px] tracking-wider font-bold">PENDING</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">Review current immunity levels during next consultation.</p>
                </div>

                {/* Item 4 */}
                <div className="relative pl-8 opacity-60">
                  <div className="absolute left-[-8px] top-0 h-4 w-4 rounded-full bg-gray-200 border-2 border-white"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-500 text-base">RhoGAM Shot</h4>
                      <p className="text-xs text-gray-400 italic mt-1">Week 28-30</p>
                    </div>
                    <Badge className="bg-gray-100 text-gray-400 border-none text-[10px] tracking-wider font-bold">PENDING</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">Only required for Rh-negative blood type compatibility.</p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Appointment History - Full Width */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Appointment History</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-200">
                <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">DATE</th>
                <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">CLINIC</th>
                <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">TYPE</th>
                <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">SPECIALIST</th>
                <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">OUTCOME</th>
                <th className="pb-4 font-semibold tracking-wider text-xs uppercase px-4">REPORT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointmentHistory.map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-gray-900">{appointment.date}</td>
                  <td className="py-4 px-4 text-gray-600">{appointment.clinic}</td>
                  <td className="py-4 px-4">
                    <Badge className={`rounded-md px-3 py-1 ${
                      appointment.type === 'Routine Checkup' || appointment.type === 'Ultrasound'
                        ? 'bg-blue-100 text-blue-800 border-none'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {appointment.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-gray-700">{appointment.specialist}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium flex items-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-600 mr-2 inline-block"></span>
                    {appointment.outcome}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDownloadReport(appointment)}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default VaccinationSchedulerPage;