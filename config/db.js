const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality (OpenSSL's hash, HMAC, cipher, decipher, sign and verify functions)

// Export config object
module.exports = {
  uri: "mongodb://localhost:27017/ncloudlocal", // Databse URI and database name             mongodb://admin:admin@ds129352.mlab.com:29352/ngcloud
  secret: crypto, // Cryto-created secret
  db: "ngcloudlocal", // Database name
}