// frontend/src/components/charts/LineChart.jsx
import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = () => {
  const data = [
    { month: 'JAN', mothers: 980, highRisk: 45 },
    { month: 'FEB', mothers: 1020, highRisk: 48 },
    { month: 'MAR', mothers: 1050, highRisk: 40 },
    { month: 'APR', mothers: 1100, highRisk: 49 },
    { month: 'MAY', mothers: 1150, highRisk: 42 },
    { month: 'JUN', months: 1200, highRisk: 44 },
    { month: 'JUL', mothers: 1240, highRisk: 42 }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="mothers" stroke="#EC4899" strokeWidth={2} dot={{ fill: '#EC4899' }} />
        <Line type="monotone" dataKey="highRisk" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;