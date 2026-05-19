// frontend/src/components/common/MotherSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Syringe, 
  Users, 
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  Apple
} from 'lucide-react';

const MotherSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      path: '/mother/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/mother/health-records',
      icon: FileText,
      label: 'Health Records'
    },
    {
      path: '/mother/clinic-locator',
      icon: Calendar,
      label: 'Appointments'
    },
    {
      path: '/mother/vaccinations',
      icon: Syringe,
      label: 'Vaccination Schedule'
    },
    {
      path: '/mother/nutrition',
      icon: Apple,
      label: 'Nutrition Tracker'
    }
  ];

  const bottomMenuItems = [
    {
      path: '/help',
      icon: HelpCircle,
      label: 'Help & Support'
    },
    {
      path: '/mother/settings',
      icon: Settings,
      label: 'Settings'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/mother/dashboard') {
      return location.pathname === '/mother/dashboard' || location.pathname === '/mother/' || location.pathname === '/mother';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-screen bg-[#F8F9FA] border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Top spacing to account for fixed navbar if needed, or logo area */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <span className="text-[#006699] font-bold text-xl tracking-tight">Pearl Mom</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto mt-4">
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#EAF3FA] text-[#006699] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} className={isActive ? 'text-[#006699]' : 'text-gray-500'} />
              {!collapsed && (
                <span className="text-sm">{item.label}</span>
              )}
              {isActive && !collapsed && (
                <div className="absolute left-0 w-1.5 h-8 bg-[#006699] rounded-r-md"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 mb-6 space-y-2">
        {bottomMenuItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-[#EAF3FA] text-[#006699] font-medium' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} className={isActive ? 'text-[#006699]' : 'text-gray-500'} />
              {!collapsed && (
                <span className="text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MotherSidebar;
