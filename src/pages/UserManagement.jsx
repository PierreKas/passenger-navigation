// import React, { useState, useEffect } from 'react';
// import { Container, Card, Tabs, Tab } from 'react-bootstrap';
// import { useAuth } from '../context/AuthContext';
// import UserList from '../components/user/UserList';
// import UserForm from '../components/user/UserForm';
// import Loading from '../components/common/Loading';
// import UserApi from '../api/userApi';

// const UserManagement = () => {
//     const { isAdmin } = useAuth();
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('list');
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [refreshKey, setRefreshKey] = useState(0);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 setLoading(true);
//                 const data = await UserApi.getAllUsers();
//                 setUsers(data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (isAdmin) {
//             fetchUsers();
//         } else {
//             setLoading(false);
//         }
//     }, [isAdmin, refreshKey]);

//     const handleUserCreated = () => {
//         // Refresh the user list
//         setRefreshKey(oldKey => oldKey + 1);
//         // Switch to list tab
//         setActiveTab('list');
//         // Clear selected user
//         setSelectedUser(null);
//     };

//     const handleEditUser = (user) => {
//         setSelectedUser(user);
//         setActiveTab('form');
//     };

//     const handleDeleteUser = async (userId) => {
//         try {
//             await UserApi.deleteUser(userId);
//             setUsers(users.filter(user => user.id !== userId));
//         } catch (error) {
//             console.error('Error deleting user:', error);
//         }
//     };

//     const handleCancelEdit = () => {
//         setSelectedUser(null);
//         setActiveTab('list');
//     };

//     if (loading) {
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
//             <h1 className="mb-4">User Management</h1>

//             <Card>
//                 <Card.Body>
//                     <Tabs
//                         activeKey={activeTab}
//                         onSelect={(k) => setActiveTab(k)}
//                         className="mb-3"
//                     >
//                         <Tab eventKey="list" title="User List">
//                             <UserList
//                                 users={users}
//                                 onEdit={handleEditUser}
//                                 onDelete={handleDeleteUser}
//                             />
//                         </Tab>

//                         <Tab eventKey="form" title={selectedUser ? "Edit User" : "Add New User"}>
//                             <UserForm
//                                 user={selectedUser}
//                                 onUserSaved={handleUserCreated}
//                                 onCancel={handleCancelEdit}
//                             />
//                         </Tab>
//                     </Tabs>
//                 </Card.Body>
//             </Card>
//         </Container>
//     );
// };

// export default UserManagement;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserList from '../components/user/UserList';
import UserForm from '../components/user/UserForm';
import UserApi from '../api/userApi';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Fetch all users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await UserApi.getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddClick = () => {
        setCurrentUser(null);
        setShowForm(true);
    };

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setShowForm(true);
    };

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!userToDelete) return;

        try {
            await UserApi.deleteUser(userToDelete);
            toast.success('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user. Please try again later.');
        } finally {
            setShowDeleteModal(false);
            setUserToDelete(null);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setCurrentUser(null);
    };

    const handleSaveUser = async (userData) => {
        try {
            if (userData.id) {
                await UserApi.updateUser(userData.id, userData);
                toast.success('User updated successfully');
            } else {
                await UserApi.createUser(userData);
                toast.success('User added successfully');
            }

            setShowForm(false);
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Failed to save user. Please try again later.');
        }
    };

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2>User Management</h2>
                </Col>
                <Col xs="auto">
                    <Button variant="primary" onClick={handleAddClick}>
                        Add New User
                    </Button>
                </Col>
            </Row>

            <Card>
                <Card.Body>
                    {showForm ? (
                        <UserForm
                            user={currentUser}
                            onUserSaved={handleSaveUser}
                            onCancel={handleCancelForm}
                        />
                    ) : (
                        <>
                            {loading ? (
                                <p>Loading users...</p>
                            ) : (
                                <UserList
                                    users={users}
                                    onEdit={handleEditClick}
                                    oonDelete={handleDeleteClick}
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
                    Are you sure you want to delete this user? This action cannot be undone.
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

export default UserManagement;