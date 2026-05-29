import React, { useState, useEffect } from 'react';
import { 
  Calculator, Package, FileText, Download, TrendingUp, 
  ChevronRight, CheckCircle, X, User, Calendar, Phone, 
  MapPin, Activity, Heart, Info, Plus, Loader, Search, AlertCircle
} from 'lucide-react';
import ThriposhaCriteria from '../../components/provider/ThriposhaCriteria';
import api from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ProviderChatWidget from '../../components/provider/ProviderChatWidget';

const NutritionMgmtPage = () => {
  const [pregnancyWeek, setPregnancyWeek] = useState('');
  const [bmi, setBmi] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherId, setMotherId] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showNewDistribution, setShowNewDistribution] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentLogs, setRecentLogs] = useState([]);
  const [eligibleMothers, setEligibleMothers] = useState([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // New Distribution Form
  const [newDistribution, setNewDistribution] = useState({
    recipientName: '',
    recipientId: '',
    dateOfIssue: '',
    packets: '1'
  });
  const [distributionSuccess, setDistributionSuccess] = useState(false);

  // Fetch recent distributions and eligible mothers on load
  useEffect(() => {
    fetchRecentDistributions();
    fetchEligibleMothers();
  }, []);

  const fetchRecentDistributions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/thriposha/distributions');
      if (response.data.success) {
        const data = response.data.data;
        
        const formattedLogs = (data.recent_distributions || []).map(dist => ({
          id: dist.id,
          name: dist.name,
          motherId: dist.motherId,
          week: dist.week,
          packets: dist.packets,
          date: dist.date,
          bmi: dist.bmi,
          phone: dist.phone,
          address: dist.address,
          status: dist.status,
          lastDistribution: dist.lastDistribution,
          notes: dist.notes
        }));
        setRecentLogs(formattedLogs);
      }
    } catch (error) {
      console.error('Error fetching distributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleMothers = async () => {
    try {
      const response = await api.get('/thriposha/eligible-mothers');
      if (response.data.success) {
        setEligibleMothers(response.data.data.eligible_mothers || []);
      }
    } catch (error) {
      console.error('Error fetching eligible mothers:', error);
    }
  };

  // Search for mother eligibility
  const handleSearchMother = async () => {
    if (!searchTerm.trim()) {
      setSearchError('Please enter Mother ID or Full Name');
      setSearchResult(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResult(null);

    try {
      // First, fetch all eligible mothers
      const eligibleResponse = await api.get('/thriposha/eligible-mothers');
      const allEligibleMothers = eligibleResponse.data.data?.eligible_mothers || [];
      
      // Search for mother by ID or name
      const foundMother = allEligibleMothers.find(
        mother => mother.motherId?.toLowerCase() === searchTerm.toLowerCase() ||
                  mother.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (foundMother) {
        setSearchResult({
          found: true,
          eligible: true,
          mother: foundMother,
          message: `${foundMother.name} (ID: ${foundMother.motherId}) is ELIGIBLE for Thriposha program.`
        });
      } else {
        // Check if mother exists but not eligible
        try {
          const allMothersResponse = await api.get('/providers/mothers');
          const allMothers = allMothersResponse.data.data?.mothers || [];
          const existingMother = allMothers.find(
            mother => mother.mother_code?.toLowerCase() === searchTerm.toLowerCase() ||
                      mother.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
          if (existingMother) {
            setSearchResult({
              found: true,
              eligible: false,
              mother: {
                name: existingMother.full_name,
                motherId: existingMother.mother_code
              },
              message: `${existingMother.full_name} (ID: ${existingMother.mother_code}) is NOT ELIGIBLE for Thriposha program. Please check BMI and pregnancy criteria.`
            });
          } else {
            setSearchResult({
              found: false,
              eligible: false,
              mother: null,
              message: `No mother found with ID or Name: "${searchTerm}". Please check the information and try again.`
            });
          }
        } catch (error) {
          setSearchResult({
            found: false,
            eligible: false,
            mother: null,
            message: `No mother found with ID or Name: "${searchTerm}".`
          });
        }
      }
    } catch (error) {
      console.error('Error searching mother:', error);
      setSearchError('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    setSearchError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchMother();
    }
  };

  const calculateEligibility = async () => {
    if (!motherName || !motherId || !pregnancyWeek || !bmi) {
      setEligibilityResult({
        eligible: false,
        packets: 0,
        message: 'Please fill in all fields: Mother Name, ID, Pregnancy Week, and BMI.',
        icon: 'warning',
        color: 'yellow'
      });
      return;
    }

    setIsCalculating(true);
    
    try {
      const response = await api.post('/thriposha/assess', {
        mother_id: motherId,
        gestational_week: parseInt(pregnancyWeek),
        mother_weight_kg: null,
        notes: `BMI: ${bmi}, Week: ${pregnancyWeek}`
      });

      if (response.data.success) {
        const result = response.data.data;
        let packets = 1;
        let message = '';
        
        if (parseFloat(bmi) < 18.5) {
          packets = 2;
          message = 'Based on current parameters (Underweight), this mother qualifies for 2 packets per distribution cycle.';
        } else if (parseFloat(bmi) >= 30) {
          packets = 2;
          message = 'Based on current parameters (Obese), this mother qualifies for 2 packets per distribution cycle.';
        } else if (parseFloat(bmi) >= 18.5 && parseFloat(bmi) <= 24.9) {
          packets = 1;
          message = 'Based on current parameters (Normal BMI), this mother qualifies for 1 packet per distribution cycle.';
        } else {
          packets = 1;
          message = 'Based on current parameters, this mother qualifies for 1 packet per distribution cycle.';
        }

        setEligibilityResult({
          eligible: result.is_eligible,
          packets: packets,
          message: message,
          icon: 'success',
          color: 'green'
        });
        
        await fetchEligibleMothers();
      }
    } catch (error) {
      console.error('Error calculating eligibility:', error);
      setEligibilityResult({
        eligible: false,
        packets: 0,
        message: error.response?.data?.message || 'Error calculating eligibility. Please try again.',
        icon: 'warning',
        color: 'yellow'
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  const handleDistribute = async () => {
    if (!eligibilityResult?.eligible) return;
    
    try {
      const response = await api.post('/thriposha/distribute', {
        mother_id: motherId,
        packets: eligibilityResult.packets,
        distribution_date: new Date().toISOString().split('T')[0],
        notes: `Thriposha distribution - ${eligibilityResult.packets} packet(s)`
      });

      if (response.data.success) {
        alert(`Successfully distributed ${eligibilityResult.packets} packet(s) to ${motherName}`);
        
        setMotherName('');
        setMotherId('');
        setPregnancyWeek('');
        setBmi('');
        setEligibilityResult(null);
        
        await fetchRecentDistributions();
        await fetchEligibleMothers();
      }
    } catch (error) {
      console.error('Distribution error:', error);
      alert(error.response?.data?.message || 'Failed to distribute');
    }
  };

  const handleAddDistribution = async () => {
    if (!newDistribution.recipientName || !newDistribution.recipientId) {
      alert('Please fill in recipient name and ID');
      return;
    }

    try {
      const response = await api.post('/thriposha/distribute', {
        mother_id: newDistribution.recipientId,
        packets: parseInt(newDistribution.packets),
        distribution_date: newDistribution.dateOfIssue || new Date().toISOString().split('T')[0],
        notes: `Thriposha distribution - ${newDistribution.packets} packet(s)`
      });

      if (response.data.success) {
        setDistributionSuccess(true);
        await fetchRecentDistributions();
        await fetchEligibleMothers();
        
        setTimeout(() => {
          setShowNewDistribution(false);
          setDistributionSuccess(false);
          setNewDistribution({
            recipientName: '',
            recipientId: '',
            dateOfIssue: '',
            packets: '1'
          });
        }, 1500);
      } else {
        alert(response.data.message || 'Failed to record distribution');
      }
    } catch (error) {
      console.error('Distribution error:', error);
      alert(error.response?.data?.message || 'Failed to record distribution');
    }
  };

  // Fixed PDF Download Function
  const handleDownloadReport = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const primaryColor = [219, 39, 119];
      const today = new Date();
      
      // Header
      doc.setFillColor(253, 242, 248);
      doc.rect(0, 0, pageWidth, 45, 'F');
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('Pearl Mom', 20, 20);
      doc.setFontSize(13);
      doc.setTextColor(31, 41, 55);
      doc.text('Thriposha Monthly Distribution Report', 20, 32);
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated: ${today.toLocaleString()}`, pageWidth - 45, 20);
      doc.line(20, 50, pageWidth - 20, 50);
      
      let yPos = 65;
      
      // Report Summary
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Report Summary', 20, yPos);
      yPos += 8;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(`Report Period: ${today.toLocaleString('default', { month: 'long', year: 'numeric' })}`, 20, yPos);
      yPos += 6;
      doc.text(`Total Eligible Mothers: ${eligibleMothers.length}`, 20, yPos);
      yPos += 6;
      doc.text(`Total Distributions This Month: ${recentLogs.length}`, 20, yPos);
      yPos += 6;
      
      // Calculate total packets distributed
      const totalPackets = recentLogs.reduce((sum, log) => sum + (log.packets || 1), 0);
      doc.text(`Total Packets Distributed: ${totalPackets}`, 20, yPos);
      yPos += 15;
      
      // Eligible Mothers Table
      if (eligibleMothers.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Eligible Mothers', 20, yPos);
        yPos += 8;
        
        const eligibleTableData = eligibleMothers.slice(0, 20).map(mother => [
          mother.name || 'N/A',
          mother.motherId || 'N/A',
          mother.week || 'N/A',
          mother.bmi || 'N/A',
          mother.packets?.toString() || '1'
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Name', 'Mother ID', 'Week', 'BMI', 'Packets']],
          body: eligibleTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 20 },
          width: pageWidth - 40
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // Recent Distributions Table
      if (recentLogs.length > 0) {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        doc.text('Recent Distributions', 20, yPos);
        yPos += 8;
        
        const distributionsTableData = recentLogs.slice(0, 20).map(log => [
          log.name || 'N/A',
          log.motherId || 'N/A',
          log.date || 'N/A',
          log.packets?.toString() || '1',
          log.status || 'Active'
        ]);
        
        autoTable(doc, {
          startY: yPos,
          head: [['Name', 'Mother ID', 'Date', 'Packets', 'Status']],
          body: distributionsTableData,
          theme: 'striped',
          headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 9 },
          bodyStyles: { fontSize: 8 },
          margin: { left: 20 },
          width: pageWidth - 40
        });
        
        yPos = doc.lastAutoTable.finalY + 10;
      }
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(`Pearl Mom Thriposha Report - Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
        doc.text(`© ${today.getFullYear()} PearlMom. All rights reserved.`, pageWidth / 2, doc.internal.pageSize.getHeight() - 5, { align: 'center' });
      }
      
      doc.save(`Thriposha_Report_${today.toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  if (loading && recentLogs.length === 0) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-pink-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6 space-y-6 pb-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"><div>
          <div className="flex items-center gap-4 mb-3">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Nutrition & Wellness
              </h1>

              <p className="text-gray-500 mt-1">
                Maternal nutrition monitoring and Thriposha management
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
              Thriposha Program
            </span>

            <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {eligibleMothers.length} Eligible Mothers
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowNewDistribution(true)}
          className="
            px-5 py-3
            bg-pink-600 text-white
            rounded-2xl
            flex items-center gap-2
          "
        >
          <Plus size={18} />
          New Distribution
        </button>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-pink-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Search className="mr-2 text-pink-500" size={20} />
            Check Mother Eligibility
          </h2>
          <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">
            Search by ID or Name
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">Search for a mother to check if they are eligible for the Thriposha program.</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Mother ID (e.g., MOM-26-0009) or Full Name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          <button
            onClick={handleSearchMother}
            disabled={isSearching}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
          >
            {isSearching ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
            {isSearching ? 'Searching...' : 'Check Eligibility'}
          </button>
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Search Result Display */}
        {searchError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-500" />
              <p className="text-sm text-red-700">{searchError}</p>
            </div>
          </div>
        )}

        {searchResult && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            searchResult.eligible 
              ? 'bg-green-50 border-green-300' 
              : searchResult.found 
                ? 'bg-yellow-50 border-yellow-300'
                : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-start space-x-3">
              {searchResult.eligible ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-white" />
                </div>
              ) : searchResult.found ? (
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle size={16} className="text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <X size={16} className="text-white" />
                </div>
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  searchResult.eligible ? 'text-green-800' : 
                  searchResult.found ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {searchResult.message}
                </p>
                {searchResult.mother && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Mother ID:</span> {searchResult.mother.motherId}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Full Name:</span> {searchResult.mother.name}
                    </div>
                    {searchResult.mother.week && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Pregnancy Week:</span> {searchResult.mother.week}
                      </div>
                    )}
                    {searchResult.mother.bmi && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">BMI:</span> {searchResult.mother.bmi}
                      </div>
                    )}
                    {searchResult.eligible && searchResult.mother.packets && (
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Recommended Packets:</span> {searchResult.mother.packets}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Eligibility Calculator */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-pink-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Calculator className="mr-3 text-pink-500" size={24} />
                Eligibility Calculator
              </h2>
              <span className="px-3 py-1 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">
                Thriposha Program
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6">Quick validation for nutritional support programs. Enter mother's details below.</p>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOTHER'S FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g., Nadeesha Lakmali Silva"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MOTHER'S ID (Mother Code)</label>
                <input
                  type="text"
                  placeholder="e.g., MOM-26-0009"
                  value={motherId}
                  onChange={(e) => setMotherId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PREGNANCY WEEK</label>
                <input
                  type="number"
                  placeholder="e.g., 24"
                  value={pregnancyWeek}
                  onChange={(e) => setPregnancyWeek(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BODY MASS INDEX (BMI)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 22.8"
                  value={bmi}
                  onChange={(e) => setBmi(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <p className="text-xs text-gray-400 mt-1">Normal BMI range: 18.5 - 24.9</p>
              </div>
              <button
                onClick={calculateEligibility}
                disabled={isCalculating}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isCalculating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-pink-600 text-white hover:bg-pink-700'
                }`}
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Calculating...
                  </span>
                ) : (
                  'Calculate Eligibility'
                )}
              </button>
            </div>

            {/* Eligibility Result */}
            {eligibilityResult && (
              <div className={`mt-6 p-6 rounded-lg border-2 ${
                eligibilityResult.color === 'green' 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-yellow-50 border-yellow-300'
              }`}>
                <div className="flex items-center space-x-3 mb-3">
                  {eligibilityResult.eligible ? (
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-white" size={24} />
                    </div>
                  ) : (
                    <Info className="text-yellow-500" size={24} />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {eligibilityResult.eligible ? 'Eligible for Thriposha' : 'Information Required'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">{eligibilityResult.message}</p>
                {eligibilityResult.eligible && (
                  <>
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Recommended Packets:</span>
                        <span className="text-2xl font-bold text-pink-600">{eligibilityResult.packets}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Distribution Cycle:</span>
                        <span className="text-sm font-medium text-gray-900">Monthly</span>
                      </div>
                    </div>
                    <button
                      onClick={handleDistribute}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Confirm & Distribute Now
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Thriposha Criteria */}
          <div className="mt-4">
            <ThriposhaCriteria />
          </div>
        </div>

        {/* Distribution Log */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Package className="mr-2 text-pink-500" size={20} />
              Quick Distribution Log
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient Name/ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assessment Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">BMI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Packets</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {eligibleMothers.slice(0, 10).map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{log.name}</p>
                          <p className="text-xs text-gray-500">{log.motherId} • {log.week}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-500">{log.assessedDate}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{log.bmi}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.packets === 2 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.packets} {log.packets === 1 ? 'PACKET' : 'PACKETS'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button 
                          onClick={() => handleViewDetails(log)}
                          className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {eligibleMothers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm">No eligible mothers found yet</p>
              </div>
            )}
          </div>

          {/* Reports & Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="mr-2 text-pink-500" size={20} />
              Reports & Insights
            </h2>
            <p className="text-sm text-gray-500 mb-4">Generate compliant documentation for ministry review.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <button 
                onClick={handleDownloadReport}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-pink-300 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={20} className="text-pink-400" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">Monthly Distribution Report</p>
                    <p className="text-xs text-gray-500">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} - Download PDF</p>
                  </div>
                </div>
                <Download size={16} className="text-pink-500" />
              </button>
            </div>
          </div>

          {/* Recent Logs Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Logs</h2>
            <div className="space-y-3">
              {recentLogs.slice(0, 5).map((log, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleViewDetails(log)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <User size={18} className="text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.name}</p>
                      <p className="text-xs text-gray-500">{log.motherId} - {log.week}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-gray-400">{log.date}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.packets === 2 ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.packets} Packets
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Distribution Modal */}
      {showNewDistribution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Package className="h-5 w-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">New Distribution</h2>
              </div>
              <button
                onClick={() => setShowNewDistribution(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {distributionSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Distribution Recorded!</h3>
                  <p className="text-sm text-gray-500">The new distribution has been added to the log.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Nadeesha Lakmali Silva"
                      value={newDistribution.recipientName}
                      onChange={(e) => setNewDistribution({...newDistribution, recipientName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipient ID (Mother Code)</label>
                    <input
                      type="text"
                      placeholder="e.g., MOM-26-0009"
                      value={newDistribution.recipientId}
                      onChange={(e) => setNewDistribution({...newDistribution, recipientId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Issue</label>
                    <input
                      type="date"
                      value={newDistribution.dateOfIssue}
                      onChange={(e) => setNewDistribution({...newDistribution, dateOfIssue: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Packets</label>
                    <select
                      value={newDistribution.packets}
                      onChange={(e) => setNewDistribution({...newDistribution, packets: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    >
                      <option value="1">01 Packet</option>
                      <option value="2">02 Packets</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {!distributionSuccess && (
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setShowNewDistribution(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddDistribution}
                  disabled={!newDistribution.recipientName || !newDistribution.recipientId}
                  className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${
                    !newDistribution.recipientName || !newDistribution.recipientId
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-pink-600 hover:bg-pink-700'
                  }`}
                >
                  Add Distribution
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Distribution Details</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-semibold text-pink-600">
                    {selectedLog.name?.split(' ').map(n => n[0]).join('') || 'M'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedLog.name}</h3>
                  <p className="text-sm text-gray-500">{selectedLog.motherId}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    selectedLog.status === 'High Risk' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedLog.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Pregnancy Week</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.week}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">BMI</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.bmi}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Phone</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Package size={16} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Packets</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.packets} Packets</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Address</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{selectedLog.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Last Distribution</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedLog.lastDistribution}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 font-medium mb-1">Next Eligible</p>
                  <p className="text-sm font-semibold text-gray-900">30 days from last distribution</p>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <Info size={16} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-600 font-medium mb-1">Clinical Notes</p>
                    <p className="text-sm text-gray-700">{selectedLog.notes || 'Regular Thriposha distribution'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ProviderChatWidget />
    </div>
  );
};

export default NutritionMgmtPage;