// frontend/src/components/common/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  Settings,
  Shield,
  HelpCircle
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'System Overview'
    },
    {
      path: '/admin/users',
      icon: Users,
      label: 'User & System',
      description: 'Management'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin/' || location.pathname === '/admin';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/admin/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
            <Shield className="text-white" size={18} />
          </div>
          <span className="font-semibold text-gray-800">PearlMom Admin</span>
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
          {location.pathname === '/help' && (
            <div className="w-1.5 h-8 bg-pink-500 rounded-full"></div>
          )}
        </Link>

        {/* Admin Settings */}
        <Link
          to="/admin/settings"
          className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
            isActiveRoute('/admin/settings')
              ? 'bg-pink-50 text-pink-600 shadow-sm'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings size={20} className={isActiveRoute('/admin/settings') ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'} />
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium">Admin Settings</span>
            <span className="text-xs text-gray-400">Profile & Security</span>
          </div>
          {isActiveRoute('/admin/settings') && (
            <div className="w-1.5 h-8 bg-pink-500 rounded-full"></div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;