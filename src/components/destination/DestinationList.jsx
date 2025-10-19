import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const DestinationList = ({ destinations, onEdit, onDelete }) => {
    // If there are no destinations, show a message
    if (!destinations || destinations.length === 0) {
        return <p className="text-center py-4">No destinations found.</p>;
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Destination</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {destinations.map((destination) => (
                        <tr key={destination.id}>
                            <td>{destination.id}</td>
                            <td>{destination.destination}</td>
                            <td>{destination.description || 'No description'}</td>
                            <td>${destination.price.toFixed(2)}</td>
                            <td>
                                <Badge bg={destination.active ? 'success' : 'danger'}>
                                    {destination.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(destination)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(destination.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default DestinationList;