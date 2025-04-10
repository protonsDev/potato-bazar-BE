import Invoice from "../database/models/invoice";
import Quote from "../database/models/quote";
import RFQ from "../database/models/rfqs";
import User from "../database/models/user";
import { Op } from "sequelize";
import { sendPushNotification } from "../utlis/notifications";
import { notifyUser } from "./notificationService";

export const createInvoice = async (data) => {
  const subtotal = data.quantity * data.pricePerUnit;
  const totalAmount = subtotal + (data.tax || 0);
  const invoiceNumber = `INV-${Date.now()}`;

  const invoice = await Invoice.create({
    ...data,
    subtotal,
    totalAmount,
    invoiceNumber,
    paymentStatus: "PENDING",
    status: "GENERATED",
  });

  // Notify Seller
  await notifyUser(
    invoice.sellerId,
    "Invoice Generated",
    `An invoice (#${invoice.invoiceNumber}) has been generated for your quote.`,
    "invoice"
  );

  // Notify Buyer
  await notifyUser(
    invoice.buyerId,
    "New Invoice Received",
    `You have received a new invoice (#${invoice.invoiceNumber}).`,
    "invoice"
  );

  return invoice;
};

export const getInvoiceById = async (id: number) => {
  return await Invoice.findByPk(id, {
    include: [
      {
        model: User,
        as: "seller",
        attributes: ["id", "name"],
      },
      {
        model: User,
        as: "buyer",
        attributes: ["id", "name"],
      },
      {
        model: Quote,
        as: "quote", 
        attributes: ["id"],
        include:[
          {
            model:RFQ,
            as: "rfq",
          }
        ]

      }
    ],
  });
};

export const listInvoices = async () => {
  return await Invoice.findAll({ order: [["createdAt", "DESC"]] });
};

export const updateInvoicePaymentDetails = async (invoiceId, data) => {
  const invoice = await Invoice.findByPk(invoiceId);
  if (!invoice) return null;

  await invoice.update(data);
  return invoice;
};


export const getInvoicesByRole = async (userId, role, page, limit, search, status) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (role === "buyer") {
    whereClause.buyerId = userId;
  } else if (role === "seller") {
    whereClause.sellerId = userId;
  } else {
    throw new Error("Invalid user role");
  }

  // Apply optional filters
  if (search) {
    whereClause.invoiceNumber = {
      [Op.iLike]: `%${search}%`, 
    };
  }

  if (status) {
    whereClause.status = status;
  }

  const invoices = await Invoice.findAndCountAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return invoices;
};

