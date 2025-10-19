import api from './axiosConfig';

export const BusApi = {
    getAllBuses: async () => {
        try {
            const response = await api.get('/bus/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching buses:', error);
            throw error;
        }
    },

    getBusById: async (id) => {
        try {
            const response = await api.get(`/bus/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching bus with id ${id}:`, error);
            throw error;
        }
    },

    createBus: async (busData) => {
        try {
            const response = await api.post('/bus/add', busData);
            return response.data;
        } catch (error) {
            console.error('Error creating bus:', error);
            throw error;
        }
    },

    updateBus: async (id, busData) => {
        try {
            const response = await api.put(`/bus/update/${id}`, busData);
            return response.data;
        } catch (error) {
            console.error(`Error updating bus with id ${id}:`, error);
            throw error;
        }
    },

    deleteBus: async (id) => {
        try {
            const response = await api.delete(`/bus/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting bus with id ${id}:`, error);
            throw error;
        }
    }
};

export default BusApi;