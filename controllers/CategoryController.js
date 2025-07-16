const Category = require("../models/Category");
const cloudinary = require("../config/cloudinary");

class CategoryController {
  static async getAll(req, res) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async create(req, res) {
    try {
      // console.log(req.body)
      const { title, jobsCount,description } = req.body;

      if (!req.files?.image) {
        return res.status(400).json({ success: false, message: "Image required" });
      }

      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "categories",
      });

      const newCategory = await Category.create({
        title,
        jobsCount,
        description,
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
      });

      res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, jobsCount,description } = req.body;

      const existing = await Category.findById(id);
      if (!existing) return res.status(404).json({ message: "Not found" });

      let updatedImage = existing.image;

      if (req.files?.image) {
        await cloudinary.uploader.destroy(existing.image.public_id);

        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: "categories",
        });

        updatedImage = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      }

      const updated = await Category.findByIdAndUpdate(
        id,
        {
          title,
          jobsCount,
          description,
          image: updatedImage,
        },
        { new: true }
      );

      res.json({ success: true, data: updated });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const category = await Category.findById(id);
      if (!category) return res.status(404).json({ message: "Not found" });

      if (category.image?.public_id) {
        await cloudinary.uploader.destroy(category.image.public_id);
      }

      await Category.findByIdAndDelete(id);
      res.json({ success: true, message: "Category deleted" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = CategoryController;
