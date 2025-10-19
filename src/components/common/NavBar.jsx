import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
    const { currentUser, logout, isAdmin, isDriver, isCustomer } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/">Passenger Navigation System</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        {currentUser && (
                            <>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>

                                {/* Admin can access everything */}
                                {isAdmin && (
                                    <>
                                        <NavDropdown title="Management" id="admin-nav-dropdown">
                                            <NavDropdown.Item as={Link} to="/users">User Management</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/buses">Bus Management</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/destinations">Destination Management</NavDropdown.Item>
                                            <NavDropdown.Item as={Link} to="/bookings">Booking Management</NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                )}

                                {/* Driver can see buses and their bookings */}
                                {isDriver && (
                                    <>
                                        <Nav.Link as={Link} to="/buses">My Buses</Nav.Link>
                                        <Nav.Link as={Link} to="/my-schedule">My Schedule</Nav.Link>
                                    </>
                                )}

                                {/* Customer can book trips and see their bookings */}
                                {isCustomer && (
                                    <>
                                        <Nav.Link as={Link} to="/book">Book a Trip</Nav.Link>
                                        <Nav.Link as={Link} to="/my-bookings">My Bookings</Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                    </Nav>

                    <Nav>
                        {currentUser ? (
                            <NavDropdown title={currentUser.fullName || 'Profile'} id="user-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;