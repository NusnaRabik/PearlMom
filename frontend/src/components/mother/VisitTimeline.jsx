import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';

export const VisitTimeline = ({ visits = [] }) => {
  if (visits.length === 0) {
    return <p className="text-gray-500 text-sm">No visits recorded yet.</p>;
  }

  return (
    <div className="relative border-l-2 border-gray-200 ml-4 py-4 space-y-8">
      {visits.map((visit, index) => (
        <div key={index} className="relative pl-8">
          <div className={`absolute -left-[13px] top-0 h-6 w-6 rounded-full flex items-center justify-center shadow-sm
            ${visit.status === 'completed' ? 'bg-[#0f766e] text-white' : 'bg-gray-200 text-gray-500'}`}>
            {visit.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          </div>
          <h4 className={`font-bold ${visit.status === 'completed' ? 'text-gray-900' : 'text-gray-500'}`}>
            {visit.title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{visit.date}</p>
          {visit.notes && <p className="text-sm text-gray-600 mt-2">{visit.notes}</p>}
        </div>
      ))}
    </div>
  );
};