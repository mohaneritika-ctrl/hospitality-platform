import axiosClient from './axiosClient';

export const roomApi = {
  getRoomsByHotel: async (hotelId, availableOnly = false) => {
    const response = await axiosClient.get(`/hotels/${hotelId}/rooms`, {
      params: { availableOnly },
    });
    return response.data;
  },

  getRoomById: async (id) => {
    const response = await axiosClient.get(`/rooms/${id}`);
    return response.data;
  },

  createRoom: async (hotelId, roomData) => {
    const response = await axiosClient.post(`/hotels/${hotelId}/rooms`, roomData);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await axiosClient.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  toggleAvailability: async (id) => {
    const response = await axiosClient.patch(`/rooms/${id}/toggle`);
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await axiosClient.delete(`/rooms/${id}`);
    return response.data;
  },
};
