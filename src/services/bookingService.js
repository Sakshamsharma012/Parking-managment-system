import api from './api';

/**
 * Service for booking operations.
 */
const bookingService = {
  async createBooking(slotId, startTime, endTime) {
    const response = await api.post('/bookings', { slotId, startTime, endTime });
    return response.data;
  },

  async cancelBooking(bookingId) {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  },

  async getMyBookings() {
    const response = await api.get('/bookings/my');
    return response.data;
  },
};

export default bookingService;
