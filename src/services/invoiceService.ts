import Invoice from "../database/models/invoice";

export const createInvoice = async (data) => {
  const subtotal = data.quantity * data.pricePerUnit;
  const totalAmount = subtotal + (data.tax || 0);

  const invoiceNumber = `INV-${Date.now()}`;

  return await Invoice.create({
    ...data,
    subtotal,
    totalAmount,
    invoiceNumber,
    paymentStatus: "PENDING",
    status: "GENERATED",
  });
};

export const getInvoiceById = async (id: number) => {
  return await Invoice.findByPk(id);
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

export const getInvoicesByRole = async (userId, role, page, limit) => {
  const offset = (page - 1) * limit;

  const whereClause = {};

  if (role === "buyer") {
    //@ts-ignore
    whereClause.buyerId = userId;
  } else if (role === "seller") {
        //@ts-ignore
    whereClause.sellerId = userId;
  } else {
    throw new Error("Invalid user role");
  }

  const invoices = await Invoice.findAndCountAll({
    where: whereClause,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return invoices;
};
