import api from './api';

/**
 * Service for parking slot and lot operations.
 */
const parkingService = {
  async getAllSlots() {
    const response = await api.get('/slots');
    return response.data;
  },

  async getAvailableSlots() {
    const response = await api.get('/slots/available');
    return response.data;
  },

  async getSlotsByLot(lotId) {
    const response = await api.get(`/slots/lot/${lotId}`);
    return response.data;
  },

  /** Smart recommendation — get the best available slot */
  async getRecommendation(vehicleType) {
    const params = vehicleType ? { vehicleType } : {};
    const response = await api.get('/slots/recommend', { params });
    return response.data;
  },
};

export default parkingService;
