// frontend/src/constants/vaccinationSchedule.js

/**
 * National Immunization Schedule for Mothers and Newborns
 * Based on Sri Lanka Ministry of Health guidelines
 */

export const MOTHER_VACCINATIONS = [
  {
    id: 'v1',
    name: 'Tetanus Toxoid (TT) - Dose 1',
    type: 'Tetanus',
    dueWeek: 16,
    description: 'First dose of tetanus vaccination for expectant mothers',
    category: 'maternal',
    priority: 'high'
  },
  {
    id: 'v2',
    name: 'Tetanus Toxoid (TT) - Dose 2',
    type: 'Tetanus',
    dueWeek: 20,
    description: 'Second dose of tetanus vaccination, given 4 weeks after first dose',
    category: 'maternal',
    priority: 'high'
  },
  {
    id: 'v3',
    name: 'Tetanus Toxoid (TT) - Booster',
    type: 'Tetanus',
    dueWeek: 28,
    description: 'Booster dose if previous pregnancy was within 3 years',
    category: 'maternal',
    priority: 'medium'
  },
  {
    id: 'v4',
    name: 'Influenza Vaccine',
    type: 'Influenza',
    dueWeek: 12,
    description: 'Annual influenza vaccination, safe during any trimester',
    category: 'maternal',
    priority: 'medium',
    seasonal: true
  },
  {
    id: 'v5',
    name: 'Tdap (Tetanus, Diphtheria, Pertussis)',
    type: 'Tdap',
    dueWeek: 27,
    description: 'Protects against whooping cough, recommended during 27-36 weeks',
    category: 'maternal',
    priority: 'high'
  },
  {
    id: 'v6',
    name: 'Hepatitis B',
    type: 'Hepatitis B',
    dueWeek: 12,
    description: 'For mothers at high risk of Hepatitis B infection',
    category: 'maternal',
    priority: 'low',
    conditional: true
  },
  {
    id: 'v7',
    name: 'COVID-19 Vaccine',
    type: 'COVID-19',
    dueWeek: 12,
    description: 'Recommended for pregnant women as per national guidelines',
    category: 'maternal',
    priority: 'high'
  }
];


export const VACCINATION_STATUS = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  EXEMPTED: 'exempted'
};

export const VACCINATION_STATUS_LABELS = {
  pending: 'Pending',
  scheduled: 'Scheduled',
  completed: 'Completed',
  overdue: 'Overdue',
  exempted: 'Exempted'
};

export const VACCINATION_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
  exempted: 'bg-yellow-100 text-yellow-800'
};

export const VACCINATION_CATEGORIES = {
  maternal: {
    label: 'Maternal Vaccination',
    icon: 'Syringe',
    description: 'Vaccinations for expectant mothers during pregnancy'
  },
  newborn: {
    label: 'Newborn Vaccination',
    icon: 'Baby',
    description: 'Vaccinations for newborn babies after birth'
  }
};