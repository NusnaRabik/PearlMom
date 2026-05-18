import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Syringe } from 'lucide-react';

export const VaccinationCard = ({ name, date, status, notes }) => {
  return (
    <Card className="hover:border-blue-200 transition-colors">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
         <div className="flex items-start">
           <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mr-4 mt-1">
             <Syringe className="h-5 w-5" />
           </div>
           <div>
             <h4 className="font-medium text-gray-900">{name}</h4>
             <p className="text-xs text-gray-500">{date}</p>
             {notes && <p className="text-xs text-gray-600 mt-2">{notes}</p>}
           </div>
         </div>
         <Badge 
           variant={status === 'COMPLETED' ? 'success' : status === 'UPCOMING' ? 'info' : 'default'}
         >
           {status}
         </Badge>
      </CardContent>
    </Card>
  );
};