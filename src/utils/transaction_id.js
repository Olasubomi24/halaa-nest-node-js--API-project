import crypto from 'crypto';

/**
 * Generate a random numeric transaction ID.
 * @param {number} length - The length of the transaction ID (default is 16).
 * @returns {string} - The generated transaction ID.
 */
export const generateTransactionalId = (length = 32) => {
  const randomBytes = crypto.randomBytes(length);
  let result = '';

  for (let i = 0; i < randomBytes.length; i++) {
    // Ensure each byte is within the range of 0-9
    const byteValue = randomBytes[i] % 10;
    result += byteValue.toString();
  }

  return result;
};

// Example usage
const transactionId = generateTransactionalId();
console.log(`Generated numeric transaction ID: ${transactionId}`);
