const Category = require('../models/Category');
const { validationResult } = require('express-validator');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryName } = req.body;

  try {
    const categoryExists = await Category.findOne({ categoryName });

    if (categoryExists) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    const category = await Category.create({ categoryName });

    if (category) {
      res.status(201).json(category);
    } else {
      res.status(400).json({ message: 'Invalid category data' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (or potentially Authenticated Users)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public (or potentially Authenticated Users)
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryName } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      category.categoryName = categoryName || category.categoryName;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await category.deleteOne(); // Use deleteOne() instead of remove()
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
     res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory }; 