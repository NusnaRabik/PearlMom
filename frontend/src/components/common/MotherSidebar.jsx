// frontend/src/components/common/MotherSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Heart,
  Syringe,
  MapPin,
  Apple,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-react';

const MotherSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/mother/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'My Health Overview'
    },
    {
      path: '/mother/emch-card',
      icon: Heart,
      label: 'EMCH Card',
      description: 'Digital Health Record'
    },
    {
      path: '/mother/vaccination',
      icon: Syringe,
      label: 'Vaccination',
      description: 'Schedule & Reminders'
    },
        {
      path: '/mother/nutrition',
      icon: Apple,
      label: 'Nutrition Tracker',
      description: 'Diet & Wellness'
    },
    {
      path: '/mother/fitness-guide',
      icon: Activity,
      label: 'Fitness Guide',
      description: 'Exercises & Wellness'
    },
    {
      path: '/mother/clinic-locator',
      icon: MapPin,
      label: 'Clinic Locator',
      description: 'Find Nearby Clinics'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/mother/dashboard') {
      return location.pathname === '/mother/dashboard' || location.pathname === '/mother/' || location.pathname === '/mother';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/mother/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <Heart className="text-white" size={18} />
          </div>
          <span className="font-semibold text-gray-800">PearlMom</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-pink-50 text-pink-600 shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'} />
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-gray-400">{item.description}</span>
              </div>
              {isActive && (
                <div className="w-1.5 h-8 bg-pink-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {/* Help & Support */}
        <Link
          to="/help"
          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
            location.pathname === '/help'
              ? 'bg-pink-50 text-pink-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <HelpCircle size={20} className={location.pathname === '/help' ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'} />
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium">Help & Support</span>
            <span className="text-xs text-gray-400">FAQs & Contact</span>
          </div>
        </Link>

        {/* Settings */}
        <Link
          to="/mother/settings"
          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
            isActiveRoute('/mother/settings')
              ? 'bg-pink-50 text-pink-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings size={20} className={isActiveRoute('/mother/settings') ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'} />
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium">Settings</span>
            <span className="text-xs text-gray-400">Profile & Preferences</span>
          </div>
          {isActiveRoute('/mother/settings') && (
            <div className="w-1.5 h-8 bg-pink-500 rounded-full"></div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default MotherSidebar;