import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const BusList = ({ buses, isAdmin, onEdit, onDelete }) => {
    // Function to format date strings
    const formatDate = (dateString) => {
        if (!dateString) return 'Not scheduled';
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    // Get status badge color based on bus status
    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'success';
            case 'MAINTENANCE':
                return 'warning';
            case 'OUT_OF_SERVICE':
                return 'danger';
            case 'SCHEDULED':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    // If there are no buses, show a message
    if (!buses || buses.length === 0) {
        return <p className="text-center py-4">No buses found.</p>;
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Bus ID</th>
                        <th>Destination</th>
                        <th>Driver</th>
                        <th>Total Seats</th>
                        <th>Available Seats</th>
                        <th>Status</th>
                        <th>Travel Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {buses.map((bus) => (
                        <tr key={bus.id}>
                            <td>{bus.id}</td>
                            <td>{bus.destination ? bus.destination.destination : 'Unassigned'}</td>
                            <td>{bus.user ? bus.user.fullName : 'Unassigned'}</td>
                            <td>{bus.totalNumberOfSeats}</td>
                            <td>{bus.numberOfAvailableSeats}</td>
                            <td>
                                <Badge bg={getStatusBadge(bus.busStatus)}>
                                    {bus.busStatus || 'Unknown'}
                                </Badge>
                            </td>
                            <td>{formatDate(bus.travelDate)}</td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(bus)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(bus.id)}
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

export default BusList;