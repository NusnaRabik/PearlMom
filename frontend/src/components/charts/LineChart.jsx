// frontend/src/components/charts/LineChart.jsx
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = ({ data }) => {
  const defaultData = data || [
    { month: 'Jan', total: 2100 },
    { month: 'Feb', total: 2250 },
    { month: 'Mar', total: 2400 },
    { month: 'Apr', total: 2350 },
    { month: 'May', total: 2500 },
    { month: 'Jun', total: 2682 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={defaultData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#3B82F6" 
          strokeWidth={2} 
          dot={{ fill: '#3B82F6', r: 4 }} 
          activeDot={{ r: 6 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;