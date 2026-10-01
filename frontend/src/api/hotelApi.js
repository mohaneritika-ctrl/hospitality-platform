import axiosClient from './axiosClient';

export const hotelApi = {
  getAllHotels: async () => {
    const response = await axiosClient.get('/hotels');
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await axiosClient.get(`/hotels/${id}`);
    return response.data;
  },

  searchHotels: async (params) => {
    const response = await axiosClient.get('/hotels/search', { params });
    return response.data;
  },

  createHotel: async (hotelData) => {
    const response = await axiosClient.post('/hotels', hotelData);
    return response.data;
  },

  updateHotel: async (id, hotelData) => {
    const response = await axiosClient.put(`/hotels/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await axiosClient.delete(`/hotels/${id}`);
    return response.data;
  },
};
