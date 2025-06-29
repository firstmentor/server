const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
// console.log(process.env.JWT_SECRET)

class AdminController {
  // POST /api/admin/register
  static async register(req, res) {
    try {
        console.log(req.body)
      const { name, email, password } = req.body;

      const exist = await Admin.findOne({ email });
      if (exist) return res.status(400).json({ message: 'Admin already exists' });

      const admin = await Admin.create({ name, email, password });
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  // POST /api/admin/login
  static async login(req, res) {
    try {
        console.log(req.body)
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      const isMatch = await admin.comparePassword(password);
      console.log(isMatch)
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      // ✅ Generate JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
      console.log(token)

      // ✅ Set as HTTP-Only cookie
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  // GET /api/admin/dashboard (Protected)
  static async dashboard(req, res) {
    res.status(200).json({ message: 'Welcome to Admin Dashboard ✅' });
  }

  // POST /api/admin/logout
  static async logout(req, res) {
    res.clearCookie('adminToken');
    res.status(200).json({ message: 'Logged out successfully' });
  }
}

module.exports = AdminController;
