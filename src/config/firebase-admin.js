const admin = require('firebase-admin');

// Use process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT directly if it's correctly formatted
const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://phongkhamthaithinh-d945b-default-rtdb.asia-southeast1.firebasedatabase.app',
});

module.exports = admin;
