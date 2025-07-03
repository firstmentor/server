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
  tempFileDir: path.join(__dirname, 'uploads')  // temp dir must exist
}));


// ✅ Connect DB
connectDB();

// ✅ CORS: allow both localhost and live domain
const allowedOrigins = [
  'http://localhost:5173',
  'https://srwebconsultancy.in'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('❌ Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Serve static /uploads files for PDF preview
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api', web);



// ✅ Start server (for local use)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// ✅ Export for Vercel/Serverless
module.exports = app;
module.exports.handler = serverless(app);
