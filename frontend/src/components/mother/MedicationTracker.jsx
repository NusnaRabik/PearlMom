import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';

export const MedicationTracker = ({ medications = [] }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-900 mb-4">Daily Supplements</h3>
        {medications.length === 0 ? (
          <p className="text-sm text-gray-500">No supplements prescribed yet.</p>
        ) : (
          <div className="space-y-3">
            {medications.map((med, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{med.name}</p>
                  <p className="text-xs text-gray-500">{med.dosage} - {med.time}</p>
                </div>
                <button className={`${med.taken ? 'text-[#0f766e]' : 'text-gray-300'} hover:text-[#0c5c56]`}>
                  {med.taken ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};