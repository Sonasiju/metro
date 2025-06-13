import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9 -]/g, '')
    .trim();

const MACHINE_ALIAS = {
  'aluva metro': 'kl07de9425',
  'aluvametro': 'kl07de9425',
  'kl07de9425': 'aluvametro',
  'cial metro': 'kl07de9492',
  'cialmetro': 'kl07de9492',
  'kl07de9492': 'cialmetro',
  'medical college - kalamassery ms': 'kl07de9437',
  'kalamassery metro': 'kl07de9437',
  'kalamassery': 'kl07de9437',
  'kl07de9437': 'kalamassery',
  'ernakulam south metro': 'kl07de9441',
  'maharaja college metro': 'kl07de9450',
  'edapally metro': 'kl07de9462',
  'kaloor metro': 'kl07de9474',
  'town hall metro': 'kl07de9483',
};

const ROUTE_ALIAS = {
  'kalamasssery ms - medical college': 'kalamassery ms - medical college',
  'medical college - kalamasssery ms': 'medical college - kalamassery ms',
  // add more if needed
};

// --- Add this helper function ---
function parseCustomDate(dateStr) {
  // Example input: "08-05-2025 07:56:42 PM"
  if (!dateStr) return null;
  const parts = dateStr.split(' ');
  if (parts.length < 3) return null;

  const [datePart, timePart, meridian] = parts;
  const [day, month, year] = datePart.split('-').map(Number);
  let [hours, minutes, seconds] = timePart.split(':').map(Number);

  if (meridian === 'PM' && hours < 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes, seconds);
}

