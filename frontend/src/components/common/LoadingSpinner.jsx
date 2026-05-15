import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8 w-full h-[50vh]">
    <Loader2 className="h-8 w-8 text-[#0f766e] animate-spin mb-4" />
    <p className="text-gray-500 font-medium">Loading your records...</p>
  </div>
);
