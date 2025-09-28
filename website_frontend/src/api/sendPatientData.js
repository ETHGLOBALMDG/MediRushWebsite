import axios from 'axios';

// Use VITE_BACKEND_URL from environment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Sends the patient encrypted data to the backend API.
 * @param {object} data - The data object to send.
 * @returns {Promise<object>} - The backend response.
 */
export const sendPatientData = async (data) => {
  try{

    const response = await axios.post(`${BACKEND_URL}/api/patients/register`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Backend responded with error: ${error.response.status} ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Could not connect to backend.');
    } else {
      throw new Error('Unexpected error while sending data.');
    }
  }
};
