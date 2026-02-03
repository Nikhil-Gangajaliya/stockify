import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.model.js";
import { StoreInventory } from "../models/storeInventory.model.js";

const getPendingOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ status: "pending" })
        .populate("user", "name email")
        .populate("items.product", "name price");

    res.status(200).json(
        new ApiResponse(200, orders, "Pending orders fetched")
    );
});

const approveOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status !== "pending") {
        throw new ApiError(400, "Order already processed");
    }

    order.status = "approved";
    await order.save();

    res.status(200).json(
        new ApiResponse(200, order, "Order approved")
    );
});

const rejectOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status !== "pending") {
        throw new ApiError(400, "Order already processed");
    }

    // restore stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: item.quantity }
        });
    }

    order.status = "rejected";
    await order.save();

    res.status(200).json(
        new ApiResponse(200, order, "Order rejected & stock restored")
    );
});

// const deliverOrder = asyncHandler(async (req, res) => {
//   const { orderId } = req.params;

//   const order = await Order.findById(orderId);
//   if (!order) throw new ApiError(404, "Order not found");

//   if (order.status !== "approved") {
//     throw new ApiError(400, "Only approved orders can be delivered");
//   }

//   for (const item of order.items) {
//     await StoreInventory.findOneAndUpdate(
//       {
//         store: order.store,
//         product: item.product,
//       },
//       {
//         $inc: { stock: item.quantity },
//       },
//       {
//         upsert: true,
//         new: true,
//       }
//     );
//   }

//   order.status = "delivered";
//   await order.save();

//   return res.status(200).json(
//     new ApiResponse(200, order, "Order delivered & inventory updated")
//   );
// });


const adminCancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("items.product");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (["cancelled"].includes(order.status)) {
    throw new ApiError(400, "Order cannot be cancelled");
  }

  
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: item.quantity }
    });
  }

  order.status = "cancelled";
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, "Order cancelled by admin")
  );
});


export {
    getPendingOrders,
    approveOrder,
    rejectOrder,
    // deliverOrder,
    adminCancelOrder
};