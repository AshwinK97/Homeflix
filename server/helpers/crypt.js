const crypto = require("crypto");
const config = require("../config");

// configure hash key to be used for file encryption
let key = crypto
  .createHash("sha256")
  .update(String(config.secret))
  .digest("base64")
  .substr(0, 32);

/**
 * Takes a buffer, which should contain file data and uses a cipher
 * to encrypt it. Returns the encrypted buffer.
 */
const encrypt = buffer => {
  // Create an initialization vector
  const iv = crypto.randomBytes(16);
  // Create a new cipher using the algorithm, key, and iv
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  // Create the new (encrypted) buffer
  const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
  return result;
};

/**
 * Takes an encrypted file buffer, uses cipher to reverse encryption.
 * Returns the decrypted buffer.
 */
const decrypt = encrypted => {
  // Get the iv: the first 16 bytes
  const iv = encrypted.slice(0, 16);
  // Get the rest
  encrypted = encrypted.slice(16);
  // Create a decipher
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  // Actually decrypt it
  const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return result;
};

module.exports = {
  encrypt,
  decrypt
};
