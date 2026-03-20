'use strict';

const Cart = require('../models/Cart');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Product = require('../models/Product');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responses');
const { generateOrderNumber, getPaginationParams } = require('../utils/helpers');
const { sequelize } = require('../config/database');

const getUserOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Order.findAndCountAll({
      where: { user_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'Orders retrieved');
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }]
      }]
    });
    if (!order) return sendError(res, 404, 'NOT_FOUND', 'Order not found');
    return sendSuccess(res, 200, order, 'Order retrieved');
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { delivery_address, items, clientTotal } = req.body;

    // Validate that items array is provided
    if (!items || !Array.isArray(items) || items.length === 0) {
      await t.rollback();
      return sendError(res, 400, 'INVALID_ITEMS', 'Order must contain at least one item');
    }

    // === SERVER-SIDE PRICE VALIDATION ===
    // Fetch current prices from database for each product in the order
    let calculatedTotal = 0;
    const validatedItems = [];
    let priceTamperDetected = false;
    const productIds = items.map(i => parseInt(i.productId));

    // Fetch all products from database (fresh prices)
    const products = await Product.findAll({
      where: { id: productIds },
      transaction: t
    });

    const productMap = {};
    products.forEach(p => {
      productMap[p.id] = p;
    });

    // Validate each item and check for price tampering
    for (const frontendItem of items) {
      const productId = parseInt(frontendItem.productId);
      const quantity = parseInt(frontendItem.quantity) || 0;

      if (quantity <= 0) {
        await t.rollback();
        return sendError(res, 400, 'INVALID_QUANTITY', `Invalid quantity for product ${productId}`);
      }

      const product = productMap[productId];
      if (!product) {
        await t.rollback();
        return sendError(res, 400, 'PRODUCT_NOT_FOUND', `Product ${productId} not found`);
      }

      // Parse pricelist from database
      let pricelistOptions = [];
      try {
        if (product.pricelist) {
          pricelistOptions = typeof product.pricelist === 'string' 
            ? JSON.parse(product.pricelist) 
            : product.pricelist;
        }
      } catch (e) {
        console.error(`Failed to parse pricelist for product ${productId}:`, e);
      }

      // Determine the correct price to use
      let dbPrice;
      let unitName = 'Unit';

      // If pricelist exists and frontend sent a unit, validate against pricelist
      if (pricelistOptions.length > 0 && frontendItem.selectedUnit) {
        const matchedUnit = pricelistOptions.find(
          pl => pl.unitName === frontendItem.selectedUnit?.unitName
        );
        
        if (matchedUnit) {
          dbPrice = parseFloat(matchedUnit.afterDiscountPrice);
          unitName = matchedUnit.unitName;
        } else {
          // Unit not found in pricelist - potential tampering
          console.warn(`⚠️ UNIT TAMPERING: Product ${productId} - Unit "${frontendItem.selectedUnit?.unitName}" not found in pricelist`);
          priceTamperDetected = true;
          dbPrice = parseFloat(product.price); // Fallback to base price
        }
      } else {
        // No pricelist, use base price
        dbPrice = parseFloat(product.price);
      }

      // Compare frontend price with database price
      const frontendPrice = parseFloat(frontendItem.price);
      if (Math.abs(frontendPrice - dbPrice) > 0.01) {
        console.warn(`⚠️ PRICE TAMPER DETECTED: Product ${productId}`);
        console.warn(`   DB Price: ${dbPrice}, Frontend Price: ${frontendPrice}`);
        console.warn(`   Unit: ${unitName}`);
        priceTamperDetected = true;
      }

      const itemSubtotal = dbPrice * quantity;
      calculatedTotal += itemSubtotal;

      validatedItems.push({
        product_id: productId,
        quantity: quantity,
        unit_price: dbPrice,      // Use DB price (not frontend price)
        subtotal: itemSubtotal
      });
    }

    // Check total amount tampering (difference > $0.01)
    const clientTotalAmount = parseFloat(clientTotal) || 0;
    if (Math.abs(clientTotalAmount - calculatedTotal) > 0.01) {
      console.warn(`⚠️ TOTAL TAMPERING DETECTED`);
      console.warn(`   DB Calculated: ${calculatedTotal}, Client Sent: ${clientTotalAmount}`);
      priceTamperDetected = true;
    }

    // Generate order
    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      user_id: req.user.id,
      order_number: orderNumber,
      total_amount: calculatedTotal, // ✅ Use ONLY server-calculated total
      delivery_address,
      status: 'pending',
      tamper_detected: priceTamperDetected // Flag for security audit
    }, { transaction: t });

    // Create order items with server-validated prices
    const orderItemsData = validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.subtotal
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction: t });

    await t.commit();

    // Log security alert if tampering detected
    if (priceTamperDetected) {
      console.error(`🚨 SECURITY ALERT: Price tampering detected for user ${req.user.id} on order ${order.id}`);
    }

    return sendSuccess(res, 201, order, 'Order created successfully');
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return sendError(res, 404, 'NOT_FOUND', 'Order not found');
    const { status } = req.body;
    await order.update({ status });
    return sendSuccess(res, 200, order, 'Order status updated');
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await Order.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'All orders retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserOrders, getOrder, createOrder, updateOrderStatus, getAllOrders };
