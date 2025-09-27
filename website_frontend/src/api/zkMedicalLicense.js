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
export const generateZkMedicalLicenseProof = async (pdfFile, options = {}) => {
  try {
    console.log('Reading PDF file into byte array...');
    const pdfBytes = await readFileAsByteArray(pdfFile);

    // Construct the JSON body exactly as the server expects
    const proofBody = {
      pdf_bytes: pdfBytes,
      page_number:0,
      offset:0,
      sub_string: options.subString || "",
    };

    console.log('Sending JSON payload to prover service...');
    const response = await axios.post(PROVER_API_URL, proofBody, {
      headers: {
        // The header must be 'application/json'
        'Content-Type': 'application/json',
      },
    });

    console.log('Proof generated successfully:', response.data);
    const match=response.data.proof.Groth16.public_inputs[0];
    console.log("Public Input 1:",match);
    const hex = match.toString(16);        // hex string (without 0x)
    const paddedHex = hex.length % 2 ? '0' + hex : hex;
    const bytes = Uint8Array.from(
    paddedHex.match(/.{1,2}/g).map(b => parseInt(b, 16))
   );
    
    console.log(bytes);
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


