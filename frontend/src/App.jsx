// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import HelpSupportPage from './pages/public/HelpSupportPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderProfileSettings from './pages/provider/ProviderProfileSettings';
import MothersListPage from './pages/provider/MothersListPage';
import ClinicVisitPage from './pages/provider/ClinicVisitPage';
import NutritionMgmtPage from './pages/provider/NutritionMgmtPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfileSettings from './pages/admin/AdminProfileSettings';
import UserSystemMgmtPage from './pages/admin/UserSystemMgmtPage';
import MotherDashboard from './pages/mother/MotherDashboard';
import EMCHCardPage from './pages/mother/EMCHCardPage';
import VaccinationSchedulerPage from './pages/mother/VaccinationSchedulerPage';
import ClinicLocatorPage from './pages/mother/ClinicLocatorPage';
import NutritionTrackerPage from './pages/mother/NutritionTrackerPage';
import MotherProfileSettings from './pages/mother/MotherProfileSettings';
import Sidebar from './components/common/Sidebar';
import AdminSidebar from './components/common/AdminSidebar';
import MotherSidebar from './components/common/MotherSidebar';
import Footer from './components/common/Footer';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import FitnessGuidePage from './pages/mother/FitnessGuidePage';
import ThriposhaStockPage from './pages/provider/ThriposhaStockPage';
import VaccineStockPage from './pages/provider/VaccineStockPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/help" element={
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <HelpSupportPage />
          </main>
          <Footer />
        </div>
      } />
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Password Reset Routes */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Protected Mother Routes */}
      <Route path="/mother/*" element={
        <ProtectedRoute allowedRoles={['mother']}>
          <MotherLayout />
        </ProtectedRoute>
      } />
      
      {/* Protected Provider Routes */}
      <Route path="/provider/*" element={
        <ProtectedRoute allowedRoles={['provider']}>
          <ProviderLayout />
        </ProtectedRoute>
      } />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Mother Layout
function MotherLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-screen z-30">
        <MotherSidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MotherDashboard />} />
            <Route path="emch-card" element={<EMCHCardPage />} />
            <Route path="vaccination" element={<VaccinationSchedulerPage />} />
            <Route path="fitness-guide" element={<FitnessGuidePage />} />
            <Route path="clinic-locator" element={<ClinicLocatorPage />} />
            <Route path="nutrition" element={<NutritionTrackerPage />} />
            <Route path="settings" element={<MotherProfileSettings />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}

// Provider Layout
function ProviderLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-screen z-30">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ProviderDashboard />} />
            <Route path="settings" element={<ProviderProfileSettings />} />
            <Route path="mothers" element={<MothersListPage />} />
            <Route path="clinic-visit" element={<ClinicVisitPage />} />
            <Route path="nutrition" element={<NutritionMgmtPage />} />
            <Route path="thriposha-stock" element={<ThriposhaStockPage />} />
            <Route path="vaccine-stock" element={<VaccineStockPage />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}

// Admin Layout
function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="fixed left-0 top-0 h-screen z-30">
        <AdminSidebar />
      </div>
      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminProfileSettings />} />
            <Route path="users" element={<UserSystemMgmtPage />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;