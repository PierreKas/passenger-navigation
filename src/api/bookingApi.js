import api from './axiosConfig';

export const BookingApi = {
    getAllBookings: async () => {
        try {
            const response = await api.get('/booking/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching bookings:', error);
            throw error;
        }
    },

    getBookingById: async (id) => {
        try {
            const response = await api.get(`/booking/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching booking with id ${id}:`, error);
            throw error;
        }
    },

    createBooking: async (bookingData) => {
        try {
            const response = await api.post('/booking/add', bookingData);
            return response.data;
        } catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    },

    updateBooking: async (id, bookingData) => {
        try {
            const response = await api.put(`/booking/update/${id}`, bookingData);
            return response.data;
        } catch (error) {
            console.error(`Error updating booking with id ${id}:`, error);
            throw error;
        }
    },

    deleteBooking: async (id) => {
        try {
            const response = await api.delete(`/booking/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting booking with id ${id}:`, error);
            throw error;
        }
    }
};

export default BookingApi;