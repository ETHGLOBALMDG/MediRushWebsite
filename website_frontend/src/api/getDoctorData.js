import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getDoctorData = async () => {
  const response = await axios.get(`${BACKEND_URL}/getDoctorData`);
  return response.data;
};
