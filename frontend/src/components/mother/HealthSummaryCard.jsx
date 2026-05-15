import React from 'react';
import { Card, CardContent } from '../ui/Card';

export const HealthSummaryCard = ({ title, value, status, date, icon: Icon, colorClass }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`h-10 w-10 rounded-lg ${colorClass || 'bg-blue-50 text-blue-600'} flex items-center justify-center`}>
            {Icon && <Icon className="h-5 w-5" />}
          </div>
          {status && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
              {status}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mb-1">{value}</h4>
        {date && <p className="text-sm text-gray-600">Recorded on {date}</p>}
      </CardContent>
    </Card>
  );
};
