import axiosClient from './axiosClient';

export const bookingApi = {
  createBooking: async (bookingData) => {
    const response = await axiosClient.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await axiosClient.get('/bookings/my');
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await axiosClient.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await axiosClient.put(`/bookings/${id}/cancel`);
    return response.data;
  },
};
