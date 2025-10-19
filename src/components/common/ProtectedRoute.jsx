import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Component to protect routes that require authentication
const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { currentUser, isAuthenticated } = useAuth();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If roles are specified and user doesn't have the required role, redirect to dashboard
    if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    // If authenticated and authorized, render the child route
    return <Outlet />;
};

export default ProtectedRoute;