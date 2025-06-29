const express = require('express');
const app = express();
const port = 3000;
const connectDB = require('./db/connectDB');
const web = require('./routes/web');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv')
const serverless = require('serverless-http');
const cron = require('node-cron');
const deleteOldFiles = require('./utils/deleteOldFiles');

// Run every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('🕛 Running daily file cleanup...');
  deleteOldFiles();
});




dotenv.config({});
const PORT = process.env.PORT || 3000;




//token get
app.use(cookieParser())

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

connectDB();



// Uploads folder (optional)
// 👇 This line serves the /uploads folder publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', web);


app.listen(PORT, () => {
  console.log(`server is listening on localhost: ${PORT}`)
})


// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);