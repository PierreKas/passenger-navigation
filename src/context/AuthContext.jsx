import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is stored in localStorage on initial load
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login function
    const login = (userData) => {
        // In a real app, this would include API authentication
        // For now, we'll just store the user in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    // Check if user has specific role
    const hasRole = (role) => {
        return currentUser && currentUser.role === role;
    };

    const value = {
        currentUser,
        login,
        logout,
        hasRole,
        isAdmin: currentUser?.role === 'ADMIN',
        isDriver: currentUser?.role === 'DRIVER',
        isCustomer: currentUser?.role === 'CUSTOMER',
        isAuthenticated: !!currentUser
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;