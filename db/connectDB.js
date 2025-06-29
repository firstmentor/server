const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Live_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("error occured", error);
  }
};
module.exports = connectDB;
