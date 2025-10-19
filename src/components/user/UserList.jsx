import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const UserList = ({ users, onEdit, onDelete }) => {
    // Get role badge color
    const getRoleBadge = (role) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'danger';
            case 'DRIVER':
                return 'warning';
            case 'USER':
                return 'primary';
            default:
                return 'secondary';
        }
    };

    // If there are no users, show a message
    if (!users || users.length === 0) {
        return <p className="text-center py-4">No users found.</p>;
    }

    return (
        <div className="table-responsive">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.fullName}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone || 'N/A'}</td>
                            <td>
                                <Badge bg={getRoleBadge(user.role)}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td>
                                <Badge bg={user.enabled ? 'success' : 'danger'}>
                                    {user.enabled ? 'Active' : 'Inactive'}
                                </Badge>
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => onEdit(user)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(user.id)}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserList;