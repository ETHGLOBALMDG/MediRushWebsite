import axios from 'axios';

// The prover API is expected to be running on localhost:3001
const PROVER_API_URL = 'http://localhost:3001/prove';

/**
 * Reads a File object and converts it to an array of bytes.
 * @param {File} file The file to read.
 * @returns {Promise<number[]>} A promise that resolves to an array of bytes.
 */
const readFileAsByteArray = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target.result;
      const byteArray = Array.from(new Uint8Array(buffer));
      resolve(byteArray);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generates a ZK proof for a given PDF file.
 * @param {File} pdfFile The PDF file to generate the proof for.
 * @param {object} options Additional parameters for the proof.
 * @returns {Promise<object>} The proof data from the API.
 * @throws {Error} If the API call fails.
 */
export const generateZkAgeProof = async (pdfFile, options = {}) => {
  try {
    console.log('Reading PDF file into byte array...');
    const pdfBytes = await readFileAsByteArray(pdfFile);

    // Construct the JSON body exactly as the server expects
    const proofBody = {
      pdf_bytes: [0,1,2,3],
      page_number:0,
      offset:0,
      sub_string: options.subString || "LMV", 
    };

    console.log('Sending JSON payload to prover service...');
    const response = await axios.post(PROVER_API_URL, proofBody, {
      headers: {
        // The header must be 'application/json'
        'Content-Type': 'application/json',
      },
    });

    console.log('Proof generated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating ZK proof:', error);

    // Provide a more user-friendly error message
    if (error.response) {
      throw new Error(`The prover service responded with an error: ${error.response.status} ${error.response.statusText}. Check the server console for details.`);
    } else if (error.request) {
      throw new Error('Could not connect to the prover service. Is it running on http://localhost:3001?');
    } else {
      throw new Error('An unexpected error occurred while setting up the request.');
    }
  }
};


