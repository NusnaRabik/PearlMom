// frontend/src/components/common/AdminSidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  Settings,
  Shield,
  ChevronLeft,
  Menu,
  LogOut,
  Bell,
  Activity,
  Database
} from 'lucide-react';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
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
    },
    {
      path: '/admin/settings',
      icon: Settings,
      label: 'Admin Settings',
      description: 'Profile & Security'
    }
  ];

  const isActiveRoute = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin/' || location.pathname === '/admin';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        {collapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <Link to="/admin/dashboard" className="flex items-center justify-center">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={18} />
              </div>
              <span className="font-semibold text-gray-800">PearlMom Admin</span>
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        )}
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
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} className={isActive ? 'text-pink-600' : 'text-gray-400 group-hover:text-gray-600'} />
              {!collapsed && (
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </div>
              )}
              {isActive && !collapsed && (
                <div className="w-1.5 h-8 bg-pink-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Activity size={14} className="text-green-500" />
            <span>System Operational</span>
          </div>
          <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
            <Database size={14} className="text-pink-500" />
            <span>1,284 Records</span>
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600">
          <Bell size={20} />
          {!collapsed && (
            <>
              <span className="text-sm">Notifications</span>
              <span className="ml-auto bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">5</span>
            </>
          )}
        </button>
        <Link
          to="/"
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm">Logout</span>}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;