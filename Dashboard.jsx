import React from 'react'
import { useNavigate } from 'react-router-dom'
import ClusterCard from '../components/ClusterCard.jsx'

const Dashboard = ({ clusters }) => {
  const nav = useNavigate()
  const totalMachines = clusters.reduce((tot, c) => tot + c.machines.length, 0)

  return (
    <div className="container my-4">
      <div className="text-white mb-4">
        <h2 className="fw-bold">🚇 Metro Dashboard</h2>
        <p className="text-secondary">Cluster Management System</p>
        <div className="d-flex gap-3 mt-3 flex-wrap">
          <div className="metric-card"><strong>{clusters.length}</strong><span>Clusters</span></div>
          <div className="metric-card"><strong>{totalMachines}</strong><span>Machines</span></div>
          <div className="metric-card"><strong>
            {clusters.reduce((sum, c) => sum + (c.machines[0]?.routes.length || 0) + (c.machines[1]?.routes.length || 0), 0)}
          </strong><span>Routes</span></div>
        </div>
      </div>
      <div className="row">
        {clusters.map(cluster => (
  <div key={cluster.id} className="col-md-6 mb-4">
    <ClusterCard
      cluster={cluster}
      onClick={() => nav(`/cluster/${cluster.id}`)}
    />
  </div>
))}

      </div>
    </div>
  )
}

export default Dashboard
