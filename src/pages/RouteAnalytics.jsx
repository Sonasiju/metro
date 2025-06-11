import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const normalize = str => str?.trim().toLowerCase().replace(/\s+/g, ' ');

const RouteAnalytics = () => {
  const { routeName, machineId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        console.log("Fetched data:", json);
        setData(json);
      })
      .catch(err => console.error(err));
  }, []);

  const decodedRoute = decodeURIComponent(routeName);
  const decodedMachineId = decodeURIComponent(machineId);

  // Debug inside filter
  const filtered = data.filter(d =>
  d.machine_id.replace(/\s+/g, '').toLowerCase() === decodedMachineId.replace(/\s+/g, '').toLowerCase() &&
  d.route_name === decodedRoute
);


  console.log("machineId from URL:", machineId);
  console.log("Decoded machine ID:", decodedMachineId);
  console.log("Decoded route:", decodedRoute);
  console.log("Filtered data:", filtered);

  if (filtered.length === 0) {
    return (
      <div className="container text-light">
        <h3>No data found</h3>
        <p>Machine ID: {machineId}</p>
        <p>Route: {routeName}</p>
        <p>Decoded Route: {decodedRoute}</p>
      </div>
    );
  }

  const salesOverTime = {
    labels: filtered.map((d, i) => `Trip ${i + 1}`),
    datasets: [{
      label: 'Total Ticket Amount',
      data: filtered.map(d => Number(d.total_ticket_amount)),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  const ticketCountOverTime = {
    labels: filtered.map((d, i) => `Trip ${i + 1}`),
    datasets: [{
      label: 'Tickets Sold',
      data: filtered.map(d => Number(d.total_ticket_count)),
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
    }]
  };

  const paymentMode = {
    labels: ['Cash', 'Card', 'UPI'],
    datasets: [{
      data: [
        filtered.reduce((sum, d) => sum + Number(d.cash_sales_amount), 0),
        filtered.reduce((sum, d) => sum + Number(d.card_sales_amount), 0),
        filtered.reduce((sum, d) => sum + Number(d.upi_sales_amount), 0),
      ],
      backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0']
    }]
  };

  const passengerTypes = {
    labels: ['Adult', 'Child', 'Student', 'Luggage'],
    datasets: [{
      data: [
        filtered.reduce((sum, d) => sum + Number(d.adult_count), 0),
        filtered.reduce((sum, d) => sum + Number(d.child_count), 0),
        filtered.reduce((sum, d) => sum + Number(d.student_count), 0),
        filtered.reduce((sum, d) => sum + Number(d.luggage_count), 0),
      ],
      backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#9966ff']
    }]
  };

  return (
    <div className="container text-light">
      <h2 className="my-3">Analytics for {decodedRoute}</h2>

      <h5>Total Sales Over Time</h5>
      <Bar data={salesOverTime} />

      <h5 className="mt-4">Tickets Sold Over Time</h5>
      <Bar data={ticketCountOverTime} />

      <h5 className="mt-4">Payment Mode Distribution</h5>
      <Pie data={paymentMode} />

      <h5 className="mt-4">Passenger Category Distribution</h5>
      <Pie data={passengerTypes} />
    </div>
  );
};

export default RouteAnalytics;
