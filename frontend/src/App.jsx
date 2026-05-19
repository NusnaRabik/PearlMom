import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import HelpSupportPage from './pages/public/HelpSupportPage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderProfileSettings from './pages/provider/ProviderProfileSettings';
import MothersListPage from './pages/provider/MothersListPage';
import ClinicVisitPage from './pages/provider/ClinicVisitPage';
import NutritionMgmtPage from './pages/provider/NutritionMgmtPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfileSettings from './pages/admin/AdminProfileSettings';
import UserSystemMgmtPage from './pages/admin/UserSystemMgmtPage';
import Sidebar from './components/common/Sidebar';
import AdminSidebar from './components/common/AdminSidebar';
import Footer from './components/common/Footer';
import MotherSidebar from './components/common/MotherSidebar';
import MotherNavbar from './components/common/MotherNavbar';
import MotherDashboard from './pages/mother/MotherDashboard';
import EMCHCardPage from './pages/mother/EMCHCardPage';
import ClinicLocatorPage from './pages/mother/ClinicLocatorPage';
import MotherProfileSettings from './pages/mother/MotherProfileSettings';
import NutritionTrackerPage from './pages/mother/NutritionTrackerPage';
import VaccinationSchedulerPage from './pages/mother/VaccinationSchedulerPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          
          {/* Provider Routes with Sidebar Layout */}
          <Route path="/provider/*" element={<ProviderLayout />} />
          
          {/* Admin Routes with Sidebar Layout */}
          <Route path="/admin/*" element={<AdminLayout />} />
          
          {/* Mother Routes with Layout */}
          <Route path="/mother/*" element={<MotherLayout />} />
        </Routes>
      </div>
    </Router>
  );
}

function ProviderLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Fixed on left */}
      <div className="fixed left-0 top-0 h-screen z-30">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="settings" element={<ProviderProfileSettings />} />
            <Route path="mothers" element={<MothersListPage />} />
            <Route path="clinic-visit" element={<ClinicVisitPage />} />
            <Route path="nutrition" element={<NutritionMgmtPage />} />
          </Routes>
          
          {/* Footer at the bottom of content */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Admin Sidebar - Fixed on left */}
      <div className="fixed left-0 top-0 h-screen z-30">
        <AdminSidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminProfileSettings />} />
            <Route path="users" element={<UserSystemMgmtPage />} />
          </Routes>
          
          {/* Footer at the bottom of content */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;

function MotherLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      <MotherNavbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="z-30 h-full">
          <MotherSidebar />
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MotherDashboard />} />
            <Route path="health-records" element={<EMCHCardPage />} />
            <Route path="clinic-locator" element={<ClinicLocatorPage />} />
            <Route path="vaccinations" element={<VaccinationSchedulerPage />} />
            <Route path="nutrition" element={<NutritionTrackerPage />} />
            <Route path="settings" element={<MotherProfileSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
