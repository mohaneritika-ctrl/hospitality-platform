import axiosClient from './axiosClient';

export const adminApi = {
  getStatistics: async () => {
    const response = await axiosClient.get('/admin/statistics');
    return response.data;
  },

  getStats: async () => {
    const response = await axiosClient.get('/admin/statistics');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axiosClient.get('/admin/users');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await axiosClient.get('/admin/bookings');
    return response.data;
  },
};
