'use strict';

const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendSuccess, sendError } = require('../utils/responses');

const getCart = async (req, res, next) => {
  try {
    const items = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{ 
        model: Product, 
        as: 'product', 
        attributes: ['id', 'name', 'price', 'image', 'stock', 'pricelist'] 
      }],
      order: [['createdAt', 'DESC']],
      raw: false
    });

    console.log('📦 getCart - Found', items.length, 'items for user', req.user.id);

    // Format response with calculated prices
    const formattedItems = items.map((item, idx) => {
      let selectedUnit = null;
      try {
        selectedUnit = item.selected_unit ? (typeof item.selected_unit === 'string' ? JSON.parse(item.selected_unit) : item.selected_unit) : null;
      } catch (e) {
        console.error('Error parsing selected_unit:', e);
      }

      console.log(`📦 Cart Item ${idx}:`, {
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        selectedUnitId: selectedUnit?.unitId,
        selectedUnitName: selectedUnit?.unitName,
        selectedUnitPrice: selectedUnit?.afterDiscountPrice,
      });

      return {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          stock: item.product.stock,
          pricelist: item.product.pricelist ? (typeof item.product.pricelist === 'string' ? JSON.parse(item.product.pricelist) : item.product.pricelist) : []
        },
        quantity: item.quantity,
        selectedUnit,
        unitPrice: parseFloat(item.unit_price),
        totalPrice: parseFloat(item.unit_price) * item.quantity
      };
    });

    return sendSuccess(res, 200, formattedItems, 'Cart retrieved');
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { product_id, quantity, selected_unit } = req.body;

    console.log('📍 addToCart called with:', { product_id, quantity, selected_unit: selected_unit?.unitId });

    // Validate input
    if (!product_id || !quantity) {
      return sendError(res, 400, 'INVALID_INPUT', 'Product ID and quantity are required');
    }

    const product = await Product.findByPk(product_id);
    if (!product) return sendError(res, 404, 'NOT_FOUND', 'Product not found');

    // Determine unit price based on selected unit or use base price
    let unitPrice = product.price;
    let selectedUnitData = null;

    if (selected_unit) {
      // Parse pricelist and find the selected unit
      try {
        const pricelist = JSON.parse(product.pricelist || '[]');
        selectedUnitData = pricelist.find(unit => unit.unitId === selected_unit.unitId);
        if (selectedUnitData) {
          unitPrice = selectedUnitData.afterDiscountPrice || selectedUnitData.price;
          console.log('✅ Found selected unit:', { unitId: selectedUnitData.unitId, unitName: selectedUnitData.unitName, price: unitPrice });
        } else {
          console.log('❌ Selected unit NOT found in pricelist. UnitId:', selected_unit.unitId);
        }
      } catch (e) {
        console.error('Error parsing pricelist:', e);
      }
    }

    // Check if item already exists with the SAME selected unit/price
    let existing = null;
    const allCartItems = await Cart.findAll({
      where: { user_id: req.user.id, product_id }
    });

    console.log('📦 Found', allCartItems.length, 'existing cart items for this product');

    // Find cart item with matching selected unit
    if (allCartItems && allCartItems.length > 0) {
      existing = allCartItems.find(item => {
        const itemSelectedUnit = item.selected_unit ? (typeof item.selected_unit === 'string' ? JSON.parse(item.selected_unit) : item.selected_unit) : null;
        const currentSelectedUnit = selectedUnitData || null;
        
        console.log('🔍 Comparing units:', { 
          existingUnitId: itemSelectedUnit?.unitId, 
          newUnitId: currentSelectedUnit?.unitId,
          match: itemSelectedUnit?.unitId === currentSelectedUnit?.unitId 
        });
        
        // If both are null, match
        if (!itemSelectedUnit && !currentSelectedUnit) return true;
        
        // If both exist and have same unitId, match
        if (itemSelectedUnit && currentSelectedUnit && itemSelectedUnit.unitId === currentSelectedUnit.unitId) return true;
        
        return false;
      });
    }

    if (existing) {
      console.log('🔄 Updating existing item quantity from', existing.quantity, 'to', existing.quantity + quantity);
      await existing.update({ 
        quantity: existing.quantity + quantity,
        unit_price: unitPrice,
        selected_unit: selectedUnitData ? JSON.stringify(selectedUnitData) : null
      });
      return sendSuccess(res, 200, {
        id: existing.id,
        product: { id: product.id, name: product.name },
        quantity: existing.quantity + quantity,
        unitPrice,
        totalPrice: unitPrice * (existing.quantity + quantity),
        message: 'Quantity updated'
      }, 'Cart item updated');
    }

    // Create new cart item
    console.log('✨ Creating new cart item with unitPrice:', unitPrice);
    const item = await Cart.create({
      user_id: req.user.id,
      product_id,
      quantity,
      unit_price: unitPrice,
      selected_unit: selectedUnitData ? JSON.stringify(selectedUnitData) : null
    });

    console.log('✅ New cart item created:', { id: item.id, unitPrice, quantity });

    return sendSuccess(res, 201, {
      id: item.id,
      product: { id: product.id, name: product.name },
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity
    }, 'Item added to cart');
  } catch (err) {
    next(err);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const item = await Cart.findOne({ 
      where: { id: req.params.id, user_id: req.user.id } 
    });
    if (!item) {
      return sendError(res, 404, 'NOT_FOUND', 'Cart item not found');
    }

    const { quantity, selected_unit } = req.body;
    
    if (!quantity || quantity < 1) {
      return sendError(res, 400, 'INVALID_INPUT', 'Quantity must be at least 1');
    }

    // Update unit price if selected_unit changed
    let updateData = { quantity };
    
    if (selected_unit) {
      const product = await Cart.findByPk(item.id, {
        include: [{ model: Product, as: 'product' }]
      });
      
      if (product) {
        try {
          const pricelist = JSON.parse(product.product.pricelist || '[]');
          const selectedUnitData = pricelist.find(unit => unit.unitId === selected_unit.unitId);
          if (selectedUnitData) {
            updateData.unit_price = selectedUnitData.afterDiscountPrice || selectedUnitData.price;
            updateData.selected_unit = JSON.stringify(selectedUnitData);
          }
        } catch (e) {
          console.error('Error parsing pricelist:', e);
        }
      }
    }

    await item.update(updateData);
    return sendSuccess(res, 200, item, 'Cart item updated');
  } catch (err) {
    next(err);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const item = await Cart.findOne({ 
      where: { id: req.params.id, user_id: req.user.id } 
    });
    if (!item) {
      return sendError(res, 404, 'NOT_FOUND', 'Cart item not found');
    }
    await item.destroy();
    return sendSuccess(res, 200, null, 'Item removed from cart');
  } catch (err) {
    next(err);
  }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.destroy({ where: { user_id: req.user.id } });
    return sendSuccess(res, 200, null, 'Cart cleared');
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
