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
