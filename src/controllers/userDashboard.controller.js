import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getUserDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [
        totalOrders,
        deliveredOrders,
        pendingOrders,
        totalSpent
    ] = await Promise.all([
        Order.countDocuments({ user: userId }),
        Order.countDocuments({
            user: userId,
            status: "delivered"
        }),
        Order.countDocuments({
            user: userId,
            status: { $in: ["pending", "approved"] }
        }),
        Order.aggregate([
            {
                $match: {
                    user: userId,
                    status: { $in: ["approved", "delivered"] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ])
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalOrders,
                deliveredOrders,
                pendingOrders,
                totalSpent: totalSpent[0]?.totalAmount || 0
            },
            "User dashboard stats fetched"
        )
    );
});

const getUserRecentOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("status totalAmount createdAt")
        .populate("store", "storeName");

    return res.status(200).json(
        new ApiResponse(200, orders, "Recent orders fetched")
    );
});

const getUserOrderStatusSummary = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const summary = await Order.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, summary, "Order status summary fetched")
    );
});

export {
    getUserDashboardStats,
    getUserRecentOrders,
    getUserOrderStatusSummary
}
