const Job = require('../models/Job');

class JobController {
  static async addJob(req, res) {
    try {
      const { designation, experience, location } = req.body;
      const job = new Job({ designation, experience, location });
      await job.save();
      res.status(201).json({ message: 'Job added', data: job });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add job', error: err.message });
    }
  }

  static async getJobs(req, res) {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.status(200).json({ data: jobs });
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch jobs', error: err.message });
    }
  }

  static async deleteJob(req, res) {
    try {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete job', error: err.message });
    }
  }

  static async updateJob(req, res) {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!job) return res.status(404).json({ message: 'Job not found' });
      res.status(200).json({ message: 'Job updated', data: job });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update job', error: err.message });
    }
  }
}

module.exports = JobController;
