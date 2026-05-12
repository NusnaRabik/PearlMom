// frontend/src/components/provider/ThriposhaCriteria.jsx
import React from 'react';
import { Info } from 'lucide-react';

const ThriposhaCriteria = () => {
  const criteria = [
    {
      category: 'BMI Criteria',
      items: [
        'BMI < 18.5: Eligible for 2 packets',
        'BMI 18.5-24.9: Eligible for 1 packet',
        'BMI ≥ 30: Eligible for 2 packets (nutritional risk)'
      ]
    },
    {
      category: 'Pregnancy Stage',
      items: [
        'From 12 weeks until delivery',
        'Continues up to 6 months postpartum',
        'Priority for adolescent pregnancies'
      ]
    },
    {
      category: 'Medical Conditions',
      items: [
        'Anemia (Hb < 11 g/dL)',
        'Previous low birth weight baby',
        'Multiple pregnancy',
        'Chronic medical conditions'
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Info className="mr-2 text-blue-500" size={20} />
        Thriposha Eligibility Criteria
      </h3>
      
      <div className="space-y-4">
        {criteria.map((section, index) => (
          <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">{section.category}</h4>
            <ul className="space-y-1">
              {section.items.map((item, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-600">
                  <span className="mr-2 mt-1.5 h-1.5 w-1.5 bg-pink-400 rounded-full flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>Note:</strong> Final eligibility determination should consider comprehensive nutritional assessment and clinical judgment.
          Always verify against the latest Ministry of Health guidelines.
        </p>
      </div>
    </div>
  );
};

export default ThriposhaCriteria;