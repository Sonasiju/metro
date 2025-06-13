import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RouteSelection = ({ clusters }) => {
  const { clusterId, machineId } = useParams();
  const nav = useNavigate();

  const decodedMachineId = decodeURIComponent(machineId);
  const cluster = clusters.find(c => c.id === clusterId);
  const machine = cluster?.machines.find(m => m.id === decodedMachineId);
  const routes = machine?.routes || [];

  if (!cluster || !machine) {
    return (
      <div className="container my-4 text-light">
        <button className="btn btn-outline-light mb-3" onClick={() => nav('/')}>
          ← Back to Dashboard
        </button>
        <h4>
          {cluster ? 'Machine not found in this cluster.' : 'Cluster not found.'}
        </h4>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <button className="btn btn-outline-light mb-3" onClick={() => nav('/')}>
        ← Back to Dashboard
      </button>

      <h3 className="text-white">
        Routes for <u>{decodedMachineId}</u> · <strong>{cluster.title}</strong>
      </h3>

      <div className="row mt-3">
        {routes.map((route, idx) => (
          <div key={idx} className="col-sm-6 col-md-4 mb-3">
            <div className="card h-100 shadow">
              <div className="card-body d-flex flex-column">
                <span className="badge bg-info align-self-start mb-2">•</span>

                <h5 className="card-title text-dark">{route}</h5>
                <p className="small text-muted mb-2">
                  <i className="bi bi-clock me-1" />
                  Live Data Available
                </p>

                <button
                  className="btn btn-link p-0 mt-auto align-self-start"
                  onClick={() =>
                    nav(
  `/analytics/${encodeURIComponent(machine.id)}/${encodeURIComponent(route)}`
)

                  }
                >
                  Click to view analytics →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {routes.length === 0 && (
        <p className="text-light">No routes available.</p>
      )}
    </div>
  );
};

export default RouteSelection;
