import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Invoice } from "../models/invoice.model.js";
import { Order } from "../models/order.model.js";

const generateInvoice = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate("items.product")
    .populate("user");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== "approved") {
    throw new ApiError(400, "Invoice can only be generated for approved orders");
  }

  const existingInvoice = await Invoice.findOne({ order: orderId });
  if (existingInvoice) {
    throw new ApiError(400, "Invoice already exists for this order");
  }

  const store = await Store.findById(order.store);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  let subtotal = 0;
  let totalTax = 0;

  const items = order.items.map(item => {
    const lineBase = item.quantity * item.price;
    const taxRate = 18; // example GST
    const taxAmount = (lineBase * taxRate) / 100;
    const lineTotal = lineBase + taxAmount;

    subtotal += lineBase;
    totalTax += taxAmount;

    return {
      product: item.product._id,
      productCode: item.product._id.toString().slice(-6),
      description: item.product.name,
      quantity: item.quantity,
      unitPrice: item.price,
      discount: 0,
      taxRate,
      lineTotal
    };
  });

  const invoiceNumber = `INV-${Date.now()}`;

  const invoice = await Invoice.create({
    invoiceNumber,
    order: orderId,

    seller: {
      companyName: store.name,
      address: store.address,
      contact: store.contact,
      gstNumber: store.gstNumber
    },

    buyer: {
      name: order.user.name,
      address: order.user.address,
      contact: order.user.email
    },

    items,

    summary: {
      subtotal,
      totalDiscount: 0,
      totalTax,
      shippingCharges: 0,
      grandTotal: subtotal + totalTax
    },

    paymentMethod: "UPI / Bank Transfer",
    notes: "Thank you for your business"
  });

  return res.status(201).json(
    new ApiResponse(201, invoice, "Invoice generated successfully")
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
    getInvoiceByOrder,
    getInvoicesByStore
};