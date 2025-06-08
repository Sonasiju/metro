// ClusterView.jsx
import React from "react";
import "./ClusterView.css";

export default function ClusterView({ cluster, onBack }) {
  return (
    <div className="cluster-view">
      <div className="header">
        <div className={`icon ${cluster.color}`}>{cluster.icon}</div>
        <div>
          <h2>{cluster.name}</h2>
          <p>{cluster.description}</p>
        </div>
      </div>

      <div className="stats">
        <div>
          <strong>{cluster.routes}</strong>
          <span>Routes</span>
        </div>
        <div>
          <strong>{cluster.passengers}</strong>
          <span>Daily Passengers</span>
        </div>
        <div>
          <strong>{cluster.revenue}</strong>
          <span>Revenue</span>
        </div>
      </div>

      <h4>Machine IDs</h4>
      <div className="machine-grid">
        {cluster.machines.map((m, i) => (
          <div key={i} className="machine-id">
            {m}
          </div>
        ))}
      </div>

      <button className={`view-analytics ${cluster.color}`}>View Analytics</button>
      <button className="back-btn" onClick={onBack}>Back</button>
    </div>
  );
}
