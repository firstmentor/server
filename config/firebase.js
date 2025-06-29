// backend/config/firebase.js
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../serviceAccountKey.json')); // download from Firebase console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'your-project-id.appspot.com', // ⚠️ from Firebase Console
});

const bucket = admin.storage().bucket();

module.exports = bucket;
