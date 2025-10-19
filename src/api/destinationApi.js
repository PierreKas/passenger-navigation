import api from './axiosConfig';

export const DestinationApi = {
    getAllDestinations: async () => {
        try {
            const response = await api.get('/destination/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching destinations:', error);
            throw error;
        }
    },

    getDestinationById: async (id) => {
        try {
            const response = await api.get(`/destination/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching destination with id ${id}:`, error);
            throw error;
        }
    },

    createDestination: async (destinationData) => {
        try {
            const response = await api.post('/destination/add', destinationData);
            return response.data;
        } catch (error) {
            console.error('Error creating destination:', error);
            throw error;
        }
    },

    updateDestination: async (id, destinationData) => {
        try {
            const response = await api.put(`/destination/update/${id}`, destinationData);
            return response.data;
        } catch (error) {
            console.error(`Error updating destination with id ${id}:`, error);
            throw error;
        }
    },

    deleteDestination: async (id) => {
        try {
            const response = await api.delete(`/destination/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting destination with id ${id}:`, error);
            throw error;
        }
    }
};

export default DestinationApi;