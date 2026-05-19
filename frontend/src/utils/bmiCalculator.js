// frontend/src/utils/bmiCalculator.js

/**
 * BMI Calculator and health metric utilities
 */

/**
 * Calculate BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value rounded to 1 decimal
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height || height <= 0) return 0;
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return Math.round(bmi * 10) / 10;
};

/**
 * Get BMI category
 * @param {number} bmi - BMI value
 * @returns {Object} Category info
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-200',
      icon: '⚠️',
      description: 'You may need additional nutritional support.',
      recommendation: 'Focus on nutrient-dense foods. Consult your healthcare provider.'
    };
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return {
      category: 'Normal Weight',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      icon: '✅',
      description: 'Your weight is within the healthy range.',
      recommendation: 'Maintain balanced nutrition and regular exercise.'
    };
  } else if (bmi >= 25 && bmi <= 29.9) {
    return {
      category: 'Overweight',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-200',
      icon: '⚡',
      description: 'Monitor weight gain during pregnancy.',
      recommendation: 'Focus on nutrient-dense rather than calorie-dense foods.'
    };
  } else {
    return {
      category: 'Obese',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-200',
      icon: '❗',
      description: 'Consult with your healthcare provider.',
      recommendation: 'Follow a personalized nutrition plan from your doctor.'
    };
  }
};

/**
 * Calculate recommended weight gain during pregnancy
 * @param {number} prePregnancyBMI - BMI before pregnancy
 * @param {number} currentWeek - Current pregnancy week
 * @returns {Object} Weight gain recommendations
 */
export const calculateRecommendedWeightGain = (prePregnancyBMI, currentWeek) => {
  let totalGain, weeklyGain;
  
  if (prePregnancyBMI < 18.5) {
    totalGain = { min: 12.5, max: 18, unit: 'kg' };
    weeklyGain = { min: 0.44, max: 0.58, unit: 'kg/week' };
  } else if (prePregnancyBMI >= 18.5 && prePregnancyBMI <= 24.9) {
    totalGain = { min: 11.5, max: 16, unit: 'kg' };
    weeklyGain = { min: 0.35, max: 0.50, unit: 'kg/week' };
  } else if (prePregnancyBMI >= 25 && prePregnancyBMI <= 29.9) {
    totalGain = { min: 7, max: 11.5, unit: 'kg' };
    weeklyGain = { min: 0.23, max: 0.33, unit: 'kg/week' };
  } else {
    totalGain = { min: 5, max: 9, unit: 'kg' };
    weeklyGain = { min: 0.17, max: 0.27, unit: 'kg/week' };
  }

  return {
    totalGain,
    weeklyGain,
    currentWeekGain: {
      min: Math.round((weeklyGain.min * currentWeek) * 10) / 10,
      max: Math.round((weeklyGain.max * currentWeek) * 10) / 10
    }
  };
};

/**
 * Check if weight gain is within recommended range
 * @param {number} weightGain - Actual weight gain in kg
 * @param {number} prePregnancyBMI - BMI before pregnancy
 * @param {number} currentWeek - Current pregnancy week
 * @returns {Object} Weight gain status
 */
export const checkWeightGainStatus = (weightGain, prePregnancyBMI, currentWeek) => {
  const recommendations = calculateRecommendedWeightGain(prePregnancyBMI, currentWeek);
  const { min, max } = recommendations.currentWeekGain;
  
  if (weightGain < min) {
    return {
      status: 'Below Target',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      message: 'You are gaining weight slower than recommended.'
    };
  } else if (weightGain > max) {
    return {
      status: 'Above Target',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      message: 'You are gaining weight faster than recommended.'
    };
  } else {
    return {
      status: 'On Target',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      message: 'Your weight gain is within the recommended range.'
    };
  }
};

/**
 * Calculate daily calorie needs during pregnancy
 * @param {number} age - Age in years
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} trimester - Current trimester (1-3)
 * @returns {number} Daily calorie recommendation
 */
export const calculateCalorieNeeds = (age, weight, height, trimester = 2) => {
  // Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  
  // Total Daily Energy Expenditure (TDEE) - assuming light activity
  const tdee = bmr * 1.375;
  
  // Additional calories by trimester
  const trimesterCalories = {
    1: 0,      // First trimester: no extra calories
    2: 340,    // Second trimester: +340 calories
    3: 450     // Third trimester: +450 calories
  };
  
  return Math.round(tdee + (trimesterCalories[trimester] || 0));
};

/**
 * Calculate hemoglobin status
 * @param {number} hbLevel - Hemoglobin level in g/dL
 * @param {number} trimester - Current trimester
 * @returns {Object} Hemoglobin status
 */
export const checkHemoglobinStatus = (hbLevel, trimester = 2) => {
  // WHO guidelines for pregnancy
  const thresholds = {
    normal: 11.0,
    mild: 10.0,
    moderate: 7.0,
    severe: 0
  };

  if (hbLevel >= thresholds.normal) {
    return {
      status: 'Normal',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      message: 'Hemoglobin levels are within normal range.'
    };
  } else if (hbLevel >= thresholds.mild) {
    return {
      status: 'Mild Anemia',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      message: 'Mild anemia detected. Increase iron-rich foods.'
    };
  } else if (hbLevel >= thresholds.moderate) {
    return {
      status: 'Moderate Anemia',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      message: 'Moderate anemia. Consult your healthcare provider.'
    };
  } else {
    return {
      status: 'Severe Anemia',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      message: 'Severe anemia. Immediate medical attention recommended.'
    };
  }
};

/**
 * Calculate blood pressure status
 * @param {number} systolic - Systolic BP
 * @param {number} diastolic - Diastolic BP
 * @returns {Object} Blood pressure status
 */
export const checkBloodPressureStatus = (systolic, diastolic) => {
  if (systolic < 90 || diastolic < 60) {
    return {
      status: 'Low',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      message: 'Blood pressure is lower than normal.'
    };
  } else if (systolic < 120 && diastolic < 80) {
    return {
      status: 'Normal',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      message: 'Blood pressure is within normal range.'
    };
  } else if (systolic < 140 || diastolic < 90) {
    return {
      status: 'Elevated',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      message: 'Blood pressure is slightly elevated. Monitor regularly.'
    };
  } else {
    return {
      status: 'High',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      message: 'High blood pressure detected. Consult your doctor immediately.'
    };
  }
};

/**
 * Calculate fetal heart rate status
 * @param {number} fhr - Fetal Heart Rate in bpm
 * @returns {Object} FHR status
 */
export const checkFHRStatus = (fhr) => {
  if (fhr >= 110 && fhr <= 160) {
    return {
      status: 'Normal',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      message: 'Fetal heart rate is within normal range (110-160 bpm).'
    };
  } else if (fhr < 110) {
    return {
      status: 'Bradycardia',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      message: 'Fetal heart rate is below normal. Seek medical attention.'
    };
  } else {
    return {
      status: 'Tachycardia',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      message: 'Fetal heart rate is above normal. Monitor and consult doctor.'
    };
  }
};