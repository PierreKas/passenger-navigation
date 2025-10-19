import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const DestinationForm = ({ destination, onDestinationSaved, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        id: destination?.id || null,
        destination: destination?.destination || '',
        description: destination?.description || '',
        price: destination?.price || '',
        active: destination?.active !== undefined ? destination.active : true
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear any previous errors
        setError('');
    };

    const handlePriceChange = (e) => {
        const value = e.target.value;

        // Allow empty string or valid decimal number
        if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
            setFormData({
                ...formData,
                price: value
            });
        }
    };

    const validateForm = () => {
        if (!formData.destination.trim()) {
            setError('Destination name is required');
            return false;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError('Price must be greater than 0');
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
            const destinationData = {
                ...(formData.id && { id: formData.id }),
                destination: formData.destination.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                active: formData.active
            };

            // Call the callback function to save the destination
            onDestinationSaved(destinationData);
        } catch (error) {
            console.error('Error saving destination:', error);
            setError('Failed to save destination. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="mb-3">{destination ? 'Edit Destination' : 'Add New Destination'}</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="destination">
                    <Form.Label>Destination Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Enter destination name"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter destination description"
                        rows={3}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="price">
                            <Form.Label>Price ($)</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handlePriceChange}
                                placeholder="0.00"
                                step="0.01"
                                min="0.01"
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mt-4" controlId="active">
                            <Form.Check
                                type="checkbox"
                                name="active"
                                label="Active"
                                checked={formData.active}
                                onChange={handleChange}
                            />
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
                        {loading ? 'Saving...' : (destination ? 'Update Destination' : 'Add Destination')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default DestinationForm;