import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const MachineChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const filtered = result.data.filter(
          row => row.machine_id && !isNaN(row.cash_sales_amount)
        );
        const cleaned = filtered.map(row => ({
          machine_id: row.machine_id.trim(),
          cash_sales_amount: parseFloat(row.cash_sales_amount),
        }));
        console.log("Parsed Data:", cleaned);
        setData(cleaned);
      }
    });
  }, []);

  if (data.length === 0) return <p>📊 Loading chart data...</p>;

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h3>💰 Cash Sales per Machine</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="machine_id" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="cash_sales_amount" fill="#00b894" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MachineChart;