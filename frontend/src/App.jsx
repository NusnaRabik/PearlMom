import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Page Imports
import MotherDashboard from './pages/mother/MotherDashboard';
import EMCHCardPage from './pages/mother/EMCHCardPage';
import VaccinationSchedulerPage from './pages/mother/VaccinationSchedulerPage';
import ClinicLocatorPage from './pages/mother/ClinicLocatorPage';
import NutritionTrackerPage from './pages/mother/NutritionTrackerPage';
import MotherProfileSettings from './pages/mother/MotherProfileSettings';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 pt-16">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        <main className="flex-1 md:ml-64 p-4 md:p-8 bg-gray-50/30 min-h-[calc(100vh-64px)] w-full">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-10 md:hidden mt-16" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MotherDashboard />} />
          <Route path="/emch" element={<EMCHCardPage />} />
          <Route path="/vaccinations" element={<VaccinationSchedulerPage />} />
          <Route path="/clinic-locator" element={<ClinicLocatorPage />} />
          <Route path="/nutrition" element={<NutritionTrackerPage />} />
          <Route path="/settings" element={<MotherProfileSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
