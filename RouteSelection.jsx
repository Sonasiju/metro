import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const RouteSelection = ({ clusters }) => {
  const { clusterId, machineId } = useParams()
  const nav = useNavigate()
  const cluster = clusters.find(c => c.id === clusterId)
  const machine = cluster?.machines.find(m => m.id === machineId)
  const routes = machine?.routes || []

  return (
    <div className="container my-4">
      <button className="btn btn-outline-light mb-3" onClick={() => nav('/')}>
        ← Back to Dashboard
      </button>
      <h3 className="text-white">
        Routes for <u>{machineId}</u> · <strong>{cluster?.title}</strong>
      </h3>
      <div className="row mt-3">
        {routes.map((rt, idx) => (
          <div key={idx} className="col-sm-6 col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <span className="badge bg-info mb-2">•</span>
                <h5 className="card-title text-dark">{rt}</h5>
                <p className="small text-muted mb-2"><i className="bi bi-clock"></i> Live Data Available</p>
                <button
                  className="btn btn-link p-0"
                  onClick={() => alert(`Analytics: ${rt}`)}
                >
                  Click to view analytics →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {routes.length === 0 && <p className="text-light">No routes available.</p>}
    </div>
  )
}

export default RouteSelection
