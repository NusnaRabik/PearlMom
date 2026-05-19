// frontend/src/constants/thriposhCriteria.js

/**
 * Thriposha Nutritional Supplement Program Eligibility Criteria
 * Based on Sri Lanka Ministry of Health guidelines
 */

export const THRIPOSHA_PROGRAM = {
  name: 'Thriposha Nutritional Supplement Program',
  description: 'Government-sponsored nutritional supplement program for pregnant and lactating mothers',
  targetGroup: 'Pregnant women and lactating mothers up to 6 months postpartum',
  packetWeight: '750g per packet',
  distributionCycle: 'Monthly',
  maxPacketsPerCycle: 2
};

export const ELIGIBILITY_CRITERIA = {
  bmi: {
    underweight: {
      threshold: 18.5,
      operator: '<',
      packets: 2,
      label: 'Underweight (BMI < 18.5)',
      description: 'Mothers with BMI below 18.5 are eligible for 2 packets per distribution cycle'
    },
    normal: {
      threshold: [18.5, 24.9],
      operator: 'between',
      packets: 1,
      label: 'Normal Weight (BMI 18.5 - 24.9)',
      description: 'Mothers with normal BMI are eligible for 1 packet per distribution cycle'
    },
    overweight: {
      threshold: 30,
      operator: '>=',
      packets: 2,
      label: 'Overweight/Obese (BMI ≥ 30)',
      description: 'Mothers with BMI 30 or above are eligible for 2 packets (nutritional risk)'
    }
  },
  pregnancyStage: {
    minimumWeek: 12,
    maximumPostpartumMonths: 6,
    description: 'Eligible from 12 weeks of pregnancy until 6 months postpartum'
  },
  medicalConditions: {
    anemia: {
      condition: 'Anemia',
      threshold: 11,
      unit: 'g/dL',
      operator: '<',
      description: 'Hemoglobin level below 11 g/dL',
      additionalPackets: 1
    },
    previousLowBirthWeight: {
      condition: 'Previous Low Birth Weight',
      description: 'History of delivering a baby weighing less than 2.5 kg',
      additionalPackets: 1
    },
    multiplePregnancy: {
      condition: 'Multiple Pregnancy',
      description: 'Currently pregnant with twins, triplets, or more',
      additionalPackets: 1
    },
    chronicConditions: {
      condition: 'Chronic Medical Conditions',
      description: 'Diabetes, hypertension, heart disease, or other chronic conditions',
      additionalPackets: 0
    },
    adolescentPregnancy: {
      condition: 'Adolescent Pregnancy',
      age: 19,
      operator: '<',
      description: 'Pregnant mothers under 19 years of age',
      additionalPackets: 1
    }
  }
};

export const ELIGIBILITY_STATUS = {
  ELIGIBLE: 'eligible',
  NOT_ELIGIBLE: 'not_eligible',
  PENDING_REVIEW: 'pending_review',
  EXPIRED: 'expired'
};

export const ELIGIBILITY_STATUS_LABELS = {
  eligible: 'Eligible',
  not_eligible: 'Not Eligible',
  pending_review: 'Pending Review',
  expired: 'Expired'
};

export const ELIGIBILITY_STATUS_COLORS = {
  eligible: 'bg-green-100 text-green-800',
  not_eligible: 'bg-red-100 text-red-800',
  pending_review: 'bg-yellow-100 text-yellow-800',
  expired: 'bg-gray-100 text-gray-800'
};

export const NUTRITIONAL_GUIDELINES = {
  firstTrimester: {
    title: 'First Trimester (Weeks 1-12)',
    calorieIncrease: 0,
    keyNutrients: ['Folic Acid', 'Iron', 'Vitamin B6'],
    tips: [
      'Take prenatal vitamins with folic acid daily',
      'Eat small, frequent meals to manage morning sickness',
      'Stay hydrated with water and herbal teas',
      'Include ginger to help with nausea',
      'Avoid raw or undercooked foods'
    ],
    foodsToFocus: ['Leafy greens', 'Citrus fruits', 'Whole grains', 'Lean proteins'],
    foodsToAvoid: ['Raw fish', 'Unpasteurized dairy', 'Excessive caffeine', 'Alcohol']
  },
  secondTrimester: {
    title: 'Second Trimester (Weeks 13-26)',
    calorieIncrease: 340,
    keyNutrients: ['Calcium', 'Vitamin D', 'Iron', 'Protein'],
    tips: [
      'Increase daily calorie intake by approximately 340 calories',
      'Focus on calcium-rich foods for bone development',
      'Include iron-rich foods to prevent anemia',
      'Eat protein-rich foods for tissue growth',
      'Drink 8-10 glasses of water daily'
    ],
    foodsToFocus: ['Dairy products', 'Lean meat', 'Beans', 'Nuts', 'Fish (low mercury)'],
    foodsToAvoid: ['High-mercury fish', 'Raw sprouts', 'Excessive sugar', 'Processed foods']
  },
  thirdTrimester: {
    title: 'Third Trimester (Weeks 27-40)',
    calorieIncrease: 450,
    keyNutrients: ['Iron', 'Calcium', 'Magnesium', 'Fiber'],
    tips: [
      'Increase calorie intake by approximately 450 calories',
      'Eat fiber-rich foods to prevent constipation',
      'Include magnesium-rich foods for leg cramps',
      'Continue iron supplementation as prescribed',
      'Eat smaller meals to avoid heartburn'
    ],
    foodsToFocus: ['Oatmeal', 'Bananas', 'Sweet potatoes', 'Yogurt', 'Eggs'],
    foodsToAvoid: ['Spicy foods', 'Fried foods', 'Carbonated drinks', 'Large meals']
  },
  postpartum: {
    title: 'Postpartum (After Delivery)',
    calorieIncrease: 500,
    keyNutrients: ['Iron', 'Calcium', 'Protein', 'Vitamin B12'],
    tips: [
      'Increase calorie intake if breastfeeding (extra 500 calories)',
      'Continue iron supplements for at least 3 months',
      'Stay well hydrated for milk production',
      'Eat energy-rich foods for recovery',
      'Include galactagogues (foods that increase milk supply)'
    ],
    foodsToFocus: ['Fenugreek', 'Oats', 'Garlic', 'Green vegetables', 'Lentils'],
    foodsToAvoid: ['Excessive caffeine', 'Alcohol', 'Gas-producing foods', 'Peppermint (may reduce milk)']
  }
};

export const BMI_CATEGORIES = {
  underweight: {
    min: 0,
    max: 18.4,
    label: 'Underweight',
    color: 'text-yellow-600',
    advice: 'You need additional nutritional support. You qualify for extra Thriposha packets.'
  },
  normal: {
    min: 18.5,
    max: 24.9,
    label: 'Normal Weight',
    color: 'text-green-600',
    advice: 'Your weight is within the healthy range. Continue balanced nutrition.'
  },
  overweight: {
    min: 25,
    max: 29.9,
    label: 'Overweight',
    color: 'text-orange-600',
    advice: 'Monitor weight gain. Focus on nutrient-dense rather than calorie-dense foods.'
  },
  obese: {
    min: 30,
    max: 100,
    label: 'Obese',
    color: 'text-red-600',
    advice: 'Consult with your healthcare provider for a personalized nutrition plan.'
  }
};