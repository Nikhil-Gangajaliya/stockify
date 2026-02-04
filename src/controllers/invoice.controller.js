import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Store } from "../models/store.model.js";
import { Invoice } from "../models/invoice.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  // ✅ only admin can generate invoice
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can generate invoice");
  }

  // ✅ order is source of truth
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // ✅ avoid duplicate invoice
  const existingInvoice = await Invoice.findOne({ order: orderId });
  if (existingInvoice) {
    throw new ApiError(400, "Invoice already exists for this order");
  }

  // ✅ create minimal invoice
  const invoice = await Invoice.create({
    order: orderId,
    invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    amount: order.totalAmount
  });

  return res.status(201).json(
    new ApiResponse(201, invoice, "Invoice generated successfully")
  );
});

const getInvoiceDetails = asyncHandler(async (req, res) => {
  const { invoiceId } = req.params;

  // 1️⃣ Fetch invoice + order + buyer + buyer store
  const invoice = await Invoice.findById(invoiceId)
    .populate({
      path: "order",
      populate: [
        { path: "user", populate: "store" },
        { path: "items.product" }
      ]
    });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const { order } = invoice;

  // 2️⃣ SELLER = CURRENT LOGGED-IN ADMIN
  const admin = await User.findById(req.user._id).populate("store");
  if (!admin || !admin.store) {
    throw new ApiError(400, "Seller store not configured");
  }

  // 3️⃣ BUYER = ORDER USER
  const buyer = order.user;

  const response = {
    invoiceNumber: invoice.invoiceNumber,
    invoiceDate: invoice.createdAt,
    amount: invoice.amount,

    // ✅ SELLER → LOGGED-IN ADMIN
    seller: {
      storeName: admin.store.storeName,
      gstNumber: admin.store.gstNumber,
      email: admin.email,
      address: admin.address,
      contact: admin.contact
    },

    // ✅ BUYER → ORDER.USER + ORDER.USER.STORE
    buyer: {
      storeName: buyer.store.storeName,
      email: buyer.email,
      address: buyer.address,
      contact: buyer.contact
    },

    // ✅ PRODUCTS → ORDER.ITEMS
    items: order.items.map(item => ({
      product: item.product.name,
      quantity: item.quantity,
      price: item.price,
      total: item.quantity * item.price
    }))
  };

  return res.status(200).json(
    new ApiResponse(200, response, "Invoice details fetched")
  );
});


const getInvoiceByOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const invoice = await Invoice.findOne({ order: orderId })
    .populate("order");

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const isAdmin = req.user.role === "admin";
  const isOwner = invoice.order.user.toString() === req.user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new ApiError(403, "Not authorized to view this invoice");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Invoice retrieved successfully")
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
  getInvoiceByOrder,
  getInvoicesByStore
};