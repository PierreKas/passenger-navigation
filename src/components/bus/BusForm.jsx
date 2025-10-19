import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import DestinationApi from '../../api/destinationApi';
import UserApi from '../../api/userApi';

const BusForm = ({ bus, onBusSaved, onCancel }) => {
    const { isAdmin } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        id: bus?.id || null,
        destinationId: bus?.destination?.id || '',
        userId: bus?.user?.id || '',
        totalNumberOfSeats: bus?.totalNumberOfSeats || 50,
        numberOfAvailableSeats: bus?.numberOfAvailableSeats || 50,
        busStatus: bus?.busStatus || 'ACTIVE',
        travelDate: bus?.travelDate ? bus.travelDate.split('T')[0] : ''
    });

    const busStatuses = [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'MAINTENANCE', label: 'Under Maintenance' },
        { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
        { value: 'SCHEDULED', label: 'Scheduled' }
    ];

    // Fetch all destinations and drivers on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [destinationsData, usersData] = await Promise.all([
                    DestinationApi.getAllDestinations(),
                    UserApi.getAllUsers()
                ]);

                setDestinations(destinationsData);
                // Filter users to get only drivers
                setDrivers(usersData.filter(user => user.role === 'DRIVER'));
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load form data. Please try again later.');
            }
        };

        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for seat numbers to ensure they are positive integers
        if (name === 'totalNumberOfSeats' || name === 'numberOfAvailableSeats') {
            const numValue = parseInt(value, 10);

            setFormData({
                ...formData,
                [name]: isNaN(numValue) ? '' : Math.max(0, numValue)
            });

            // Automatically update available seats when total seats change
            if (name === 'totalNumberOfSeats' && !isNaN(numValue) && (!bus || formData.numberOfAvailableSeats >= formData.totalNumberOfSeats)) {
                setFormData(prev => ({
                    ...prev,
                    [name]: Math.max(0, numValue),
                    numberOfAvailableSeats: Math.max(0, numValue)
                }));
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear any previous errors
        setError('');
    };

    const validateForm = () => {
        if (!formData.destinationId) {
            setError('Please select a destination');
            return false;
        }

        if (isAdmin && !formData.userId) {
            setError('Please assign a driver');
            return false;
        }

        if (!formData.totalNumberOfSeats || formData.totalNumberOfSeats <= 0) {
            setError('Total number of seats must be greater than 0');
            return false;
        }

        if (formData.numberOfAvailableSeats > formData.totalNumberOfSeats) {
            setError('Available seats cannot exceed total seats');
            return false;
        }

        if (!formData.busStatus) {
            setError('Please select a bus status');
            return false;
        }

        if (formData.busStatus === 'SCHEDULED' && !formData.travelDate) {
            setError('Travel date is required for scheduled buses');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            // Prepare data for API
            const busData = {
                ...(formData.id && { id: formData.id }),
                destination: { id: formData.destinationId },
                user: { id: formData.userId },
                totalNumberOfSeats: formData.totalNumberOfSeats,
                numberOfAvailableSeats: formData.numberOfAvailableSeats,
                busStatus: formData.busStatus,
                travelDate: formData.travelDate || null
            };

            // Call the callback function to save the bus
            onBusSaved(busData);
        } catch (error) {
            console.error('Error saving bus:', error);
            setError('Failed to save bus. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="mb-3">{bus ? 'Edit Bus' : 'Add New Bus'}</h3>

            {error && <Alert variant="danger">{error}</Alert>}

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
                                        {destination.destination}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="userId">
                            <Form.Label>Driver</Form.Label>
                            <Form.Select
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required={isAdmin}
                                disabled={!isAdmin}
                            >
                                <option value="">Assign Driver</option>
                                {drivers.map(driver => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.fullName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="totalNumberOfSeats">
                            <Form.Label>Total Number of Seats</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalNumberOfSeats"
                                value={formData.totalNumberOfSeats}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="numberOfAvailableSeats">
                            <Form.Label>Available Seats</Form.Label>
                            <Form.Control
                                type="number"
                                name="numberOfAvailableSeats"
                                value={formData.numberOfAvailableSeats}
                                onChange={handleChange}
                                min="0"
                                max={formData.totalNumberOfSeats}
                                required
                            />
                            <Form.Text className="text-muted">
                                Cannot exceed total seats ({formData.totalNumberOfSeats})
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="busStatus">
                            <Form.Label>Bus Status</Form.Label>
                            <Form.Select
                                name="busStatus"
                                value={formData.busStatus}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Status</option>
                                {busStatuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
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
                                required={formData.busStatus === 'SCHEDULED'}
                                disabled={formData.busStatus !== 'SCHEDULED' && formData.busStatus !== 'ACTIVE'}
                            />
                            <Form.Text className="text-muted">
                                Required for scheduled buses
                            </Form.Text>
                        </Form.Group>
                    </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        className="me-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : (bus ? 'Update Bus' : 'Add Bus')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default BusForm;