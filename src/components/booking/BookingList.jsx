import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

const BookingList = ({ bookings, isAdmin, onDelete }) => {
    // Function to format date strings
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
    };

    // If there are no bookings, show a message
    if (!bookings || bookings.length === 0) {
        return <p className="text-center py-4">No bookings found.</p>;
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        {isAdmin && <th>Customer</th>}
                        <th>Destination</th>
                        <th>Travel Date</th>
                        <th>Bus Number</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td>{booking.id}</td>
                            {isAdmin && (
                                <td>{booking.user ? booking.user.fullName : 'Unknown'}</td>
                            )}
                            <td>{booking.destination ? booking.destination.destination : 'Unknown'}</td>
                            <td>{formatDate(booking.travelDate)}</td>
                            <td>{booking.bus ? `Bus #${booking.bus.id}` : 'N/A'}</td>
                            <td>
                                ${booking.destination ? booking.destination.price.toFixed(2) : '0.00'}
                            </td>
                            <td>
                                <Badge bg={getStatusColor(booking.travelDate)}>
                                    {getStatus(booking.travelDate)}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(booking.id)}
                                    disabled={isBookingPast(booking.travelDate)}
                                >
                                    Cancel
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

// Helper function to determine if a booking is in the past
const isBookingPast = (travelDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(travelDate);
    return bookingDate < today;
};

// Helper function to get booking status based on travel date
const getStatus = (travelDate) => {
    if (isBookingPast(travelDate)) {
        return 'Completed';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(travelDate);

    if (
        bookingDate.getDate() === today.getDate() &&
        bookingDate.getMonth() === today.getMonth() &&
        bookingDate.getFullYear() === today.getFullYear()
    ) {
        return 'Today';
    }

    return 'Upcoming';
};

// Helper function to get status color
const getStatusColor = (travelDate) => {
    const status = getStatus(travelDate);
    switch (status) {
        case 'Completed':
            return 'secondary';
        case 'Today':
            return 'success';
        case 'Upcoming':
            return 'primary';
        default:
            return 'info';
    }
};

export default BookingList;