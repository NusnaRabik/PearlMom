export const bmiCalculator = (weightInKg, heightInMeters) => {
  if (!weightInKg || !heightInMeters) return 0;
  return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
};
