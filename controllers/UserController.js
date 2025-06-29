const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const {deleteMediaFromCloudinary,uploadMedia} =require('../utils/cloudinary')

class UserController {
  static register = async (req, res) => {
    try {
      const { name, email, password } = req.body; // patel214
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exist with this email.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });
      return res.status(201).json({
        success: true,
        message: "Account created successfully.",
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "failed", message: "Internal server error" });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required.",
        });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Incorrect email or password",
        });
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect email or password",
        });
      }
      generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
      console.error("Error during sign-in:", error);

      // Internal server error
      return res.status(500).json({
        status: "failed",
        message: "Internal server error.",
      });
    }
  };

  static logOut = async (req, res) => {
    try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
        message: "Logged out successfully.",
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({
        status: "failed",
        message: error.message,
      });
    }
  };

  static getUserProfile = async (req, res) => {
    try {
      const userId = req.id;
      // console.log(req.id);
      const user = await UserModel.findById(userId).select("-password");
      // .populate("enrolledCourses");
      if (!user) {
        return res.status(404).json({
          message: "Profile not found",
          success: false,
        });
      }
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to load user",
      });
    }
  };

  static updateProfile = async (req, res) => {
    try {
      const userId = req.id;
      const { name } = req.body;
      const profilePhoto = req.file;

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }
      // extract public id of the old image from the url is it exists;
      if (user.photoUrl) {
        const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
        deleteMediaFromCloudinary(publicId);
      }

      // upload new photo
      const cloudResponse = await uploadMedia(profilePhoto.path);
      const photoUrl = cloudResponse.secure_url;

      const updatedData = { name, photoUrl };
      const updatedUser = await UserModel.findByIdAndUpdate(userId, updatedData, {
        new: true,
      }).select("-password");

      return res.status(200).json({
        success: true,
        user: updatedUser,
        message: "Profile updated successfully.",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update profile",
      });
    }
  };
}
module.exports = UserController;
