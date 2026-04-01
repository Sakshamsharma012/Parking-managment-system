import api from './api';

/**
 * Service for admin operations.
 */
const adminService = {
  // Dashboard
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Lots
  async getLots() {
    const response = await api.get('/admin/lots');
    return response.data;
  },
  async createLot(data) {
    const response = await api.post('/admin/lots', data);
    return response.data;
  },
  async updateLot(id, data) {
    const response = await api.put(`/admin/lots/${id}`, data);
    return response.data;
  },
  async deleteLot(id) {
    const response = await api.delete(`/admin/lots/${id}`);
    return response.data;
  },

  // Slots
  async getSlots() {
    const response = await api.get('/admin/slots');
    return response.data;
  },
  async createSlot(data) {
    const response = await api.post('/admin/slots', data);
    return response.data;
  },
  async updateSlot(id, data) {
    const response = await api.put(`/admin/slots/${id}`, data);
    return response.data;
  },
  async deleteSlot(id) {
    const response = await api.delete(`/admin/slots/${id}`);
    return response.data;
  },

  // Bookings
  async getAllBookings() {
    const response = await api.get('/admin/bookings');
    return response.data;
  },

  // Users
  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },
  async deleteUser(id) {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export default adminService;
