// frontend/src/utils/calculateWeeks.js

/**
 * Pregnancy week calculation utilities
 */

/**
 * Calculate current pregnancy week based on EDD (Expected Due Date)
 * @param {string|Date} edd - Expected Due Date
 * @returns {number} Current pregnancy week
 */
export const calculatePregnancyWeek = (edd) => {
  if (!edd) return 0;
  
  const eddDate = new Date(edd);
  const today = new Date();
  
  // Pregnancy is 40 weeks from last menstrual period
  // EDD is 40 weeks from LMP
  const totalDays = 280; // 40 weeks * 7 days
  const daysUntilEDD = Math.ceil((eddDate - today) / (1000 * 60 * 60 * 24));
  const daysSinceLMP = totalDays - daysUntilEDD;
  const weeks = Math.floor(daysSinceLMP / 7);
  
  return Math.max(0, Math.min(40, weeks));
};

/**
 * Calculate days remaining until EDD
 * @param {string|Date} edd - Expected Due Date
 * @returns {number} Days remaining
 */
export const calculateDaysRemaining = (edd) => {
  if (!edd) return 0;
  
  const eddDate = new Date(edd);
  const today = new Date();
  const diffTime = eddDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Calculate pregnancy progress percentage
 * @param {string|Date} edd - Expected Due Date
 * @returns {number} Progress percentage (0-100)
 */
export const calculatePregnancyProgress = (edd) => {
  const totalDays = 280; // 40 weeks
  const daysRemaining = calculateDaysRemaining(edd);
  const daysPassed = totalDays - daysRemaining;
  
  return Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));
};

/**
 * Get trimester from pregnancy week
 * @param {number} week - Pregnancy week
 * @returns {Object} Trimester info
 */
export const getTrimesterInfo = (week) => {
  if (week <= 12) {
    return {
      trimester: 1,
      name: 'First Trimester',
      shortName: '1st Trimester',
      weeks: '1-12',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Baby is developing major organs and structures.'
    };
  } else if (week <= 26) {
    return {
      trimester: 2,
      name: 'Second Trimester',
      shortName: '2nd Trimester',
      weeks: '13-26',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      description: 'Baby is growing rapidly and you may feel movements.'
    };
  } else {
    return {
      trimester: 3,
      name: 'Third Trimester',
      shortName: '3rd Trimester',
      weeks: '27-40',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Baby is preparing for birth and gaining weight.'
    };
  }
};

/**
 * Get baby size comparison based on week
 * @param {number} week - Pregnancy week
 * @returns {string} Baby size comparison
 */
export const getBabySizeComparison = (week) => {
  const comparisons = {
    4: 'poppy seed',
    5: 'apple seed',
    6: 'sweet pea',
    7: 'blueberry',
    8: 'raspberry',
    9: 'grape',
    10: 'kumquat',
    11: 'fig',
    12: 'lime',
    13: 'pea pod',
    14: 'lemon',
    15: 'apple',
    16: 'avocado',
    17: 'pear',
    18: 'sweet potato',
    19: 'mango',
    20: 'banana',
    21: 'carrot',
    22: 'spaghetti squash',
    23: 'large mango',
    24: 'ear of corn',
    25: 'rutabaga',
    26: 'scallion',
    27: 'cauliflower',
    28: 'large eggplant',
    29: 'butternut squash',
    30: 'large cabbage',
    31: 'coconut',
    32: 'jicama',
    33: 'pineapple',
    34: 'cantaloupe',
    35: 'honeydew melon',
    36: 'romaine lettuce',
    37: 'swiss chard',
    38: 'leek',
    39: 'mini watermelon',
    40: 'small pumpkin'
  };
  
  return comparisons[week] || 'watermelon';
};

/**
 * Get developmental milestones for the week
 * @param {number} week - Pregnancy week
 * @returns {Array} Array of milestone strings
 */
export const getWeeklyMilestones = (week) => {
  const milestones = {
    4: ['Implantation occurs', 'Amniotic sac forms'],
    8: ['All major organs forming', 'Heart is beating', 'Arms and legs developing'],
    12: ['Fingernails forming', 'Face looks more human', 'Can make a fist'],
    16: ['Can suck thumb', 'Hair is growing', 'Skeleton hardening'],
    20: ['Can hear sounds', 'Eyebrows forming', 'Movement increases'],
    24: ['Lungs developing', 'Taste buds forming', 'Sleep cycles begin'],
    28: ['Eyes can open', 'Brain growing rapidly', 'Adding body fat'],
    32: ['Bones fully developed', 'Lungs maturing', 'Head down position'],
    36: ['Lungs ready', 'Gaining weight', 'Preparing for birth'],
    40: ['Full term', 'Ready for delivery']
  };

  // Find the closest milestone
  const weeks = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  const closestWeek = weeks.find(w => w >= week) || 40;
  
  return milestones[closestWeek] || ['Growing and developing'];
};

/**
 * Calculate weeks between two dates
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {number} Number of weeks
 */
export const calculateWeeksBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
};

/**
 * Calculate EDD from last menstrual period (LMP)
 * @param {string|Date} lmp - Last Menstrual Period date
 * @returns {string} EDD in ISO format
 */
export const calculateEDDFromLMP = (lmp) => {
  const lmpDate = new Date(lmp);
  // Add 280 days (40 weeks)
  const eddDate = new Date(lmpDate);
  eddDate.setDate(eddDate.getDate() + 280);
  return eddDate.toISOString().split('T')[0];
};