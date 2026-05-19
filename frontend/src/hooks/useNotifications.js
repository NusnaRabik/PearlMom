// frontend/src/hooks/useNotifications.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for notification management
 */
export const useNotificationsHook = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alerts, setAlerts] = useState([]);

  // Load notifications from localStorage
  useEffect(() => {
    loadNotifications();
    loadAlerts();
  }, []);

  // Update unread count
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const loadNotifications = () => {
    try {
      const stored = localStorage.getItem('pearlmom_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

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

  const saveNotifications = (data) => {
    localStorage.setItem('pearlmom_notifications', JSON.stringify(data));
  };

  const saveAlerts = (data) => {
    localStorage.setItem('pearlmom_alerts', JSON.stringify(data));
  };

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now(),
      time: 'Just now',
      read: false,
      ...notification
    };
    
    setNotifications(prev => {
      const updated = [newNotification, ...prev].slice(0, 50);
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
      saveAlerts(updated);
      return updated;
    });
  }, []);

  // Mark as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Delete notification
  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    saveNotifications([]);
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((id) => {
    setAlerts(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveAlerts(updated);
      return updated;
    });
  }, []);

  // Get unread notifications
  const getUnread = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Get by type
  const getByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get high priority
  const getHighPriority = useCallback(() => {
    return notifications.filter(n => n.priority === 'high' && !n.read);
  }, [notifications]);

  return {
    notifications,
    alerts,
    unreadCount,
    addNotification,
    addAlert,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    dismissAlert,
    getUnread,
    getByType,
    getHighPriority,
    loadNotifications
  };
};

export default useNotificationsHook;