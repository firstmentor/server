const Application = require('../models/Application');
const path = require('path');
const sendEmail =require('../utils/sendEmail')
const sendEmailWithAttachment = require('../utils/mailer');
const { generateStatusUpdateEmail } = require('../utils/emailTemplates');
const fs = require('fs');


class JobApplicationController {
  static async apply(req, res) {
    try {
      const { name, email, phone, designation } = req.body;
      const resumeFile = req.file;

      const resumePath = path.join(__dirname, '..', 'uploads', resumeFile.filename);
      const resumeUrl = `/uploads/${resumeFile.filename}`;

      // Save in DB
      const application = new Application({
        name,
        email,
        phone,
        designation,
        resumeUrl,
      });
      await application.save();

      // ✅ Stylish HTML Email Template
      const htmlContent = `
        <div style="font-family:sans-serif; padding:20px;">
          <h2 style="color:#2e6c80;">SR Web Consultancy Services Job Application</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for applying for the job. Your application details are:</p>
          <ul>
            <li><b>Email:</b> ${email}</li>
            <li><b>Phone:</b> ${phone}</li>
            <li><b>Designation:</b> ${designation}</li>
          </ul>
          <p>Attached is your uploaded resume.</p>
          <p>Regards,<br/>SR Web Consultancy Services Team</p>
        </div>
      `;

      const attachment = [
        {
          filename: resumeFile.originalname,
          path: resumePath,
          contentType: 'application/pdf',
        },
      ];

      // ✅ Send to USER
      await sendEmailWithAttachment({
        to: email,
        subject: '✅ Your Application Received - SR Web Consultancy Services',
        html: htmlContent,
        attachments: attachment,
      });

      // ✅ Send to ADMIN
      await sendEmailWithAttachment({
        to: process.env.ADMIN_EMAIL,
        subject: `📥 New Job Application from ${name}`,
        html: htmlContent,
        attachments: attachment,
      });

      res.status(201).json({
        success: true,
        message: 'Application submitted and emails sent with PDF',
        data: application,
      });
    } catch (error) {
      console.error('Email Error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async getAllApplications(req, res) {
    try {
      const applications = await Application.find().sort({ createdAt: -1 });
      // console.log(applications)
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, comment } = req.body;

      const updatedApp = await Application.findByIdAndUpdate(
        id,
        { status, comment },
        { new: true }
      );

      if (!updatedApp) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // Optional: send email logic here...
      const htmlTemplate = generateStatusUpdateEmail(
        updatedApp.name,
        status,
        comment,
        `${process.env.BASE_URL}${updatedApp.resumeUrl}` // localhost or live
      );

      await sendEmail(updatedApp.email, '📢 Application Status Updated', htmlTemplate);

      res.status(200).json({
        success: true,
        message: 'Status updated',
        data: updatedApp,
      });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const app = await Application.findById(id);
      if (!app) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      // ⛔ Delete local resume file (if it exists)
      if (app.resumeUrl && app.resumeUrl.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', app.resumeUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🧹 Deleted local file: ${filePath}`);
        }
      }

      // ❌ Delete document from DB
      await app.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Application & resume deleted successfully',
      });
    } catch (error) {
      console.error('❌ Error deleting application:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
}

module.exports = JobApplicationController;
