import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const BookingDetails = ({ booking, onClose, onCancel }) => {
    if (!booking) {
        return <p>No booking details available.</p>;
    }

    // Function to format date strings
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMMM dd, yyyy');
        } catch (error) {
            return dateString;
        }
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

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Booking Details</h5>
                <Badge bg={getStatusColor(booking.travelDate)}>
                    {getStatus(booking.travelDate)}
                </Badge>
            </Card.Header>
            <Card.Body>
                <Row className="mb-3">
                    <Col xs={12} md={6}>
                        <p className="mb-1"><strong>Booking ID:</strong> {booking.id}</p>
                        <p className="mb-1"><strong>Customer:</strong> {booking.user ? booking.user.fullName : 'Unknown'}</p>
                        <p className="mb-1"><strong>Customer Gender:</strong> {booking.user ? booking.user.gender : 'Unknown'}</p>
                        <p className="mb-1"><strong>Customer Address:</strong> {booking.user ? booking.user.address : 'Not provided'}</p>
                    </Col>
                    <Col xs={12} md={6}>
                        <p className="mb-1"><strong>Destination:</strong> {booking.destination ? booking.destination.destination : 'Unknown'}</p>
                        <p className="mb-1"><strong>Price:</strong> ${booking.destination ? booking.destination.price.toFixed(2) : '0.00'}</p>
                        <p className="mb-1"><strong>Travel Date:</strong> {formatDate(booking.travelDate)}</p>
                        <p className="mb-1"><strong>Bus Number:</strong> {booking.bus ? `Bus #${booking.bus.id}` : 'N/A'}</p>
                    </Col>
                </Row>

                {booking.bus && (
                    <div className="mt-4">
                        <h6>Bus Information</h6>
                        <Row>
                            <Col xs={12} md={6}>
                                <p className="mb-1"><strong>Total Seats:</strong> {booking.bus.totalNumberOfSeats}</p>
                                <p className="mb-1"><strong>Available Seats:</strong> {booking.bus.numberOfAvailableSeats}</p>
                            </Col>
                            <Col xs={12} md={6}>
                                <p className="mb-1"><strong>Status:</strong> {booking.bus.busStatus}</p>
                                <p className="mb-1"><strong>Driver:</strong> {booking.bus.user ? booking.bus.user.fullName : 'Unassigned'}</p>
                            </Col>
                        </Row>
                    </div>
                )}

                <div className="d-flex justify-content-end mt-4">
                    {!isBookingPast(booking.travelDate) && (
                        <Button
                            variant="danger"
                            className="me-2"
                            onClick={() => onCancel(booking.id)}
                        >
                            Cancel Booking
                        </Button>
                    )}
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default BookingDetails;