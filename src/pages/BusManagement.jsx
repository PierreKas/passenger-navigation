import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import BusList from '../components/bus/BusList';
import BusForm from '../components/bus/BusForm';
import BusApi from '../api/busApi';
import { useAuth } from '../context/AuthContext';

const BusManagement = () => {
    const { isAdmin, currentUser } = useAuth();
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentBus, setCurrentBus] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [busToDelete, setBusToDelete] = useState(null);

    // Fetch all buses
    const fetchBuses = async () => {
        try {
            setLoading(true);
            let data;

            if (isAdmin) {
                data = await BusApi.getAllBuses();
            } else {
                // If user is a driver, only show their buses
                data = await BusApi.getBusesByDriver(currentUser.id);
            }

            setBuses(data);
        } catch (error) {
            console.error('Error fetching buses:', error);
            toast.error('Failed to load buses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, [isAdmin, currentUser]);

    const handleAddClick = () => {
        setCurrentBus(null);
        setShowForm(true);
    };

    const handleEditClick = (bus) => {
        setCurrentBus(bus);
        setShowForm(true);
    };

    const handleDeleteClick = (busId) => {
        setBusToDelete(busId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!busToDelete) return;

        try {
            await BusApi.deleteBus(busToDelete);
            toast.success('Bus deleted successfully');
            fetchBuses();
        } catch (error) {
            console.error('Error deleting bus:', error);
            toast.error('Failed to delete bus. Please try again later.');
        } finally {
            setShowDeleteModal(false);
            setBusToDelete(null);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setCurrentBus(null);
    };

    const handleSaveBus = async (busData) => {
        try {
            if (busData.id) {
                await BusApi.updateBus(busData.id, busData);
                toast.success('Bus updated successfully');
            } else {
                await BusApi.createBus(busData);
                toast.success('Bus added successfully');
            }

            setShowForm(false);
            fetchBuses();
        } catch (error) {
            console.error('Error saving bus:', error);
            toast.error('Failed to save bus. Please try again later.');
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Bus Management</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={handleAddClick}>
                        Add New Bus
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {showForm ? (
                        <BusForm
                            bus={currentBus}
                            onBusSaved={handleSaveBus}
                            onCancel={handleCancelForm}
                        />
                    ) : (
                        <>
                            {loading ? (
                                <p>Loading buses...</p>
                            ) : (
                                <BusList
                                    buses={buses}
                                    isAdmin={isAdmin}
                                    onEdit={handleEditClick}
                                    onDelete={handleDeleteClick}
                                />
                            )}
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this bus? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default BusManagement;