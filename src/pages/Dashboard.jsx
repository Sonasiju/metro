import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClusterCard from '../components/ClusterCard.jsx';
import Papa from 'papaparse';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#33AA66'];

const Dashboard = ({ clusters }) => {
  const nav = useNavigate();
  const [csvData, setCsvData] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load CSV
    Papa.parse('/data.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const cleaned = result.data
          .filter(row => row.date && row.value)
          .map(item => ({
            date: item.date,
            value: Number(item.value.replace(/,/g, '')),
          }));
        setCsvData(cleaned);
      },
      error: (err) => {
        console.error('CSV parse error:', err);
      }
    });

    // Load JSON data
    fetch('/data.json')
      .then(res => res.json())
      .then(data => {
        setJsonData(data);
        setLoading(false);
      })
      .catch(err => {
        console.warn('JSON load error:', err);
        setLoading(false);
      });
  }, []);

  // Aggregate data
  const salesOverTime = {};
  const ticketsSoldOverTime = {};
  const paymentModeCounts = { cash: 0, card: 0, upi: 0, bank: 0 };
  const passengerCategories = { adult: 0, child: 0, student: 0, luggage: 0 };
  const revenueByRoute = {};

  jsonData.forEach(entry => {
    const dateKey = entry.opening_time?.split(' ')[0] || '';

    salesOverTime[dateKey] = (salesOverTime[dateKey] || 0) + Number(entry.total_ticket_amount || 0);
    ticketsSoldOverTime[dateKey] = (ticketsSoldOverTime[dateKey] || 0) + Number(entry.total_ticket_count || 0);

    paymentModeCounts.cash += Number(entry.cash_sales) || 0;
    paymentModeCounts.card += Number(entry.card_sales) || 0;
    paymentModeCounts.upi += Number(entry.upi_sales) || 0;
    paymentModeCounts.bank += Number(entry.bank_sales) || 0;

    passengerCategories.adult += Number(entry.adult_count) || 0;
    passengerCategories.child += Number(entry.child_count) || 0;
    passengerCategories.student += Number(entry.student_count) || 0;
    passengerCategories.luggage += Number(entry.luggage_count) || 0;

    if (entry.route_name) {
      revenueByRoute[entry.route_name] = (revenueByRoute[entry.route_name] || 0) + Number(entry.total_ticket_amount || 0);
    }
  });

  const salesOverTimeData = Object.entries(salesOverTime).map(([date, totalSales]) => ({ date, totalSales }));
  const ticketsSoldOverTimeData = Object.entries(ticketsSoldOverTime).map(([date, tickets]) => ({ date, tickets }));
  const paymentModeData = Object.entries(paymentModeCounts).map(([mode, count]) => ({ mode, count }));
  const passengerCategoryData = Object.entries(passengerCategories).map(([category, count]) => ({ category, count }));
  const revenueByRouteData = Object.entries(revenueByRoute).map(([route, revenue]) => ({ route, revenue }));

  const totalMachines = clusters.reduce((sum, c) => sum + c.machines.length, 0);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="container my-4 text-white">
      <h2 className="fw-bold">🚇 Metro Dashboard</h2>

      <div className="d-flex gap-3 my-3 flex-wrap">
        <div className="metric-card"><strong>{clusters.length}</strong><span>Clusters</span></div>
        <div className="metric-card"><strong>{totalMachines}</strong><span>Machines</span></div>
        <div className="metric-card"><strong>{jsonData.length}</strong><span>Entries</span></div>
      </div>

      {/* Cluster Cards */}
      <div className="d-flex flex-wrap gap-3">
        {clusters.map(cluster => (
          <ClusterCard
            key={cluster.id}
            cluster={cluster}
            onClick={() => nav(`/cluster/${cluster.id}`)}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-5">
        <h4>📊 Graph from data</h4>
      
      </div>

      <div className="row mt-5">
        <div className="col-md-6">
          <h5>🗓 Total Sales Over Time</h5>
          <BarChart width={500} height={300} data={salesOverTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalSales" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="col-md-6">
          <h5>🎫 Tickets Sold Over Time</h5>
          <BarChart width={500} height={300} data={ticketsSoldOverTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="tickets" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-md-6">
          <h5>💳 Payment Mode Distribution</h5>
          <PieChart width={400} height={300}>
            <Pie data={paymentModeData} dataKey="count" nameKey="mode" cx="50%" cy="50%" outerRadius={100} label>
              {paymentModeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

       <div className="col-md-6">
          <h5>👥 Passenger Category Distribution (Bar Chart)</h5>
          <BarChart
            width={400}
            height={300}
            data={passengerCategoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>


        <div className="mt-5">
        <h5>🛣 Revenue by Route</h5>
        <BarChart
          width={1000}
          height={400}
          data={revenueByRouteData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="route"
            interval={0}
            angle={-60}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="revenue" fill="#ffc658" />
        </BarChart>
      </div>
    </div>
  );
};

export default Dashboard;