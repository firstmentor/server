const Application = require('../models/Application');
const path = require('path');
const sendEmailWithAttachment = require('../utils/mailer');

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
      console.log(applications)
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      console.error('Error in getAllApplications:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}

module.exports = JobApplicationController;
