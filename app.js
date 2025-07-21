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
  tempFileDir: path.join(__dirname, 'uploads')
}));

// ✅ Database connect karo
connectDB();

// ✅ Corrected CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://srwebconsultancy.in',
  'https://www.srwebconsultancy.in' // ✅ added www version
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
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

// ✅ Static folder (uploads public)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api', web);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// ✅ Serverless export
module.exports = app;
module.exports.handler = serverless(app);
