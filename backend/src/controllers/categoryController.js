'use strict';

const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/responses');
const { slugify } = require('../utils/helpers');

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
    const { name } = req.body;
    const slug = slugify(name);
    const category = await Category.create({ name, slug });
    return sendSuccess(res, 201, category, 'Category created');
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return sendError(res, 404, 'NOT_FOUND', 'Category not found');
    const { name } = req.body;
    const updates = {};
    if (name) { updates.name = name; updates.slug = slugify(name); }
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
