const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);


class AdminController {
  // POST /api/admin/register
  static async register(req, res) {
    try {
        // console.log(req.body)
      const { name, email, password } = req.body;

      const exist = await Admin.findOne({ email });
      if (exist) return res.status(400).json({ message: 'Admin already exists' });

      const admin = await Admin.create({ name, email, password });
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
  
      const isMatch = await admin.comparePassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });
  
      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
  

  // GET /api/admin/dashboard (Protected)
  static async dashboard(req, res) {
    res.status(200).json({ message: 'Welcome to Admin Dashboard ✅' });
  }

  // POST /api/admin/logout
  static async logout(req, res) {
    // console.log("hello");
  
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/', // ✅ यह देना ज़रूरी है
    });
  
    res.status(200).json({ message: 'Logged out successfully' });
  }

  static async profile(req, res) {
    try {
      const admin = await Admin.findById(req.adminId).select('-password');
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
  
      res.status(200).json({ admin });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
}

module.exports = AdminController;
