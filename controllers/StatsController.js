// controllers/StatsController.js
const User = require('../models/UserModel');
const Job = require('../models/Application');

class StatsController {
  static async getStats(req, res) {
    try {
      const totalUsers = await User.countDocuments();
      const totalJobs = await Job.countDocuments();

      res.json({
        users: totalUsers,
        jobs: totalJobs,
      });
    } catch (err) {
      res.status(500).json({ message: 'Server Error' });
    }
  }
}

module.exports = StatsController;
