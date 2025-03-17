import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DestinationApi from '../api/destinationApi';

const Home = () => {
    const { isAuthenticated, isCustomer } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await DestinationApi.getAllDestinations();
                setDestinations(data);
            } catch (error) {
                console.error('Error fetching destinations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <Container>
            <div className="jumbotron bg-light p-5 rounded mb-4">
                <h1>Welcome to Passenger Navigation System</h1>
                <p className="lead">
                    Your reliable partner for bus transportation needs. Book trips easily, track your journeys,
                    and enjoy a hassle-free travel experience.
                </p>
                {!isAuthenticated ? (
                    <div>
                        <Button as={Link} to="/login" variant="primary" className="me-2">
                            Login
                        </Button>
                        <Button as={Link} to="/register" variant="outline-primary">
                            Register
                        </Button>
                    </div>
                ) : isCustomer && (
                    <Button as={Link} to="/book" variant="success">
                        Book a Trip Now
                    </Button>
                )}
            </div>

            <h2 className="mb-4">Popular Destinations</h2>

            {loading ? (
                <p>Loading destinations...</p>
            ) : (
                <Row>
                    {destinations.slice(0, 4).map((destination) => (
                        <Col key={destination.id} md={3} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{destination.destination}</Card.Title>
                                    <Card.Text>
                                        Price: ${destination.price.toFixed(2)}
                                    </Card.Text>
                                    {isCustomer && (
                                        <Button as={Link} to={`/book?destination=${destination.id}`} variant="primary" size="sm">
                                            Book Now
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Row className="my-5">
                <Col md={4}>
                    <h3>Easy Booking</h3>
                    <p>
                        Choose your destination, select a bus, and confirm your booking in just a few clicks.
                    </p>
                </Col>
                <Col md={4}>
                    <h3>Safe Travel</h3>
                    <p>
                        All our buses are regularly maintained and operated by professional drivers.
                    </p>
                </Col>
                <Col md={4}>
                    <h3>Customer Support</h3>
                    <p>
                        Our customer support team is available to assist you with any questions or concerns.
                    </p>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;