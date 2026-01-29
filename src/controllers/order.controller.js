import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { products } = req.body;

  if (!products || products.length === 0) {
    throw new ApiError(400, "Order must contain at least one product");
  }

  const store = await Store.findOne({ owner: userId });
  if (!store) {
    throw new ApiError(404, "Store not found for this user");
  }

  let orderItems = [];
  let totalAmount = 0;

  for (const item of products) {
    const product = await Product.findOneAndUpdate(
      {
        _id: item.productId,
        stock: { $gte: item.quantity }
      },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!product) {
      throw new ApiError(400, "Insufficient stock or product not found");
    }

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price
    });

    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    user: userId,
    store: store._id,
    items: orderItems,
    totalAmount,
    status: "pending"
  });

  return res.status(201).json(
    new ApiResponse(201, order, "Order placed successfully")
  );
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name price");

  return res.status(200).json(
    new ApiResponse(200, orders, "All orders fetched successfully")
  );
});


const getOrdersByStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const orders = await Order.find({ store: storeId })
    .populate("user", "name email")
    .populate("items.product", "name price");

  return res.status(200).json(
    new ApiResponse(200, orders, "Orders fetched successfully")
  );
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("user", "name email")
    .populate("items.product", "name price");

  return res.status(200).json(
    new ApiResponse(200, orders, "Orders fetched successfully")
  );
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("items.product");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // user can cancel ONLY his order
  if (order.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not allowed to cancel this order");
  }

  if (order.status !== "pending") {
    throw new ApiError(400, "Order cannot be cancelled at this stage");
  }

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: item.quantity }
    });
  }

  order.status = "cancelled";
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, "Order cancelled successfully")
  );
});


export {
    createOrder,
    getAllOrders,
    getOrdersByStore,
    getMyOrders,
    cancelOrder
};