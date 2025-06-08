// src/App.jsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import RouteSelection from './pages/RouteSelection.jsx'

const clusters = [
  {
    id: 'A',
    title: 'ALUVA-AIRPORT',
    description: 'Aluva Airport Cluster - Major Hub',
    color: 'primary',
    machines: [
      {
        id: 'KL07DE9425',
        label: 'ALUVA METRO',
        routes: ['Aluva-Thripunithura', 'Aluva-Petta'],
      },
      {
        id: 'KL07DE9474',
        label: 'CIAL METRO',
        routes: ['CIAL-Ernakulam', 'CIAL-Airport'],
      },
      { id: 'KL07DE9435', routes: ['Aluva-Kakkanad'] },
      { id: 'KL07DE9485', routes: ['Airport-Vyttila'] },
      { id: 'KL07DE9492', routes: ['Aluva-Kochi Fort'] },
    ],
  },
  {
    id: 'M',
    title: 'MG ROAD',
    description: 'MG Road Central Station',
    color: 'warning',
    machines: [
      { id: 'KL07DE9405', routes: ['MG Road–Express A'] },
      { id: 'KL07DE9420', routes: ['MG Road–Infopark'] },
      { id: 'KL07DE942', routes: ['MG Road–Kalamassery'] },
    ],
  },
  {
    id: 'I',
    title: 'INFOPARK',
    description: 'Infopark Campus',
    color: 'success',
    machines: [
      {
        id: 'KL07DE9200',
        routes: [
          'Infopark–MG Road',
          'Infopark–JLN Metro',
          'Infopark–Kalamassery',
          'Infopark–Airport',
          'Infopark–Fort Kochi',
          'Infopark–Thripunithura',
          'Infopark–Aluva',
        ],
      },
      {
        id: 'KL07DE9201',
        routes: ['Infopark–Ernakulam', 'Infopark–Edappally'],
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
        id: 'KL07DE9500',
        routes: ['Kalamassery–Fort Kochi', 'Kalamassery–Aluva', 'Kalamassery–Airport'],
      },
      {
        id: 'KL07DE9501',
        routes: ['Kalamassery–Infopark', 'Kalamassery–Petta'],
      },
    ],
  },
]

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard clusters={clusters} />} />
        <Route
          path="/cluster/:clusterId/machine/:machineId"
          element={<RouteSelection clusters={clusters} />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
