import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getGlobalStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalStores,
    totalProducts,
    totalOrders,
    revenue
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Store.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      {
        $match: {
          status: { $in: ["approved", "delivered"] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ])
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalStores,
      totalProducts,
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0
    }, "Global stats fetched")
  );
});

const getStoreStats = asyncHandler(async (req, res) => {
  const stats = await Order.aggregate([
    {
      $match: {
        status: { $in: ["approved", "delivered"] }
      }
    },
    {
      $group: {
        _id: "$store",
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" }
      }
    },
    {
      $lookup: {
        from: "stores",
        localField: "_id",
        foreignField: "_id",
        as: "store"
      }
    },
    { $unwind: "$store" },
    {
      $project: {
        _id: 0,
        storeId: "$store._id",
        storeName: "$store.storeName",
        totalOrders: 1,
        totalRevenue: 1
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, stats, "Store stats fetched")
  );
});


const getSalesSummary = asyncHandler(async (req, res) => {
  const summary = await Order.aggregate([
    {
      $match: {
        status: { $in: ["approved", "delivered"] }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);

  return res.status(200).json(
    new ApiResponse(200, summary, "Sales summary fetched")
  );
});


const getTopProducts = asyncHandler(async (req, res) => {
  const topProducts = await Order.aggregate([
    {
      $match: {
        status: { $in: ["approved", "delivered"] }
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: {
            $multiply: ["$items.quantity", "$items.price"]
          }
        }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        _id: 0,
        productId: "$product._id",
        name: "$product.name",
        price: "$product.price",
        totalSold: 1,
        totalRevenue: 1
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, topProducts, "Top products fetched")
  );
});



export {
  getGlobalStats,
  getStoreStats,
  getSalesSummary,
  getTopProducts
};
