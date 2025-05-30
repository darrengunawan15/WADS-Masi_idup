const express = require('express');
const router = express.Router();
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.route('/')
  .post(protect, authorize(['admin']), [
    check('categoryName', 'Category name is required').not().isEmpty(),
  ], createCategory) // Only admin can create, with validation
  .get(getCategories); // Anyone can view categories (can add protect if needed)

router.route('/:id')
  .get(getCategoryById) // Anyone can view a specific category (can add protect if needed)
  .put(protect, authorize(['admin']), [
    check('categoryName', 'Category name is required').not().isEmpty(),
  ], updateCategory) // Only admin can update, with validation
  .delete(protect, authorize(['admin']), deleteCategory); // Only admin can delete

module.exports = router; 