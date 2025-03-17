import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';

const UserForm = ({ user, onUserSaved, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        id: user?.id || null,
        fullName: user?.fullName || '',
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        phone: user?.phone || '',
        address: user?.address || '',
        gender: user?.gender || '',
        role: user?.role || 'USER',
        enabled: user?.enabled !== undefined ? user.enabled : true
    });

    const userRoles = [
        { value: 'USER', label: 'Customer' },
        { value: 'DRIVER', label: 'Driver' },
        { value: 'ADMIN', label: 'Administrator' }
    ];

    const genderOptions = [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
        { value: 'OTHER', label: 'Other' },
        { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear any previous errors
        setError('');
    };

    const validateForm = () => {
        // Required fields validation
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return false;
        }

        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Password required for new users
        if (!user && !formData.password) {
            setError('Password is required for new users');
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
            const userData = {
                ...(formData.id && { id: formData.id }),
                fullName: formData.fullName.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                ...(formData.password && { password: formData.password }),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
                gender: formData.gender,
                role: formData.role,
                enabled: formData.enabled
            };

            // Call the callback function to save the user
            onUserSaved(userData);
        } catch (error) {
            console.error('Error saving user:', error);
            setError('Failed to save user. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="mb-3">{user ? 'Edit User' : 'Add New User'}</h3>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="fullName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="email">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="password">
                            <Form.Label>{user ? 'New Password (leave blank to keep current)' : 'Password'}</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={user ? 'Enter new password' : 'Enter password'}
                                required={!user}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="phone">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="gender">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                {genderOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        rows={2}
                    />
                </Form.Group>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="role">
                            <Form.Label>User Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                {userRoles.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group className="mt-4" controlId="enabled">
                            <Form.Check
                                type="checkbox"
                                name="enabled"
                                label="Account Active"
                                checked={formData.enabled}
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
                        {loading ? 'Saving...' : (user ? 'Update User' : 'Add User')}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default UserForm;