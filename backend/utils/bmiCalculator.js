/**
 * BMI Calculator Utility
 */

const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return parseFloat(bmi.toFixed(1));
};

const getBMICategory = (weight, height) => {
  const bmi = calculateBMI(weight, height);
  
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 24.9) return 'Normal weight';
  if (bmi < 29.9) return 'Overweight';
  return 'Obese';
};

const getBMICategoryForPregnancy = (bmi) => {
  if (!bmi) return null;
  
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 24.9) return 'Normal weight';
  if (bmi < 29.9) return 'Overweight';
  return 'Obese';
};

module.exports = {
  calculateBMI,
  getBMICategory,
  getBMICategoryForPregnancy
};