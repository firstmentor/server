const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

class ProductController {
  static async create(req, res) {
    try {
      const { title } = req.body;
      console.log( req.files.pdf)

      // 🧠 Validate file
      if (!req.files || !req.files.pdf) {
        return res.status(400).json({ success: false, message: 'No PDF file uploaded' });
      }

      const file = req.files.pdf;

      // ✅ Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        resource_type: 'raw',   // ✅ required for PDFs
        folder: 'products'      // optional folder name
      });

      // ✅ Save to MongoDB
      const product = await Product.create({
        title,
        pdfUrl: result.secure_url
      });

      // ✅ Delete temp file
      fs.unlinkSync(file.tempFilePath);

      res.status(201).json({
        success: true,
        message: 'PDF uploaded successfully',
        product
      });

    } catch (error) {
      console.error('❌ Upload Error:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  static async getAll(req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, products });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Failed to fetch products' });
    }
  }

  static async delete(req, res) {
    try {
      const id = req.params.id;
      await Product.findByIdAndDelete(id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Deletion failed' });
    }
  }
}

module.exports = ProductController;
