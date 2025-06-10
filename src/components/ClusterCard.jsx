import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'

const ClusterCard = ({ cluster }) => {
  const navigate = useNavigate()
  const bg = ['light', 'white'].includes(cluster.color.toLowerCase()) ? 'secondary' : cluster.color.toLowerCase()

  return (
    <Card bg={bg} text="white" className="mb-3">
      <Card.Header>{cluster.title}</Card.Header>
      <Card.Body>
        <Card.Text>{cluster.description}</Card.Text>
        {cluster.machines.map((machine) => (
          <Button
            key={machine.id}
            variant="outline-light"
            className="me-2 mt-2"
            onClick={() =>
              navigate(`/cluster/${cluster.id}/machine/${machine.id}`)
            }
          >
            {machine.label || machine.id}
          </Button>
        ))}
      </Card.Body>
    </Card>
  )
}

export default ClusterCard;