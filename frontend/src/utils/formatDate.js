// frontend/src/utils/formatDate.js

/**
 * Date formatting utilities for PearlMom
 */

/**
 * Format date to display format (e.g., "Jan 15, 2024")
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'full', 'relative')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return '—';
  
  const dateObj = new Date(date);
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const options = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    long: { month: 'long', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    monthDay: { month: 'long', day: 'numeric' },
    monthYear: { month: 'long', year: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit', hour12: true }
  };

  if (format === 'relative') {
    return getRelativeTime(dateObj);
  }

  if (format === 'dateTime') {
    return dateObj.toLocaleDateString('en-US', options.long) + ' at ' + 
           dateObj.toLocaleTimeString('en-US', options.time);
  }

  return dateObj.toLocaleDateString('en-US', options[format] || options.long);
};

/**
 * Format time only (e.g., "10:30 AM")
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  if (!date) return '—';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get relative time string (e.g., "2 hours ago", "Yesterday")
 * @param {Date} date - Date object
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }
};

/**
 * Format date for input fields (YYYY-MM-DD)
 * @param {string|Date} date - Date to format
 * @returns {string} ISO date string
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toISOString().split('T')[0];
};

/**
 * Check if date is today
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if date is in the past
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPast = (date) => {
  const dateObj = new Date(date);
  return dateObj < new Date();
};

/**
 * Check if date is in the future
 * @param {string|Date} date - Date to check
 * @returns {boolean} True if date is in the future
 */
export const isFuture = (date) => {
  const dateObj = new Date(date);
  return dateObj > new Date();
};

/**
 * Get days until a date
 * @param {string|Date} date - Target date
 * @returns {number} Number of days until date
 */
export const getDaysUntil = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  const diffTime = dateObj - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Get days since a date
 * @param {string|Date} date - Past date
 * @returns {number} Number of days since date
 */
export const getDaysSince = (date) => {
  const dateObj = new Date(date);
  const today = new Date();
  const diffTime = today - dateObj;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 * @param {string|Date} date - Base date
 * @param {number} days - Days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Format date range
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
    }
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
};

/**
 * Get current trimester based on pregnancy week
 * @param {number} week - Pregnancy week
 * @returns {number} Trimester number (1-3)
 */
export const getTrimesterFromWeek = (week) => {
  if (week <= 12) return 1;
  if (week <= 26) return 2;
  return 3;
};

/**
 * Get month name from number
 * @param {number} month - Month number (0-11)
 * @returns {string} Month name
 */
export const getMonthName = (month) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month] || '';
};

/**
 * Get short month name
 * @param {number} month - Month number (0-11)
 * @returns {string} Short month name
 */
export const getShortMonthName = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[month] || '';
};