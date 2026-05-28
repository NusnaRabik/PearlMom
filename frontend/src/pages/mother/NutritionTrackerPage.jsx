import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Calendar, Bell, TrendingUp, Package, MapPin, Award, Leaf, Droplets, Sun, AlertCircle, X, Loader, Clock, History, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatDate } from '../../utils/formatDate';
import { NUTRITIONAL_GUIDELINES, BMI_CATEGORIES } from '../../constants/thriposhCriteria';

const NutritionTrackerPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [motherData, setMotherData] = useState(null);
  const [thriposhaStatus, setThriposhaStatus] = useState(null);
  const [distributionHistory, setDistributionHistory] = useState([]);
  const [weightHistory, setWeightHistory] = useState([]);
  const [nextDistribution, setNextDistribution] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [settingReminder, setSettingReminder] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [bmiCategory, setBmiCategory] = useState(null);
  const [currentTrimester, setCurrentTrimester] = useState(null);
  const [trimesterAdvice, setTrimesterAdvice] = useState(null);

  useEffect(() => {
    if (user && user.role === 'mother') {
      fetchNutritionData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchNutritionData = async () => {
    try {
      setLoading(true);
      setFetchError(false);
      
      // Fetch mother profile
      const profileResponse = await api.get('/mothers/profile');
      if (profileResponse.data.success) {
        const mother = profileResponse.data.data?.mother || profileResponse.data.mother;
        setMotherData(mother);
        
        // Calculate BMI
        if (mother.current_weight && mother.height) {
          const heightInMeters = mother.height / 100;
          const bmi = (mother.current_weight / (heightInMeters * heightInMeters)).toFixed(1);
          const category = getBMICategory(parseFloat(bmi));
          setBmiCategory(category);
        }
        
        // Calculate trimester based on weeks
        if (mother.weeks) {
          const trimester = getTrimesterFromWeeks(mother.weeks);
          setCurrentTrimester(trimester);
          setTrimesterAdvice(NUTRITIONAL_GUIDELINES[trimester]);
        }
      }
      
      // Fetch Thriposha status
      const thriposhaResponse = await api.get('/thriposha/status');
      if (thriposhaResponse.data.success) {
        const data = thriposhaResponse.data.data;
        setThriposhaStatus(data);
      }
      
      // Fetch distribution history and set next distribution directly from response
      const historyResponse = await api.get('/thriposha/history');
      if (historyResponse.data.success) {
        const history = historyResponse.data.data?.history || [];
        setDistributionHistory(history);
        
        // Calculate next distribution using the raw history data (not the state)
        if (history.length > 0) {
          const lastDistribution = history[0];
          if (lastDistribution.distribution_date) {
            const nextDate = new Date(lastDistribution.distribution_date);
            nextDate.setDate(nextDate.getDate() + 30);
            setNextDistribution({
              date: nextDate,
              location: 'Colombo Central Clinic',
              packets: thriposhaResponse.data.data?.eligibility?.recommended_packets || 2
            });
          }
        } else {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() + 15);
          setNextDistribution({
            date: defaultDate,
            location: 'Colombo Central Clinic',
            packets: 2
          });
        }
      }
      
      // Fetch weight history from clinic visits
      const weightHistoryResponse = await api.get('/mothers/emch-card-data');
      if (weightHistoryResponse.data.success) {
        const visits = weightHistoryResponse.data.data?.clinicVisits || [];
        const weights = visits
          .filter(visit => visit.weight_kg)
          .map(visit => ({
            date: visit.visit_date,
            weight: parseFloat(visit.weight_kg),
            weeks: visit.gestational_weeks
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        setWeightHistory(weights);
      }
      
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return BMI_CATEGORIES.underweight;
    if (bmi >= 18.5 && bmi <= 24.9) return BMI_CATEGORIES.normal;
    if (bmi >= 25 && bmi <= 29.9) return BMI_CATEGORIES.overweight;
    return BMI_CATEGORIES.obese;
  };

  const getTrimesterFromWeeks = (weeks) => {
    if (weeks <= 12) return 'firstTrimester';
    if (weeks <= 26) return 'secondTrimester';
    if (weeks <= 40) return 'thirdTrimester';
    return 'postpartum';
  };

  const calculateTotalGain = () => {
    if (weightHistory.length < 2) return 0;
    const firstWeight = weightHistory[0]?.weight || 0;
    const currentWeight = weightHistory[weightHistory.length - 1]?.weight || motherData?.current_weight || 0;
    const gain = currentWeight - firstWeight;
    return gain > 0 ? gain.toFixed(1) : '0.0';
  };

  const getTotalGainValue = () => {
    const gain = calculateTotalGain();
    return parseFloat(gain);
  };

  const getTargetGainRange = () => {
    const bmi = bmiCategory;
    if (bmi?.label === 'Underweight') return '12.5 - 18 kg';
    if (bmi?.label === 'Normal Weight') return '11.5 - 16 kg';
    if (bmi?.label === 'Overweight') return '7 - 11.5 kg';
    return '5 - 9 kg';
  };

  const handleSetReminder = async () => {
    if (!nextDistribution) {
      alert('No upcoming distribution to set reminder for.');
      return;
    }
    
    setSettingReminder(true);
    try {
      // Send reminder notification to backend
      await api.post('/notifications', {
        type: 'thriposha_distribution',
        title: 'Thriposha Distribution Reminder',
        message: `Reminder: Collect your Thriposha packets (${nextDistribution.packets} packet(s)) at ${nextDistribution.location} on ${formatDate(nextDistribution.date, 'long')}`,
        scheduled_for: nextDistribution.date,
        priority: 'high'
      });
      
      setReminderSet(true);
      setTimeout(() => setReminderSet(false), 3000);
    } catch (error) {
      console.error('Error setting reminder:', error);
      alert('Failed to set reminder. Please try again.');
    } finally {
      setSettingReminder(false);
    }
  };

  const handleViewHistoryDetails = (item) => {
    setSelectedHistory(item);
    setShowHistoryModal(true);
  };

  const getEligibilityStatus = () => {
    if (!thriposhaStatus?.eligibility) return { eligible: true, packets: 2, reason: null };
    const isEligible = thriposhaStatus.eligibility.is_eligible !== false;
    let packets = 1;
    
    if (thriposhaStatus.eligibility.recommended_packets) {
      packets = thriposhaStatus.eligibility.recommended_packets;
    } else if (thriposhaStatus.bmi) {
      packets = (thriposhaStatus.bmi < 18.5 || thriposhaStatus.bmi >= 30) ? 2 : 1;
    }
    
    return { eligible: isEligible, packets, reason: thriposhaStatus.eligibility.ineligibility_reason };
  };

  const eligibility = getEligibilityStatus();
  const totalGainValue = getTotalGainValue();
  const maxTargetGain = 16;
  const progressPercentage = Math.max(0, Math.min(100, (totalGainValue / maxTargetGain) * 100));

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin text-pink-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your nutrition data...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Failed to load nutrition data</p>
          <p className="text-sm text-gray-500 mt-1">Please check your connection and try again</p>
          <button 
            onClick={fetchNutritionData}
            className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Nutrition & Thriposha Tracker</h2>
        <p className="text-gray-500">Nurturing your journey with essential supplements and mindful eating.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thriposha Hero - Dynamic based on eligibility */}
          <div className={`rounded-2xl p-8 text-white relative overflow-hidden shadow-sm ${
            eligibility.eligible 
              ? 'bg-gradient-to-br from-rose-400 to-pink-400' 
              : 'bg-gradient-to-br from-gray-500 to-gray-600'
          }`}>
            {/* Decorative background */}
            <div className="absolute right-0 bottom-0 opacity-10">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle fill="currentColor" cx="150" cy="150" r="100" />
                <circle fill="currentColor" cx="100" cy="100" r="60" />
              </svg>
            </div>
            <div className="absolute top-4 right-8 opacity-10">
              <Package size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <Badge className={eligibility.eligible 
                  ? "bg-green-500 text-white hover:bg-green-400 border-none tracking-wide uppercase text-sm font-bold px-5 py-2 shadow-md"
                  : "bg-red-500 text-white hover:bg-red-400 border-none tracking-wide uppercase text-sm font-bold px-5 py-2 shadow-md"
                }>
                  {eligibility.eligible ? "✅ You Are Eligible" : "⚠️ Currently Not Eligible"}
                </Badge>
                <Badge className="bg-white/20 text-white border-none tracking-wide uppercase text-xs px-3 py-1.5">
                  {eligibility.eligible ? "Active Program" : "Review Required"}
                </Badge>
              </div>
              
              <h2 className="text-3xl font-bold mb-3">Thriposha Supplement Program</h2>
              <p className="text-rose-50 mb-8 leading-relaxed max-w-lg">
                {eligibility.eligible 
                  ? "You qualify for the government-sponsored Thriposha nutritional supplement program. Your health records are verified and up-to-date."
                  : "You are currently not eligible for the Thriposha program. Please consult with your healthcare provider for more information."
                }
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-white/15 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/20 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-rose-100" />
                    <p className="text-xs text-rose-100 uppercase tracking-widest">Next Distribution</p>
                  </div>
                  <p className="text-2xl font-bold">{nextDistribution ? formatDate(nextDistribution.date, 'long') : 'Not scheduled'}</p>
                  <p className="text-xs text-rose-100 mt-1">{nextDistribution?.location || 'Contact your clinic'}</p>
                </div>
                
                <div className="bg-white/15 rounded-xl px-5 py-4 backdrop-blur-sm border border-white/20 flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-rose-100" />
                    <p className="text-xs text-rose-100 uppercase tracking-widest">Eligible Quantity</p>
                  </div>
                  <p className="text-2xl font-bold">{eligibility.packets} Packet{eligibility.packets !== 1 ? 's' : ''}</p>
                  <p className="text-xs text-rose-100 mt-1">Per distribution cycle</p>
                </div>
                
                <button 
                  onClick={handleSetReminder}
                  disabled={settingReminder || !eligibility.eligible || !nextDistribution}
                  className="bg-white text-rose-500 rounded-xl px-5 py-4 font-semibold hover:bg-rose-50 transition-colors flex items-center justify-center space-x-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {settingReminder ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : reminderSet ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Bell className="h-5 w-5" />
                  )}
                  <span>{reminderSet ? 'Reminder Set!' : 'Set Reminder'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Weight Tracking */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Mother's Weight Tracking</h3>
                  <p className="text-sm text-gray-500">Monitoring your healthy weight gain progress for a safe pregnancy.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-5 flex flex-col justify-center text-center">
                  <p className="text-xs font-semibold text-rose-700 tracking-wider uppercase mb-2">Current Weight</p>
                  <p className="text-4xl font-bold text-gray-900 mb-2">
                    {motherData?.current_weight || '--'} 
                    <span className="text-lg text-gray-500 font-medium">kg</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Recorded on {weightHistory.length > 0 ? formatDate(weightHistory[weightHistory.length - 1]?.date, 'short') : 'N/A'}
                  </p>
                  {bmiCategory && (
                    <p className={`text-xs font-medium mt-2 ${bmiCategory.color}`}>
                      BMI: {bmiCategory.label} ({((motherData?.current_weight / ((motherData?.height / 100) ** 2)) || 0).toFixed(1)})
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mr-3">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase">Total Gain</p>
                      <p className="text-xl font-bold text-gray-900">+{calculateTotalGain()} kg</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-rose-400 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 italic">Target Gain: {getTargetGainRange()}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">Recent Progress</p>
                  <div className="space-y-2">
                    {weightHistory.slice(-3).reverse().map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{formatDate(item.date, 'short')}</span>
                        <span className="font-semibold">{item.weight} kg</span>
                      </div>
                    ))}
                    {weightHistory.length === 0 && (
                      <p className="text-xs text-gray-400 text-center">No weight records yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section - Dynamic Trimester Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trimester Advice - Dynamic based on current weeks */}
            <Card className="bg-white h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                  {trimesterAdvice?.title || 'Pregnancy Nutrition Guide'}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {trimesterAdvice?.tips?.[0] || 'Proper nutrition is essential for a healthy pregnancy. Focus on balanced meals and key nutrients.'}
                </p>
                <ul className="space-y-4 flex-grow">
                  {trimesterAdvice?.tips?.slice(1, 4).map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{tip}</span>
                    </li>
                  ))}
                  {!trimesterAdvice && (
                    <>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Prioritize lean protein for tissue repair.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Calcium-rich foods for developing bones.</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-rose-500 mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">Stay hydrated - 8-10 glasses daily.</span>
                      </li>
                    </>
                  )}
                </ul>
                {trimesterAdvice?.calorieIncrease > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      📈 Calorie increase: +{trimesterAdvice.calorieIncrease} calories/day
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Essential Nutrition Tips */}
            <Card className="bg-white h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight">Essential Nutrition Tips</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Key nutritional guidelines to support your health and your baby's development throughout pregnancy.
                </p>
                
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="h-10 w-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
                      <Droplets className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Stay Hydrated</p>
                      <p className="text-xs text-gray-600 mt-0.5">Drink 8-10 glasses of water daily. Proper hydration helps prevent UTIs and maintains amniotic fluid levels.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                      <Sun className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Vitamin D Intake</p>
                      <p className="text-xs text-gray-600 mt-0.5">Get 15-20 minutes of morning sunlight and consume vitamin D-rich foods like eggs and fortified milk.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Iron-Rich Foods</p>
                      <p className="text-xs text-gray-600 mt-0.5">Combine iron sources (spinach, lean meat) with vitamin C (oranges, tomatoes) for better absorption.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 rounded-lg p-3 flex items-start border border-yellow-200">
                  <span className="text-yellow-600 mr-2 text-lg">💡</span>
                  <p className="text-xs text-yellow-800 leading-snug">Tip: Eat iron-rich foods with Vitamin C (like oranges) to double iron absorption!</p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Right Column - Distribution History */}
        <div>
          <Card className="bg-white h-full">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Distribution History</h3>
                <Badge className="bg-rose-100 text-rose-700 border-none">{distributionHistory.length} Records</Badge>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {distributionHistory.length > 0 ? (
                  distributionHistory.map((item, i) => (
                    <div 
                      key={i} 
                      className={`rounded-xl p-4 border flex justify-between items-center transition-all cursor-pointer hover:shadow-md ${
                        i === 0 
                          ? 'border-rose-300 bg-rose-50 ring-1 ring-rose-200' 
                          : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                      }`}
                      onClick={() => handleViewHistoryDetails(item)}
                    >
                      <div>
                        <p className="font-bold text-gray-900 text-sm mb-1">
                          {item.packets || 1} Packet{item.packets !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.distribution_date ? formatDate(item.distribution_date, 'short') : 'Date not set'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <p className={`text-sm ${i === 0 ? 'text-rose-700 font-medium' : 'text-gray-600'}`}>
                            {item.location || 'Colombo Central Clinic'}
                          </p>
                        </div>
                        <span className={`text-[10px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full ${
                          item.status === 'collected' || item.status === 'COLLECTED'
                            ? 'bg-green-100 text-green-700'
                            : i === 0 ? 'bg-rose-200 text-rose-800' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {item.status === 'collected' || item.status === 'COLLECTED' ? 'COLLECTED' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No distribution history found</p>
                    <p className="text-xs mt-1">Visit your clinic for your first distribution</p>
                  </div>
                )}
              </div>

              {/* Eligibility Reminder */}
              <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Award className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-900 text-sm">Eligibility Status</h4>
                </div>
                <p className="text-xs text-green-700 leading-relaxed">
                  {eligibility.eligible 
                    ? `You are currently eligible for ${eligibility.packets} packet${eligibility.packets !== 1 ? 's' : ''} per distribution cycle. Next eligibility review: ${new Date().getFullYear() + 1}`
                    : 'Please consult with your healthcare provider for eligibility requirements.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* History Details Modal */}
      {showHistoryModal && selectedHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Package className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Distribution Details</h2>
                  <p className="text-xs text-gray-500">Thriposha Supplement Record</p>
                </div>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Distribution Date</p>
                  <p className="font-medium text-gray-900">
                    {selectedHistory.distribution_date ? formatDate(selectedHistory.distribution_date, 'long') : 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Packets Received</p>
                  <p className="font-medium text-gray-900">{selectedHistory.packets || 1} packet(s)</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Distribution Location</p>
                  <p className="font-medium text-gray-900">{selectedHistory.location || 'Colombo Central Clinic'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <Badge className="bg-green-100 text-green-700">COLLECTED</Badge>
                </div>
              </div>
              {selectedHistory.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Additional Notes</p>
                  <p className="text-sm text-gray-700">{selectedHistory.notes}</p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <Button onClick={() => setShowHistoryModal(false)} className="bg-pink-600 text-white hover:bg-pink-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NutritionTrackerPage;