// frontend/src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create Notification Context
const NotificationContext = createContext(null);

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsAlerts: true,
    inAppNotifications: true,
    reminderTiming: 'morning', // morning, afternoon, evening
    criticalAlerts: true,
    appointmentReminders: true,
    vaccinationReminders: true,
    labResultAlerts: true
  });

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
    loadAlerts();
    loadPreferences();
  }, []);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  // Load notifications from localStorage or API
  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('pearlmom_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Default sample notifications
        const defaultNotifications = [
          {
            id: 1,
            type: 'appointment',
            title: 'Upcoming Appointment',
            message: 'Your next prenatal checkup is scheduled for Nov 24, 2024 at 10:30 AM.',
            time: '2 hours ago',
            read: false,
            priority: 'high',
            icon: 'Calendar'
          },
          {
            id: 2,
            type: 'vaccination',
            title: 'Vaccination Due',
            message: 'TDAP Booster vaccination is due by Week 30.',
            time: '1 day ago',
            read: false,
            priority: 'medium',
            icon: 'Syringe'
          },
          {
            id: 3,
            type: 'lab',
            title: 'Lab Results Available',
            message: 'Your recent blood test results are now available to view.',
            time: '2 days ago',
            read: true,
            priority: 'medium',
            icon: 'FileText'
          },
          {
            id: 4,
            type: 'nutrition',
            title: 'Nutrition Tip',
            message: 'Remember to include iron-rich foods in your diet for healthy blood levels.',
            time: '3 days ago',
            read: true,
            priority: 'low',
            icon: 'Apple'
          },
          {
            id: 5,
            type: 'system',
            title: 'Clinic Schedule Update',
            message: 'The Friday clinic will now start at 8:00 AM instead of 9:00 AM.',
            time: '4 days ago',
            read: true,
            priority: 'low',
            icon: 'Info'
          }
        ];
        setNotifications(defaultNotifications);
        localStorage.setItem('pearlmom_notifications', JSON.stringify(defaultNotifications));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Load alerts from localStorage
  const loadAlerts = () => {
    try {
      const stored = localStorage.getItem('pearlmom_alerts');
      if (stored) {
        setAlerts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  };

  // Load preferences from localStorage
  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem('pearlmom_notification_prefs');
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications) => {
    localStorage.setItem('pearlmom_notifications', JSON.stringify(updatedNotifications));
  };

  // Save preferences to localStorage
  const savePreferences = (updatedPreferences) => {
    localStorage.setItem('pearlmom_notification_prefs', JSON.stringify(updatedPreferences));
  };

  // Add new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: 'Just now',
      read: false,
      ...notification
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50); // Keep max 50
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Add alert
  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now(),
      time: new Date().toISOString(),
      ...alert
    };
    
    setAlerts(prev => {
      const updated = [newAlert, ...prev].slice(0, 20);
      localStorage.setItem('pearlmom_alerts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== notificationId);
      saveNotifications(updated);
      return updated;
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  // Dismiss alert
  const dismissAlert = (alertId) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== alertId);
      localStorage.setItem('pearlmom_alerts', JSON.stringify(updated));
      return updated;
    });
  };

  // Update notification preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      savePreferences(updated);
      return updated;
    });
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.read);
  };

  // Get high priority notifications
  const getHighPriorityNotifications = () => {
    return notifications.filter(n => n.priority === 'high' && !n.read);
  };

  // Send test notification (for demo)
  const sendTestNotification = () => {
    addNotification({
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working.',
      priority: 'low',
      icon: 'Info'
    });
  };

  const value = {
    // State
    notifications,
    alerts,
    unreadCount,
    preferences,
    
    // Notification actions
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    
    // Alert actions
    addAlert,
    dismissAlert,
    
    // Preference actions
    updatePreferences,
    
    // Getters
    getNotificationsByType,
    getUnreadNotifications,
    getHighPriorityNotifications,
    
    // Utility
    sendTestNotification,
    loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Notification type constants
export const NOTIFICATION_TYPES = {
  APPOINTMENT: 'appointment',
  VACCINATION: 'vaccination',
  LAB: 'lab',
  NUTRITION: 'nutrition',
  SYSTEM: 'system',
  EMERGENCY: 'emergency',
  THRIPOSHA: 'thriposha'
};

// Notification priority levels
export const NOTIFICATION_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Notification icon mapping
export const NOTIFICATION_ICONS = {
  appointment: 'Calendar',
  vaccination: 'Syringe',
  lab: 'FileText',
  nutrition: 'Apple',
  system: 'Info',
  emergency: 'AlertTriangle',
  thriposha: 'Package'
};

// Notification color mapping
export const NOTIFICATION_COLORS = {
  appointment: 'bg-blue-50 text-blue-600',
  vaccination: 'bg-pink-50 text-pink-600',
  lab: 'bg-purple-50 text-purple-600',
  nutrition: 'bg-green-50 text-green-600',
  system: 'bg-gray-50 text-gray-600',
  emergency: 'bg-red-50 text-red-600',
  thriposha: 'bg-orange-50 text-orange-600'
};

export default NotificationContext;