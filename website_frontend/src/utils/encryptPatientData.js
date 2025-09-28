/**
 * Encrypts data using AES-GCM with a provided hexadecimal key.
 * This function uses the browser's built-in SubtleCrypto API for encryption.
 *
 * @param {object} data - The JSON object to encrypt.
 * @param {string} hexKey - The encryption key as a 256-bit (64-character) hex string.
 * @returns {Promise<string>} A promise that resolves to a string containing the
 * base64-encoded IV and the base64-encoded ciphertext,
 * separated by a colon (iv:ciphertext).
 * @throws {Error} If the key is invalid or encryption fails.
 */
export const encryptData = async(data, hexKey) => {
    try {
        // 1. Convert the hex key string to a Uint8Array.
        // Each pair of hex characters becomes one byte.
        if (hexKey.length !== 64) {
            throw new Error("Invalid key length: Key must be a 256-bit hex string (64 characters).");
        }
        const keyBuffer = new Uint8Array(hexKey.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

        // 2. Import the raw key material into a CryptoKey object for use with the API.
        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            keyBuffer, {
                name: 'AES-GCM'
            },
            false, // The key is not extractable from the CryptoKey object.
            ['encrypt']
        );

        // 3. Generate a random 12-byte Initialization Vector (IV).
        // The IV must be unique for each encryption with the same key.
        const iv = window.crypto.getRandomValues(new Uint8Array(12));

        // 4. Prepare the data for encryption.
        const jsonString = JSON.stringify(data);
        const encodedData = new TextEncoder().encode(jsonString);

        // 5. Encrypt the data using AES-GCM.
        const encryptedBuffer = await window.crypto.subtle.encrypt({
                name: 'AES-GCM',
                iv: iv
            },
            cryptoKey,
            encodedData
        );

        // 6. Convert the IV and encrypted data (ArrayBuffers) to base64 strings for easy transport.
        const ivBase64 = bufferToBase64(iv);
        const encryptedDataBase64 = bufferToBase64(encryptedBuffer);

        // 7. Return the combined IV and ciphertext. The IV is needed for decryption.
        return `${ivBase64}:${encryptedDataBase64}`;

    } catch (error) {
        console.error("Encryption failed:", error);
        throw new Error(`Failed to encrypt data: ${error.message}`);
    }
};

/**
 * Helper function to convert an ArrayBuffer to a base64 string.
 * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} The base64-encoded string.
 */
function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}