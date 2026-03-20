'use strict';

const { Op } = require('sequelize');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Wishlist = require('../models/Wishlist');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responses');
const { slugify, getPaginationParams } = require('../utils/helpers');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const addWishlistFlag = async (products, userId) => {
  console.log('DEBUG - userId:', userId);
  
  // If no userId, all items have inWishlist false
  if (!userId) {
    console.log('DEBUG - No userId, setting all inWishlist to false');
    return products.map(p => {
      const data = p.dataValues ? { ...p.dataValues } : { ...p };
      data.inWishlist = false;
      return data;
    });
  }
  
  // Get wishlist items for this user
  const wishlistItems = await Wishlist.findAll({
    where: { user_id: userId },
    attributes: ['product_id'],
    raw: true
  });
  
  console.log('DEBUG - Wishlist items found:', wishlistItems);
  
  // Convert all product_ids to numbers for reliable comparison
  const wishlistProductIds = new Set(
    wishlistItems.map(w => Number(w.product_id))
  );
  
  console.log('DEBUG - Wishlist product IDs set:', Array.from(wishlistProductIds));
  
  return products.map(p => {
    const data = p.dataValues ? { ...p.dataValues } : { ...p };
    // Get product ID - handle both Sequelize instances and plain objects
    const productId = Number(p.dataValues?.id || p.id);
    data.inWishlist = wishlistProductIds.has(productId);
    console.log(`DEBUG - Product ${productId}, inWishlist: ${data.inWishlist}`);
    return data;
  });
};

const getProducts = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { category, minPrice, maxPrice, sort } = req.query;

    const where = {};
    
    // Handle multiple categories: ?category=7,6 or ?category=7&category=6
    if (category) {
      const categoryArray = Array.isArray(category) 
        ? category 
        : category.split(',').map(c => c.trim());
      
      where.category_id = {
        [Op.in]: categoryArray.map(c => Number(c))
      };
    }
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const order = [];
    if (sort === 'price_asc') order.push(['price', 'ASC']);
    else if (sort === 'price_desc') order.push(['price', 'DESC']);
    else if (sort === 'newest') order.push(['createdAt', 'DESC']);
    else order.push(['createdAt', 'DESC']);

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug', 'status'] }],
      order,
      limit,
      offset
    });

    console.log(req.user?.id, 'userId ---req.user?.id');
    console.log(rows, 'rows ----req.user?.id');
    const rowsWithWishlist = await addWishlistFlag(rows, req.user?.id);
    return sendPaginated(res, rowsWithWishlist, count, page, limit, 'Products retrieved');
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    let product;
    
    // Handle both ID and slug-based routes
    if (req.params.id) {
      // ID-based lookup
      product = await Product.findByPk(req.params.id, {
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
      });
    } else if (req.params.slug) {
      // Slug-based lookup
      product = await Product.findOne({
        where: { slug: req.params.slug },
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }]
      });
    }
    
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    
    const [productWithWishlist] = await addWishlistFlag([product], req.user?.id);
    return sendSuccess(res, 200, productWithWishlist, 'Product retrieved');
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return sendError(res, 400, 'MISSING_QUERY', 'Search query is required');

    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Product.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } }
        ]
      },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit,
      offset
    });

    const rowsWithWishlist = await addWishlistFlag(rows, req.user?.id);
    return sendPaginated(res, rowsWithWishlist, count, page, limit, 'Search results');
  } catch (err) {
    next(err);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { page, limit, offset } = getPaginationParams(req.query);

    const { count, rows } = await Product.findAndCountAll({
      where: { category_id: categoryId },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit,
      offset
    });

    const rowsWithWishlist = await addWishlistFlag(rows, req.user?.id);
    return sendPaginated(res, rowsWithWishlist, count, page, limit, 'Products by category');
  } catch (err) {
    next(err);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      categoryId,
      originCountry,
      foodType,
      stockStatus,
      status,
      featured,
      pricelist,
      seoMetaTitle,
      seoMetaDescription,
      seoAlt,
      seoIndex,
      seoFollow,
      seoCanonical,
      seoSchemaJson,
      stock
    } = req.body;
    const slugValue = slug || slugify(name);
    let imageUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'exotic-fruits/products');
      imageUrl = uploaded.url;
    }
    const product = await Product.create({
      name,
      slug: slugValue,
      description,
      category_id: categoryId,
      originCountry,
      foodType,
      stockStatus,
      status,
      featured,
      pricelist,
      seoMetaTitle,
      seoMetaDescription,
      seoAlt,
      seoIndex,
      seoFollow,
      seoCanonical,
      seoSchemaJson,
      stock,
      image: imageUrl
    });
    // Flatten category_name in response
    let response = product.toJSON();
    if (product.category_id) {
      const category = await Category.findByPk(product.category_id);
      response.category_name = category ? category.name : null;
    }
    return sendSuccess(res, 201, response, 'Product created');
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');

    const {
      name,
      slug,
      description,
      categoryId,
      originCountry,
      foodType,
      stockStatus,
      status,
      featured,
      pricelist,
      seoMetaTitle,
      seoMetaDescription,
      seoAlt,
      seoIndex,
      seoFollow,
      seoCanonical,
      seoSchemaJson,
      stock
    } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
      updates.slug = slug || slugify(name);
    }
    if (description !== undefined) updates.description = description;
    if (categoryId !== undefined) updates.category_id = categoryId;
    if (originCountry !== undefined) updates.originCountry = originCountry;
    if (foodType !== undefined) updates.foodType = foodType;
    if (stockStatus !== undefined) updates.stockStatus = stockStatus;
    if (status !== undefined) updates.status = status;
    if (featured !== undefined) updates.featured = featured;
    if (pricelist !== undefined) updates.pricelist = pricelist;
    if (seoMetaTitle !== undefined) updates.seoMetaTitle = seoMetaTitle;
    if (seoMetaDescription !== undefined) updates.seoMetaDescription = seoMetaDescription;
    if (seoAlt !== undefined) updates.seoAlt = seoAlt;
    if (seoIndex !== undefined) updates.seoIndex = seoIndex;
    if (seoFollow !== undefined) updates.seoFollow = seoFollow;
    if (seoCanonical !== undefined) updates.seoCanonical = seoCanonical;
    if (seoSchemaJson !== undefined) updates.seoSchemaJson = seoSchemaJson;
    if (stock !== undefined) updates.stock = stock;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, 'exotic-fruits/products');
      updates.image = uploaded.url;
    }

    await product.update(updates);
    return sendSuccess(res, 200, product, 'Product updated');
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');
    await product.destroy();
    return sendSuccess(res, 200, null, 'Product deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProduct, searchProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct };
