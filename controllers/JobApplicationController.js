const Application = require('../models/Application');
const cloudinary = require('../config/cloudinary');
const sendEmail = require('../utils/sendEmail');
const { generateStatusUpdateEmail } = require('../utils/emailTemplates');

class JobApplicationController {
  // ✅ CREATE (Apply with resume)
  static async apply(req, res) {
    try {
      const { name, email, phone, designation } = req.body;

      if (!req.files || !req.files.resume) {
        return res.status(400).json({ success: false, message: 'Resume is required' });
      }

      const file = req.files.resume;

      // ✅ Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'raw',
        folder: 'resumes',
        public_id: `${name.replace(/\s+/g, '_')}_${Date.now()}`
      });

      const resumeUrl = result.secure_url;
      const cloudinary_id = result.public_id;

      // ✅ Save in DB
      const application = await Application.create({
        name,
        email,
        phone,
        designation,
        resumeUrl,
        cloudinary_id
      });

      // ✅ Email content
      const html = `
        <h3>New Job Application</h3>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone}</li>
          <li>Designation: ${designation}</li>
          <li>Resume: <a href="${resumeUrl}" target="_blank">View PDF</a></li>
        </ul>
      `;

      // ✅ Email to user and admin
      await sendEmail(email, '✅ Application Received', html);
      await sendEmail(process.env.ADMIN_EMAIL, `📥 Application from ${name}`, html);

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: application
      });

    } catch (error) {
      console.error('❌ Apply Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // ✅ READ all applications
  static async getAll(req, res) {
    try {
      const data = await Application.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // ✅ UPDATE status/comment
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, comment } = req.body;

      const application = await Application.findByIdAndUpdate(
        id,
        { status, comment },
        { new: true }
      );

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      const html = generateStatusUpdateEmail(
        application.name,
        status,
        comment,
        application.resumeUrl
      );

      await sendEmail(application.email, '📢 Application Status Updated', html);

      res.status(200).json({
        success: true,
        message: 'Status updated',
        data: application
      });

    } catch (error) {
      console.error('❌ Update Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  // ✅ DELETE application + resume from Cloudinary
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const app = await Application.findById(id);

      if (!app) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // ✅ Delete from Cloudinary
      if (app.cloudinary_id) {
        await cloudinary.uploader.destroy(app.cloudinary_id, { resource_type: 'raw' });
      }

      // ✅ Delete from DB
      await app.deleteOne();

      res.status(200).json({
        success: true,
        message: 'Application & resume deleted successfully'
      });

    } catch (error) {
      console.error('❌ Delete Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = JobApplicationController;
