import axiosClient from './axiosClient';

export const chatbotApi = {
  sendMessage: async (message) => {
    const response = await axiosClient.post('/chatbot/message', { message });
    return response.data;
  },

  getHistory: async () => {
    const response = await axiosClient.get('/chatbot/history');
    return response.data;
  },
};
