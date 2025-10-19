// import React, { useState, useEffect } from 'react';
// import { Container, Card, Tabs, Tab, Row, Col } from 'react-bootstrap';
// import { useAuth } from '../context/AuthContext';
// import DestinationList from '../components/destination/DestinationList';
// import DestinationForm from '../components/destination/DestinationForm';
// import Loading from '../components/common/Loading';
// import DestinationApi from '../api/destinationApi';

// const DestinationManagement = () => {
//     const { isAdmin } = useAuth();
//     const [destinations, setDestinations] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('list');
//     const [selectedDestination, setSelectedDestination] = useState(null);
//     const [refreshKey, setRefreshKey] = useState(0);

//     useEffect(() => {
//         const fetchDestinations = async () => {
//             try {
//                 setLoading(true);
//                 const data = await DestinationApi.getAllDestinations();
//                 setDestinations(data);
//             } catch (error) {
//                 console.error('Error fetching destinations:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDestinations();
//     }, [refreshKey]);

//     const handleDestinationCreated = () => {
//         // Refresh the destination list
//         setRefreshKey(oldKey => oldKey + 1);
//         // Switch to list tab
//         setActiveTab('list');
//         // Clear selected destination
//         setSelectedDestination(null);
//     };

//     const handleEditDestination = (destination) => {
//         setSelectedDestination(destination);
//         setActiveTab('form');
//     };

//     const handleDeleteDestination = async (destinationId) => {
//         try {
//             await DestinationApi.deleteDestination(destinationId);
//             setDestinations(destinations.filter(dest => dest.id !== destinationId));
//         } catch (error) {
//             console.error('Error deleting destination:', error);
//         }
//     };

//     const handleCancelEdit = () => {
//         setSelectedDestination(null);
//         setActiveTab('list');
//     };

//     if (loading && destinations.length === 0) {
//         return <Loading />;
//     }

//     if (!isAdmin) {
//         return (
//             <Container className="py-4">
//                 <Card>
//                     <Card.Body className="text-center">
//                         <h3>Access Denied</h3>
//                         <p>You don't have permission to access this page.</p>
//                     </Card.Body>
//                 </Card>
//             </Container>
//         );
//     }

//     return (
//         <Container className="py-4">
//             <h1 className="mb-4">Destination Management</h1>

//             <Card>
//                 <Card.Body>
//                     <Tabs
//                         activeKey={activeTab}
//                         onSelect={(k) => setActiveTab(k)}
//                         className="mb-3"
//                     >
//                         <Tab eventKey="list" title="Destination List">
//                             <DestinationList
//                                 destinations={destinations}
//                                 onEdit={handleEditDestination}
//                                 onDelete={handleDeleteDestination}
//                             />
//                         </Tab>

//                         <Tab eventKey="form" title={selectedDestination ? "Edit Destination" : "Add New Destination"}>
//                             <DestinationForm
//                                 destination={selectedDestination}
//                                 onDestinationSaved={handleDestinationCreated}
//                                 onCancel={handleCancelEdit}
//                             />
//                         </Tab>
//                     </Tabs>
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };

// export default DestinationManagement;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DestinationList from '../components/destination/DestinationList';
import DestinationForm from '../components/destination/DestinationForm';
import DestinationApi from '../api/destinationApi';

const DestinationManagement = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentDestination, setCurrentDestination] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [destinationToDelete, setDestinationToDelete] = useState(null);

    // Fetch all destinations
    const fetchDestinations = async () => {
        try {
            setLoading(true);
            const data = await DestinationApi.getAllDestinations();
            setDestinations(data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
            toast.error('Failed to load destinations. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestinations();
    }, []);

    const handleAddClick = () => {
        setCurrentDestination(null);
        setShowForm(true);
    };

    const handleEditClick = (destination) => {
        setCurrentDestination(destination);
        setShowForm(true);
    };

    const handleDeleteClick = (destinationId) => {
        setDestinationToDelete(destinationId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!destinationToDelete) return;

        try {
            await DestinationApi.deleteDestination(destinationToDelete);
            toast.success('Destination deleted successfully');
            fetchDestinations();
        } catch (error) {
            console.error('Error deleting destination:', error);
            toast.error('Failed to delete destination. Please try again later.');
        } finally {
            setShowDeleteModal(false);
            setDestinationToDelete(null);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setCurrentDestination(null);
    };

    const handleSaveDestination = async (destinationData) => {
        try {
            if (destinationData.id) {
                await DestinationApi.updateDestination(destinationData.id, destinationData);
                toast.success('Destination updated successfully');
            } else {
                await DestinationApi.createDestination(destinationData);
                toast.success('Destination added successfully');
            }

            setShowForm(false);
            fetchDestinations();
        } catch (error) {
            console.error('Error saving destination:', error);
            toast.error('Failed to save destination. Please try again later.');
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>Destination Management</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={handleAddClick}>
                        Add New Destination
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {showForm ? (
                        <DestinationForm
                            destination={currentDestination}
                            onDestinationSaved={handleSaveDestination}
                            onCancel={handleCancelForm}
                        />
                    ) : (
                        <>
                            {loading ? (
                                <p>Loading destinations...</p>
                            ) : (
                                <DestinationList
                                    destinations={destinations}
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
                    Are you sure you want to delete this destination? This action cannot be undone, and it may affect existing bookings.
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

export default DestinationManagement;