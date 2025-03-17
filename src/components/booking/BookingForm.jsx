import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import DestinationApi from '../../api/destinationApi';
import BusApi from '../../api/busApi';
import BookingApi from '../../api/bookingApi';

const BookingForm = ({ onBookingCreated }) => {
    const { currentUser } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [availableBuses, setAvailableBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        destinationId: '',
        travelDate: '',
        busId: ''
    });

    // Fetch all destinations on component mount
    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await DestinationApi.getAllDestinations();
                setDestinations(data);
            } catch (error) {
                console.error('Error fetching destinations:', error);
                setError('Failed to load destinations. Please try again later.');
            }
        };

        fetchDestinations();
    }, []);

    // Fetch available buses when destination and date are selected
    useEffect(() => {
        const fetchAvailableBuses = async () => {
            if (!formData.destinationId || !formData.travelDate) return;

            try {
                setLoading(true);
                // This would need to be implemented in your API to filter buses by destination and date
                const data = await BusApi.getAvailableBuses(formData.destinationId, formData.travelDate);
                setAvailableBuses(data.filter(bus => bus.numberOfAvailableSeats > 0));
            } catch (error) {
                console.error('Error fetching available buses:', error);
                setError('Failed to load available buses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableBuses();
    }, [formData.destinationId, formData.travelDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear any previous errors or success messages
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.destinationId || !formData.travelDate || !formData.busId) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);

            const selectedBus = availableBuses.find(bus => bus.id.toString() === formData.busId);
            if (!selectedBus || selectedBus.numberOfAvailableSeats <= 0) {
                setError('Selected bus is no longer available');
                return;
            }

            const bookingData = {
                user: { id: currentUser.id },
                bus: { id: formData.busId },
                destination: { id: formData.destinationId },
                travelDate: formData.travelDate
            };

            const response = await BookingApi.createBooking(bookingData);

            setSuccess('Booking created successfully!');
            setFormData({
                destinationId: '',
                travelDate: '',
                busId: ''
            });

            // Call the callback function to refresh bookings list
            if (onBookingCreated) {
                onBookingCreated();
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('Failed to create booking. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="mb-3">Book a Trip</h3>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="destinationId">
                            <Form.Label>Destination</Form.Label>
                            <Form.Select
                                name="destinationId"
                                value={formData.destinationId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Destination</option>
                                {destinations.map(destination => (
                                    <option key={destination.id} value={destination.id}>
                                        {destination.destination} - ${destination.price}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="travelDate">
                            <Form.Label>Travel Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="travelDate"
                                value={formData.travelDate}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]} // Today or future dates only
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {formData.destinationId && formData.travelDate && (
                    <Form.Group className="mb-3" controlId="busId">
                        <Form.Label>Available Buses</Form.Label>
                        <Form.Select
                            name="busId"
                            value={formData.busId}
                            onChange={handleChange}
                            disabled={loading || availableBuses.length === 0}
                            required
                        >
                            <option value="">Select Bus</option>
                            {availableBuses.map(bus => (
                                <option key={bus.id} value={bus.id}>
                                    Bus #{bus.id} - {bus.numberOfAvailableSeats} seat(s) available
                                </option>
                            ))}
                        </Form.Select>
                        {availableBuses.length === 0 && !loading && (
                            <Form.Text className="text-danger">
                                No buses available for this destination and date
                            </Form.Text>
                        )}
                    </Form.Group>
                )}

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading || !formData.destinationId || !formData.travelDate || !formData.busId}
                    >
                        {loading ? 'Processing...' : 'Book Now'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default BookingForm;