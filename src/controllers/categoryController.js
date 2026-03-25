'use strict';

const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/responses');
const { slugify } = require('../utils/helpers');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return sendSuccess(res, 200, categories, 'Categories retrieved');
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendError(res, 404, 'NOT_FOUND', 'Category not found');
    return sendSuccess(res, 200, category, 'Category retrieved');
  } catch (err) {
    next(err);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const slug = slugify(name);
    let imageUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'exotic-fruits/categories');
      imageUrl = uploaded.url;
    }
    const category = await Category.create({ name, slug, description, status, image: imageUrl });
    return sendSuccess(res, 201, category, 'Category created');
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendError(res, 404, 'NOT_FOUND', 'Category not found');
    const { name, description, status } = req.body;
    const updates = {};
    if (name) { updates.name = name; updates.slug = slugify(name); }
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'exotic-fruits/categories');
      updates.image = uploaded.url;
    }
    await category.update(updates);
    return sendSuccess(res, 200, category, 'Category updated');
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendError(res, 404, 'NOT_FOUND', 'Category not found');
    await category.destroy();
    return sendSuccess(res, 200, null, 'Category deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
