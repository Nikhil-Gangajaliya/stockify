import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Invoice } from "../models/invoice.model.js";
import { Order } from "../models/order.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can generate invoice");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const exists = await Invoice.findOne({ order: orderId });
  if (exists) {
    throw new ApiError(400, "Invoice already exists");
  }

  const invoice = await Invoice.create({
    order: orderId,
    generatedBy: req.user._id, // ✅ SELLER SOURCE
    invoiceNumber: `INV-${Date.now()}`,
    amount: order.totalAmount
  });

  return res.status(201).json(
    new ApiResponse(201, invoice, "Invoice generated")
  );
});


const getInvoiceDetails = asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  const invoice = await Invoice.findById(invoiceId)
    .populate({
      path: "order",
      populate: [
        { path: "user", populate: "store" },
        { path: "items.product" }
      ]
    })
    .populate({
      path: "generatedBy",
      populate: "store"
    });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const order = invoice.order;
  const seller = invoice.generatedBy; // 🔥 FIXED
  const buyer = order.user;

  return res.status(200).json(
    new ApiResponse(200, {
      invoiceNumber: invoice.invoiceNumber,
      invoiceDate: invoice.createdAt,
      amount: invoice.amount,

      seller: {
        storeName: seller.store.storeName,
        gstNumber: seller.store.gstNumber,
        email: seller.email,
        address: seller.address,
        contact: seller.contact
      },

      buyer: {
        storeName: buyer.store.storeName,
        email: buyer.email,
        address: buyer.address,
        contact: buyer.contact
      },

      items: order.items.map(item => ({
        product: item.product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price
      }))
    })
  );
});


const getMyInvoices = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1️⃣ Find user's orders
  const orders = await Order.find({ user: userId }).select("_id");

  if (!orders.length) {
    return res.status(200).json(
      new ApiResponse(200, [], "No invoices found")
    );
  }

  const orderIds = orders.map(o => o._id);

  // 2️⃣ Find invoices for those orders
  const invoices = await Invoice.find({ order: { $in: orderIds } })
    .sort({ createdAt: -1 })
    .select("_id invoiceNumber amount createdAt");

  return res.status(200).json(
    new ApiResponse(200, invoices, "User invoices fetched successfully")
  );
});


const getAllInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({})
    .sort({ createdAt: -1 })
    .select("_id invoiceNumber amount createdAt");

  return res.status(200).json(
    new ApiResponse(200, invoices, "All invoices fetched successfully")
  );
});


const getInvoicesByStore = asyncHandler(async (req, res) => {
  const { storeId } = req.params;

  const invoices = await Invoice.find()
    .populate({
      path: "order",
      match: { store: storeId },
      populate: {
        path: "user",
        select: "name email"
      }
    });

  // remove invoices whose order didn't match
  const filteredInvoices = invoices.filter(inv => inv.order !== null);

  return res.status(200).json(
    new ApiResponse(200, filteredInvoices, "Invoices retrieved successfully")
  );
});


export {
  generateInvoice,
  getInvoiceDetails,
  getMyInvoices,
  getAllInvoices,
  getInvoicesByStore
};