
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard.jsx';
import RouteSelection from './pages/RouteSelection.jsx';
import MachineChart from './pages/MachineChart.jsx';
import RouteAnalytics from './pages/RouteAnalytics.jsx';

const clusters = [
  {
    id: 'A',
    title: 'ALUVA-AIRPORT',
    description: 'Aluva Airport Cluster - Major Hub',
    color: 'primary',
    machines: [
      {
        id: 'ALUVA METRO',
        label: 'ALUVA METRO',
        routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'],
      },
      {
        id: 'CIAL METRO',
        label: 'CIAL METRO',
        routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'],
      },
      { id: 'KL07DE9425', routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'] },
      { id: 'KL07DE9474', routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'] },
      { id: 'KL07DE9435', routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'] },
      { id: 'KL07DE9485', routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'] },
      { id: 'KL07DE9492', routes: ['Aluva MS - Airport (CIAL)', 'Airport (CIAL) - Aluva MS'] },
    ],
  },
  {
    id: 'M',
    title: 'MG ROAD',
    description: 'MG Road Central Station',
    color: 'warning',
    machines: [
      { id: 'KL07DE9442', routes: ['MG Road Metro– MG Road Metro'] },
      { id: 'KL07DE9405', routes: ['MG Road Metro– MG Road Metro'] },
      { id: 'KL07DE9420', routes: ['MG Road Metro– MG Road Metro'] },
    ],
  },
  {
    id: 'I',
    title: 'INFOPARK',
    description: 'Infopark Campus',
    color: 'success',
    machines: [
      {
        id: 'KL07DE9436',
        routes: [
          'Kalamassery MS – Infopark',
          'Kakkanad WM - Kakkanad JN',
          'Kakkanad Jn – Infopark',
          'Infopark - Kakkanad JN',
          'Kakkanad Jn - Kakkanad WM',
          'Water Metro - Infopark - Water Metro',
          'Infopark - Kalamassery MS',
        ],
      },
      {
        id: 'KL07DE9410',
        routes: [
          'Kalamassery MS – Infopark',
          'Kakkanad WM - Kakkanad JN',
          'Kakkanad Jn – Infopark',
          'Infopark - Kakkanad JN',
          'Kakkanad Jn - Kakkanad WM',
          'Water Metro - Infopark - Water Metro',
          'Infopark - Kalamassery MS',
        ],
      },
      {
        id: 'KL07DE9427',
        routes: [
          'Kalamassery MS – Infopark',
          'Kakkanad WM - Kakkanad JN',
          'Kakkanad Jn – Infopark',
          'Infopark - Kakkanad JN',
          'Kakkanad Jn - Kakkanad WM',
          'Water Metro - Infopark - Water Metro',
          'Infopark - Kalamassery MS',
        ],
      },
    ],
  },
  {
    id: 'K',
    title: 'KALAMASSERY',
    description: 'Kalamassery Technical Hub',
    color: 'danger',
    machines: [
      {
        id: 'KL07DE9437',
        routes: [
          'Kalamassery MS - Medical College',
          'Medical College - Kalamassery MS',
          'Kalamassery MS - CUSAT',
           
        ],
      },
      {
        id: 'KL07DE9416',
        routes: [
          'Kalamassery MS - Medical College',
          'Medical College - Kalamassery MS',
          'Kalamassery MS - CUSAT',
            "FACT - Kalamassery MS"
        ],
      },
    ],
  },
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard clusters={clusters} />} />
        <Route
          path="/cluster/:clusterId/machine/:machineId"
          element={<RouteSelection clusters={clusters} />}
        />
        <Route
          path="/analytics/:machineId/:routeName"
          element={<RouteAnalytics />}
        />
        <Route path="/machine-chart" element={<MachineChart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;