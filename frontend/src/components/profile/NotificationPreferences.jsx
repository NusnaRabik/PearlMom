// frontend/src/components/profile/NotificationPreferences.jsx
import React, { useState } from 'react';
import { Bell, Mail, Smartphone, MessageSquare } from 'lucide-react';

const NotificationPreferences = ({ preferences = {}, onUpdate }) => {
  const [prefs, setPrefs] = useState({
    emailNotifications: preferences.emailNotifications ?? true,
    smsAlerts: preferences.smsAlerts ?? true,
    inAppNotifications: preferences.inAppNotifications ?? true,
    newAppointments: preferences.newAppointments ?? true,
    vaccinationReminders: preferences.vaccinationReminders ?? true,
    labResults: preferences.labResults ?? true,
    systemAnnouncements: preferences.systemAnnouncements ?? false,
    reminderTiming: preferences.reminderTiming ?? '1day'
  });

  const handleToggle = (key) => {
    const newPrefs = { ...prefs, [key]: !prefs[key] };
    setPrefs(newPrefs);
    onUpdate?.(newPrefs);
  };

  const handleTimingChange = (value) => {
    const newPrefs = { ...prefs, reminderTiming: value };
    setPrefs(newPrefs);
    onUpdate?.(newPrefs);
  };

  const channels = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Weekly health summaries and reports', icon: Mail, color: 'pink' },
    { key: 'smsAlerts', label: 'SMS Alerts', description: 'Critical health alerts and reminders', icon: Smartphone, color: 'blue' },
    { key: 'inAppNotifications', label: 'In-App Notifications', description: 'Real-time updates within the app', icon: Bell, color: 'green' },
  ];

  const alertTypes = [
    { key: 'newAppointments', label: 'New Appointments', description: 'When appointments are scheduled or changed' },
    { key: 'vaccinationReminders', label: 'Vaccination Reminders', description: 'Upcoming and overdue vaccination alerts' },
    { key: 'labResults', label: 'Lab Results', description: 'When new test results are available' },
    { key: 'systemAnnouncements', label: 'System Announcements', description: 'Important updates from PearlMom' },
  ];

  const timingOptions = [
    { value: '1hour', label: '1 hour before' },
    { value: '1day', label: '1 day before' },
    { value: '2days', label: '2 days before' },
    { value: '1week', label: '1 week before' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Bell className="h-5 w-5 mr-2 text-pink-600" />
        Notification Preferences
      </h2>

      {/* Communication Channels */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Communication Channels</h3>
        <div className="space-y-3">
          {channels.map((channel) => (
            <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-200 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-${channel.color}-50 text-${channel.color}-600`}>
                  <channel.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{channel.label}</p>
                  <p className="text-xs text-gray-500">{channel.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle(channel.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  prefs[channel.key] ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  prefs[channel.key] ? 'left-6' : 'left-0.5'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Types */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Alert Types</h3>
        <div className="space-y-3">
          {alertTypes.map((alert) => (
            <div key={alert.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-pink-200 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{alert.label}</p>
                <p className="text-xs text-gray-500">{alert.description}</p>
              </div>
              <button
                onClick={() => handleToggle(alert.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  prefs[alert.key] ? 'bg-pink-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  prefs[alert.key] ? 'left-6' : 'left-0.5'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Reminder Timing */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Reminder Timing</h3>
        <div className="flex flex-wrap gap-2">
          {timingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleTimingChange(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                prefs.reminderTiming === option.value
                  ? 'bg-pink-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;