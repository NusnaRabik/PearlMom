import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Calendar, Syringe, Users, HelpCircle, Settings, Shield } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Health Records', path: '/emch', icon: FileText },
    { name: 'Appointments', path: '/clinic-locator', icon: Calendar },
    { name: 'Vaccination Schedule', path: '/vaccinations', icon: Syringe },
    { name: 'Nutrition', path: '/nutrition', icon: Shield }, // Map image 4 here
  ];

  const bottomItems = [
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={cn(
      "w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-64px)] fixed top-16 left-0 overflow-y-auto z-20 transition-transform duration-300 md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-sky-50 text-[#0369a1]'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-sky-50 text-[#0369a1]'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