const RouteAnalytics = () => {
  const { routeName, machineId } = useParams();
  const nav = useNavigate();

  const decodedRoute = decodeURIComponent(routeName);
  const decodedMachine = decodeURIComponent(machineId);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState(new Date('2025-04-01'));
  const [toDate, setToDate] = useState(new Date('2025-06-01'));
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');

  const normalizedMachine = normalize(decodedMachine);
  const normalizedRouteRaw = normalize(decodedRoute);
  const normalizedRoute = ROUTE_ALIAS[normalizedRouteRaw] || normalizedRouteRaw;

  const effectiveMachine = MACHINE_ALIAS[normalizedMachine] || normalizedMachine;

  useEffect(() => {
    fetch('/data.json')
      .then((res) => res.json())
      .then((json) => {
        setRows(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data.json', err);
        setLoading(false);
      });
  }, []);

  const filtered = rows.filter((r) => {
    const rowMachineId = (r.machine_id || '').toLowerCase();
    const targetMachineId = (effectiveMachine || '').toLowerCase();

    const machineMatch =
      rowMachineId === targetMachineId ||
      MACHINE_ALIAS[rowMachineId] === targetMachineId ||
      MACHINE_ALIAS[targetMachineId] === rowMachineId;

    const rowRouteNormalizedRaw = normalize(r.route_name);
    const rowRouteNormalized = ROUTE_ALIAS[rowRouteNormalizedRaw] || rowRouteNormalizedRaw;

    const reversedRoute = normalizedRoute.split(' - ').reverse().join(' - ');

    const routeMatch =
      rowRouteNormalized === normalizedRoute ||
      rowRouteNormalized === reversedRoute ||
      rowRouteNormalized.replace(/\s+/g, '') === normalizedRoute.replace(/\s+/g, '') ||
      rowRouteNormalized.replace(/\s+/g, '') === reversedRoute.replace(/\s+/g, '');

    if (!machineMatch || !routeMatch || !r.opening_time) {
      return false;
    }

    // --- Replace here with custom date parsing ---
    const openDate = parseCustomDate(r.opening_time);
    if (!openDate) return false;

    const inDateRange = openDate >= fromDate && openDate <= toDate;

    // --- Replace openTime calculation to 24-hour ---
    const parts = r.opening_time.split(' ');
    const timePart = parts[1];
    const meridian = parts[2];
    let [hours, minutes] = timePart.split(':').map(Number);

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    const openTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    let timeMatch = true;
    if (fromTime && toTime) {
      timeMatch = openTime >= fromTime && openTime <= toTime;
    }

    return inDateRange && timeMatch;
  });

  if (loading) {
    return <div className="container text-light my-4">Loading analytics...</div>;
  }

  if (filtered.length === 0) {
    const availableMachines = [
      ...new Set(rows.map((r) => `${r.machine_id} (${normalize(r.machine_id).replace(/\s+/g, '')})`)),
    ];

    const availableRoutes = [
      ...new Set(rows.map((r) => `${r.route_name} (${normalize(r.route_name)})`)),
    ];

    return (
      <div className="container text-light my-4">
        <button className="btn btn-outline-light mb-3" onClick={() => nav(-1)}>
          ← Back to Route Selection
        </button>
        <h3>No data found</h3>
        <p>Searching for:</p>
        <ul>
          <li>
            Machine: <code>{decodedMachine}</code> (normalized: {normalize(decodedMachine).replace(/\s+/g, '')})
          </li>
          <li>
            Route: <code>{decodedRoute}</code> (normalized: {normalizedRoute})
          </li>
        </ul>

        <p>Available machines:</p>
        <ul>{availableMachines.map((m, i) => <li key={i}><code>{m}</code></li>)}</ul>

        <p>Available routes:</p>
        <ul>{availableRoutes.map((r, i) => <li key={i}><code>{r}</code></li>)}</ul>
      </div>
    );
  }

  // Prepare chart data (unchanged) ...
  const trips = filtered.map((_, i) => `Trip ${i + 1}`);

  const salesOverTime = {
    labels: trips,
    datasets: [
      {
        label: 'Total Ticket Amount (₹)',
        data: filtered.map((r) => Number(r.total_ticket_amount)),
        backgroundColor: 'rgba(54,162,235,0.6)',
      },
    ],
  };

  const ticketCountOverTime = {
    labels: trips,
    datasets: [
      {
        label: 'Tickets Sold',
        data: filtered.map((r) => Number(r.total_ticket_count)),
        backgroundColor: 'rgba(255,206,86,0.6)',
      },
    ],
  };

  const paymentMode = {
    labels: ['Cash', 'Card', 'UPI'],
    datasets: [
      {
        data: [
          filtered.reduce((sum, r) => sum + Number(r.cash_sales_amount), 0),
          filtered.reduce((sum, r) => sum + Number(r.card_sales_amount), 0),
          filtered.reduce((sum, r) => sum + Number(r.upi_sales_amount), 0),
        ],
        backgroundColor: ['#36a2eb', '#ff6384', '#4bc0c0'],
      },
    ],
  };

  const passengerTypes = {
    labels: ['Adult', 'Child', 'Student', 'Luggage'],
    datasets: [
      {
        data: [
          filtered.reduce((sum, r) => sum + Number(r.adult_count), 0),
          filtered.reduce((sum, r) => sum + Number(r.child_count), 0),
          filtered.reduce((sum, r) => sum + Number(r.student_count), 0),
          filtered.reduce((sum, r) => sum + Number(r.luggage_count), 0),
        ],
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#9966ff'],
      },
    ],
  };

  const hourlyPassengerCounts = Array(24).fill(0);
  filtered.forEach((r) => {
    const hour = parseCustomDate(r.opening_time)?.getHours() || 0;
    const totalPassengers =
      Number(r.adult_count || 0) +
      Number(r.child_count || 0) +
      Number(r.student_count || 0) +
      Number(r.luggage_count || 0);
    hourlyPassengerCounts[hour] += totalPassengers;
  });

  const peakTimeData = {
    labels: hourlyPassengerCounts.map((_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Passenger Count Per Hour',
        data: hourlyPassengerCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const barOptions = {
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: true,
  };

  const pieOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: { size: 12 },
        },
      },
    },
  };

  return (
    <div className="container text-light my-4">
      <button className="btn btn-outline-light mb-3" onClick={() => nav(-1)}>
        ← Back to Route Selection
      </button>

      <h2 className="my-3">
        Analytics · <code>{decodedMachine}</code> · {decodedRoute}
      </h2>

      <div className="d-flex flex-wrap gap-3 my-3 align-items-center">
        <div>
          <label>From Date: </label>
          <DatePicker selected={fromDate} onChange={setFromDate} className="form-control bg-dark text-light" />
        </div>
        <div>
          <label>To Date: </label>
          <DatePicker selected={toDate} onChange={setToDate} className="form-control bg-dark text-light" />
        </div>
        <div>
          <label>From Time: </label>
          <input
            type="time"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="form-control bg-dark text-light"
          />
        </div>
        <div>
          <label>To Time: </label>
          <input
            type="time"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="form-control bg-dark text-light"
          />
        </div>
      </div>

      <div className="mb-5">
        <h5>Total Sales Over Time</h5>
        <div style={{ height: '400px' }}>
          <Bar data={salesOverTime} options={barOptions} />
        </div>

        <h5 className="mt-4">Tickets Sold Over Time</h5>
        <div style={{ height: '400px' }}>
          <Bar data={ticketCountOverTime} options={barOptions} />
        </div>

        <h5 className="mt-4">Passenger Count Per Hour</h5>
        <div style={{ height: '400px' }}>
          <Bar data={peakTimeData} options={barOptions} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <h5>Payment Mode Distribution</h5>
          <div style={{ height: '350px' }}>
            <Pie data={paymentMode} options={pieOptions} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <h5>Passenger Category Distribution</h5>
          <div style={{ height: '350px' }}>
            <Pie data={passengerTypes} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteAnalytics;
