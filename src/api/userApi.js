import api from './axiosConfig';

export const UserApi = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/users/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user with id ${id}:`, error);
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const response = await api.post('/users/add', userData);
            return response.data;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const response = await api.put(`/users/update/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error(`Error updating user with id ${id}:`, error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/users/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            throw error;
        }
    }
};

export default UserApi;