const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')

class AdminController {
  // POST /api/admin/register
  static async register(req, res) {
    try {
      // console.log(req.body)
      const { name, email, password } = req.body;

      const exist = await Admin.findOne({ email });
      if (exist)
        return res.status(400).json({ message: "Admin already exists" });

      const admin = await Admin.create({ name, email, password });
      res.status(201).json({ message: "Admin registered successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }

  static async login(req, res) {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      console.log(admin);

      const isMatch = await admin.comparePassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }

  // GET /api/admin/dashboard (Protected)
  static async dashboard(req, res) {
    res.status(200).json({ message: "Welcome to Admin Dashboard ✅" });
  }

  // POST /api/admin/logout
  static async logout(req, res) {
    // console.log("hello");

    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/", // ✅ यह देना ज़रूरी है
    });

    res.status(200).json({ message: "Logged out successfully" });
  }

  static async profile(req, res) {
    try {
      const admin = await Admin.findById(req.adminId).select("-password");
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      res.status(200).json({ admin });
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
  // ✅ Change Password
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!req.adminId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const admin = await Admin.findById(req.adminId);
      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }

      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Current password is incorrect" });
      }

      // ✅ Assign plain password (it will be hashed automatically in pre-save)
      admin.password = newPassword;
      await admin.save();

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }
  // ✅ FORGOT PASSWORD - Send Email
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const admin = await Admin.findOne({ email });

      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }

      // Create token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_RESET_SECRET, {
        expiresIn: "15m", // 15 minutes
      });

      // Email link
      const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password/${token}`;

      // Send Email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Admin Panel" <${process.env.MAIL_USER}>`,
        to: admin.email,
        subject: "Password Reset Link",
        html: `
          <h3>Password Reset</h3>
          <p>Click below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <br><br>
          <small>This link is valid for 15 minutes only.</small>
        `,
      });

      res
        .status(200)
        .json({ success: true, message: "Reset link sent to your email" });
    } catch (err) {
      console.error("Forgot password error:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

    // ✅ RESET PASSWORD
    static async resetPassword(req, res) {
      try {
        const { token, newPassword } = req.body;
  
        if (!token || !newPassword) {
          return res.status(400).json({ success: false, message: "Missing token or password" });
        }
  
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const admin = await Admin.findById(decoded.id);
  
        if (!admin) {
          return res.status(404).json({ success: false, message: "Admin not found" });
        }
  
        // Set new password
        admin.password = newPassword; // will be hashed in model
        await admin.save();
  
        res.status(200).json({ success: true, message: "Password has been reset successfully" });
      } catch (err) {
        console.error("Reset password error:", err);
        if (err.name === "TokenExpiredError") {
          return res.status(400).json({ success: false, message: "Token expired, try again" });
        }
        res.status(500).json({ success: false, message: "Invalid or expired token" });
      }
    }
  
  
}

module.exports = AdminController;
