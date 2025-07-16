const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./db/connectDB');
const web = require('./routes/web');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const deleteOldFiles = require('./utils/deleteOldFiles');
const serverless = require('serverless-http');

dotenv.config();

const PORT = process.env.PORT || 3000;

const fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'uploads')  // temp dir hona chahiye
}));

// ✅ Database connect karo
connectDB();

// ✅ CORS setup — frontend se request allow karne ke लिए
const allowedOrigins = [
  'http://localhost:5173',                // Localhost Vite app
  'https://srwebconsultancy.in'          // Aapka live domain
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);              // ✅ origin allow hai
    } else {
      callback(new Error('❌ Not allowed by CORS'));  // ❌ Block
    }
  },
  credentials: true
}));

// ✅ Preflight (OPTIONS) request handle karo
app.options('*', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Static folder (uploads folder ko public bana do PDF/image view ke liye)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api', web);

// ✅ Local server start karo
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// ✅ Serverless ke liye export
module.exports = app;
module.exports.handler = serverless(app);
