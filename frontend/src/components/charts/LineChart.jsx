// frontend/src/components/charts/LineChart.jsx
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = ({ data }) => {
  const chartData = (data && data.length > 0) ? data : [
    { month: 'Jan', total: 0 },
    { month: 'Feb', total: 0 },
    { month: 'Mar', total: 0 },
    { month: 'Apr', total: 0 },
    { month: 'May', total: 0 },
    { month: 'Jun', total: 0 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} stroke="#9CA3AF" tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          formatter={(value) => [`${value} mothers`, 'Registered']}
        />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#3B82F6" 
          strokeWidth={3} 
          dot={{ fill: '#3B82F6', r: 4, strokeWidth: 2, stroke: '#FFFFFF' }} 
          activeDot={{ r: 6, fill: '#1D4ED8' }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;