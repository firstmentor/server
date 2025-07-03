const Contact = require('../models/Contact');

class ContactController {
  static async create(req, res) {
    try {
      const contact = await Contact.create(req.body);
      res.status(201).json({ success: true, data: contact });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getAll(req, res) {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      // console.log(contacts)
      res.json({ success: true, data: contacts });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  static async delete(req, res) {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);
      if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

      res.status(200).json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error });
    }
  }
  static async bulkDelete(req, res) {
    try {
      const { ids } = req.body; // Expecting an array of IDs
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "No IDs provided" });
      }

      const result = await Contact.deleteMany({ _id: { $in: ids } });
      res.status(200).json({ success: true, message: `${result.deletedCount} contact(s) deleted.` });
    } catch (error) {
      res.status(500).json({ success: false, message: "Bulk delete failed", error });
    }
  }
}

module.exports = ContactController;
