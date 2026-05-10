// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
// import RegisterPage from './pages/public/RegisterPage';
// import LoginPage from './pages/public/LoginPage';
// import HelpSupportPage from './pages/public/HelpSupportPage';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderProfileSettings from './pages/provider/ProviderProfileSettings';
import MothersListPage from './pages/provider/MothersListPage';
import ClinicVisitPage from './pages/provider/ClinicVisitPage';
import NutritionMgmtPage from './pages/provider/NutritionMgmtPage';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/help" element={<HelpSupportPage />} /> */}
          
          {/* Provider Routes with Sidebar Layout */}
          <Route path="/provider/*" element={<ProviderLayout />} />
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
            <Route path="/" element={<ProviderDashboard />} />
            <Route path="/dashboard" element={<ProviderDashboard />} />
            <Route path="/settings" element={<ProviderProfileSettings />} />
            <Route path="/mothers" element={<MothersListPage />} />
            <Route path="/clinic-visit" element={<ClinicVisitPage />} />
            <Route path="/nutrition" element={<NutritionMgmtPage />} />
          </Routes>
          
          {/* Footer at the bottom of content */}
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default App;