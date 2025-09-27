import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getSearchDoctor = async (query) => {
  const response = await axios.post(`${BACKEND_URL}/search-doctor`, { query });
  return response.data;
};
