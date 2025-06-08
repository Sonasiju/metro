import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClusterView from "./ClusterView";
import RouteSelection from "./RouteSelection";
import clusters from "./data";
import ClusterCard from "./ClusterCard";
import "./index.css";

const Dashboard = () => {
  return (
    <div className="app-container min-h-screen bg-[#0A0E2A] text-white">
      <header className="app-header py-6 text-center bg-[#151B3C] shadow-md">
        <h1 className="text-3xl font-bold">Metro Dashboard</h1>
      </header>

      <div className="card-grid p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {clusters.map((cluster, index) => (
          <ClusterCard key={index} {...cluster} />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/routes/:machineId" element={<RouteSelection />} />
      </Routes>
    </Router>
  );
}
