// frontend/src/components/charts/BarChart.jsx
import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BarChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
        <YAxis allowDecimals={false} stroke="#9CA3AF" tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value) => [`${value} mothers`, 'Count']}
          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;