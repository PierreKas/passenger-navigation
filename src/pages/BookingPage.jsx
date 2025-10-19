import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/booking/BookingForm';
import BookingList from '../components/booking/BookingList';
import Loading from '../components/common/Loading';
import BookingApi from '../api/bookingApi';

const BookingPage = () => {
    const { currentUser, isAdmin, isCustomer } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('list');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                let data;

                if (isAdmin) {
                    // Admin sees all bookings
                    data = await BookingApi.getAllBookings();
                } else {
                    // Customer sees only their bookings
                    data = await BookingApi.getUserBookings(currentUser.id);
                }

                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [currentUser, isAdmin, refreshKey]);

    const handleBookingCreated = () => {
        // Refresh the booking list
        setRefreshKey(oldKey => oldKey + 1);
        // Switch to list tab
        setActiveTab('list');
    };

    const handleBookingDeleted = async (bookingId) => {
        try {
            await BookingApi.deleteBooking(bookingId);
            setBookings(bookings.filter(booking => booking.id !== bookingId));
        } catch (error) {
            console.error('Error deleting booking:', error);
        }
    };

    if (loading && bookings.length === 0) {
        return <Loading />;
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">{isAdmin ? 'Booking Management' : 'My Bookings'}</h1>

            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="list" title="Booking List">
                            <BookingList
                                bookings={bookings}
                                isAdmin={isAdmin}
                                onDelete={handleBookingDeleted}
                            />
                        </Tab>

                        {isCustomer && (
                            <Tab eventKey="create" title="Book a Trip">
                                <BookingForm onBookingCreated={handleBookingCreated} />
                            </Tab>
                        )}
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default BookingPage;