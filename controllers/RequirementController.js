const Requirement = require('../models/Requirement');
const nodemailer = require('nodemailer');

class RequirementController {

  static async submit(req, res) {
    try {
      const { name, email, phone, comment } = req.body;

      // ✅ Check duplicate email
      const exist = await Requirement.findOne({ email });
      if (exist) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // ✅ Save data to DB
      const newRequirement = new Requirement({ name, email, phone, comment });
      await newRequirement.save();

      // ✅ Setup mail transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      // ✅ Admin email
      const mailOptionsToAdmin = {
        from: process.env.MAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: '📨 New Requirement Posted',
        html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone}</p>
               <p><strong>Comment:</strong> ${comment}</p>`,
      };

      // ✅ User confirmation email
      const mailOptionsToUser = {
        from: process.env.MAIL_USER,
        to: email,
        subject: '✅ Your Requirement Submitted',
        html: `<p>Hi ${name},</p><p>Thanks for your requirement. We’ll contact you soon!</p>`,
      };

      // ✅ Send both emails
      await transporter.sendMail(mailOptionsToAdmin);
      await transporter.sendMail(mailOptionsToUser);

      res.status(200).json({
        message: 'Requirement submitted, saved to DB, and emails sent',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: '❌ Server error',
        error: err.message,
      });
    }
  }
  static async getAll(req, res) {
    try {
      const allRequirements = await Requirement.find().sort({ createdAt: -1 });
      // console.log(allRequirements)
      res.status(200).json({ success: true, data: allRequirements });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: '❌ Server error while fetching requirements',
        error: err.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Requirement.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ message: 'Requirement not found' });
      }
      res.status(200).json({ message: 'Requirement deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
  
  
}

module.exports = RequirementController;
