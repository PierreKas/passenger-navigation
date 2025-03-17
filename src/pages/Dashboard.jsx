import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingApi from '../api/bookingApi';
import BusApi from '../api/busApi';
import DestinationApi from '../api/destinationApi';

const Dashboard = () => {
    const { currentUser, isAdmin, isDriver, isCustomer } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalBuses: 0,
        totalDestinations: 0,
        userBookings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookings, buses, destinations] = await Promise.all([
                    BookingApi.getAllBookings(),
                    BusApi.getAllBuses(),
                    DestinationApi.getAllDestinations()
                ]);

                let userBookings = [];
                if (currentUser) {
                    if (isCustomer) {
                        // Filter bookings for current customer
                        userBookings = bookings.filter(b => b.user && b.user.id === currentUser.id);
                    } else if (isDriver) {
                        // Get buses assigned to driver, then get bookings for those buses
                        const driverBuses = buses.filter(b => b.user && b.user.id === currentUser.id);
                        userBookings = bookings.filter(b =>
                            driverBuses.some(bus => bus.id === b.bus.id)
                        );
                    }
                }

                setStats({
                    totalBookings: bookings.length,
                    totalBuses: buses.length,
                    totalDestinations: destinations.length,
                    userBookings
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, isCustomer, isDriver]);

    if (loading) {
        return <Container><p>Loading dashboard...</p></Container>;
    }

    return (
        <Container>
            <h1 className="mb-4">Dashboard</h1>
            <p>Welcome, {currentUser?.fullName}!</p>

            <Row className="mb-4">
                {isAdmin && (
                    <>
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Total Bookings</Card.Title>
                                    <Card.Text className="display-4">{stats.totalBookings}</Card.Text>
                                    <Link to="/bookings">Manage Bookings</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Total Buses</Card.Title>
                                    <Card.Text className="display-4">{stats.totalBuses}</Card.Text>
                                    <Link to="/buses">Manage Buses</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Total Destinations</Card.Title>
                                    <Card.Text className="display-4">{stats.totalDestinations}</Card.Text>
                                    <Link to="/destinations">Manage Destinations</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}

                {isDriver && (
                    <>
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>My Buses</Card.Title>
                                    <Link to="/buses">View My Buses</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>My Schedule</Card.Title>
                                    <Link to="/my-schedule">View Schedule</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}

                {isCustomer && (
                    <>
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>Book a Trip</Card.Title>
                                    <Link to="/book">Book Now</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <Card.Title>My Bookings</Card.Title>
                                    <Card.Text className="display-4">{stats.userBookings.length}</Card.Text>
                                    <Link to="/my-bookings">View Bookings</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </>
                )}
            </Row>

            {/* Recent Bookings Section */}
            {stats.userBookings.length > 0 && (
                <div className="mb-4">
                    <h2>Recent Bookings</h2>
                    <Row>
                        {stats.userBookings.slice(0, 3).map(booking => (
                            <Col md={4} key={booking.id}>
                                <Card className="mb-3">
                                    <Card.Body>
                                        <Card.Title>
                                            {booking.destination?.destination}
                                        </Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {booking.travelDate?.toString()}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            <strong>Bus:</strong> {booking.bus?.busStatus}<br />
                                            <strong>Price:</strong> ${booking.destination?.price}
                                        </Card.Text>
                                        <Link to={`/booking/${booking.id}`}>View Details</Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    {stats.userBookings.length > 3 && (
                        <div className="text-center">
                            <Link to={isCustomer ? "/my-bookings" : "/bookings"} className="btn btn-primary">
                                View All Bookings
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* Available Destinations Section */}
            {isCustomer && (
                <div className="mb-4">
                    <h2>Available Destinations</h2>
                    <Row>
                        {/* We'd need to fetch this data separately, but showing placeholder structure */}
                        <Col md={12}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Destination</th>
                                                <th>Price</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Map through destinations */}
                                            {stats.totalDestinations > 0 ? (
                                                <tr>
                                                    <td colSpan="3">Loading destinations...</td>
                                                </tr>
                                            ) : (
                                                <tr>
                                                    <td colSpan="3">No destinations available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}

            {/* Bus Fleet Overview - for admin and drivers */}
            {(isAdmin || isDriver) && (
                <div className="mb-4">
                    <h2>Bus Fleet Status</h2>
                    <Row>
                        <Col md={12}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Destination</th>
                                                <th>Travel Date</th>
                                                <th>Total Seats</th>
                                                <th>Available Seats</th>
                                                <th>Status</th>
                                                {isAdmin && <th>Driver</th>}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* This would be populated with actual bus data */}
                                        </tbody>
                                    </table>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </Container>
    );
};

export default Dashboard;