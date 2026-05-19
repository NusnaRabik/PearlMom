// frontend/src/components/profile/SecurityLogs.jsx
import React from 'react';
import { Monitor, Smartphone, Tablet, Clock, MapPin, Globe } from 'lucide-react';

const SecurityLogs = ({ logs = [] }) => {
  const defaultLogs = [
    { device: 'MacBook Pro', browser: 'Chrome 120', location: 'Colombo, Sri Lanka', ip: '192.168.1.1', time: 'Current Session', icon: Monitor, status: 'active' },
    { device: 'iPad Pro', browser: 'Safari 17', location: 'Colombo, Sri Lanka', ip: '192.168.1.2', time: '2 hours ago', icon: Tablet, status: 'expired' },
    { device: 'iPhone 15', browser: 'PearlMom App', location: 'Kandy, Sri Lanka', ip: '10.0.0.1', time: 'Yesterday, 09:15', icon: Smartphone, status: 'expired' },
    { device: 'Windows PC', browser: 'Edge 120', location: 'Galle, Sri Lanka', ip: '172.16.0.1', time: 'Dec 15, 2024, 14:30', icon: Monitor, status: 'terminated' }
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-600';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-pink-600" />
          Security Logs & Active Sessions
        </h2>
        <button className="text-sm font-medium text-pink-600 hover:text-pink-700">
          Log out all other sessions
        </button>
      </div>

      <div className="space-y-2">
        {displayLogs.map((log, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-xl border ${
            log.status === 'active' ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
          } transition-colors`}>
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${
                log.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'
              }`}>
                <log.icon size={18} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900">{log.device}</p>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                    {log.status === 'active' ? 'Active Now' : log.status === 'expired' ? 'Expired' : 'Terminated'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{log.browser}</p>
                <div className="flex items-center space-x-3 mt-1.5">
                  <span className="text-xs text-gray-400 flex items-center">
                    <MapPin size={12} className="mr-1" /> {log.location}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center">
                    <Globe size={12} className="mr-1" /> {log.ip}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">{log.time}</p>
              {log.status !== 'active' && (
                <button className="text-xs text-red-500 hover:text-red-600 font-medium mt-1">
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-center text-sm text-pink-600 hover:text-pink-700 font-medium">
        View Full Security Audit →
      </button>
    </div>
  );
};

export default SecurityLogs;