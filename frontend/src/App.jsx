import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFound from './components/common/NotFound';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import HelpSupportPage from './pages/public/HelpSupportPage';

// Mother Pages
import MotherDashboard from './pages/mother/MotherDashboard';
import MotherProfileSettings from './pages/mother/MotherProfileSettings';
import EMCHCardPage from './pages/mother/EMCHCardPage';
import VaccinationSchedulerPage from './pages/mother/VaccinationSchedulerPage';
import ClinicLocatorPage from './pages/mother/ClinicLocatorPage';
import NutritionTrackerPage from './pages/mother/NutritionTrackerPage';

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderProfileSettings from './pages/provider/ProviderProfileSettings';
import MothersListPage from './pages/provider/MothersListPage';
import ClinicVisitPage from './pages/provider/ClinicVisitPage';
import NutritionMgmtPage from './pages/provider/NutritionMgmtPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfileSettings from './pages/admin/AdminProfileSettings';
import UserSystemMgmtPage from './pages/admin/UserSystemMgmtPage';

function App() {
  return (
    <div className="min-h-screen bg-pearl-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/help" element={<HelpSupportPage />} />

            {/* Mother Routes */}
            <Route
              path="/mother/dashboard"
              element={
                <ProtectedRoute allowedRoles={['mother']}>
                  <MotherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mother/settings"
              element={
                <ProtectedRoute allowedRoles={['mother']}>
                  <MotherProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mother/emch-card"
              element={
                <ProtectedRoute allowedRoles={['mother']}>
                  <EMCHCardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mother/vaccination"
              element={
                <ProtectedRoute allowedRoles={['mother']}>
                  <VaccinationSchedulerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mother/clinic-locator"
              element={
                <ProtectedRoute allowedRoles={['mother']}>
                  <ClinicLocatorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mother/nutrition"
              element={
                <ProtectedRoute allowedRoles={['mother']}>
                  <NutritionTrackerPage />
                </ProtectedRoute>
              }
            />

            {/* Provider Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/settings"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ProviderProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/mothers"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <MothersListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/clinic-visit"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <ClinicVisitPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/nutrition"
              element={
                <ProtectedRoute allowedRoles={['provider']}>
                  <NutritionMgmtPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserSystemMgmtPage />
                </ProtectedRoute>
              }
            />

            {/* Profile Settings - Shared */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['mother', 'provider', 'admin']}>
                  <MotherProfileSettings />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;