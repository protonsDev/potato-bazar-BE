import { Request, Response } from "express";
import * as invoiceService from "../services/invoiceService";

export const createInvoice = async (req, res) => {
  try {
    const value  = req.body;    
    const invoice = await invoiceService.createInvoice(value);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    console.error("Create invoice error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(Number(id));

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    res.json({ success: true, data: invoice });
  } catch (err) {
    console.error("Fetch invoice error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const listInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.listInvoices();
    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error("List invoice error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateInvoicePayment = async (req, res) => {
  try {
    const { paymentMode, paymentDate, paymentReference, notes,invoiceId } = req.body;

    const updatedInvoice = await invoiceService.updateInvoicePaymentDetails(invoiceId, {
      paymentMode,
      paymentDate,
      paymentReference,
      notes,
      status: "PAID", // update status
    });

    if (!updatedInvoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    return res.status(200).json({ success: true, data: updatedInvoice });
  } catch (err) {
    console.error("Error updating invoice payment:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInvoiceByUserId = async (req, res) => {
  try{
    const userId = req.user.id;
    const role = req.user.role;
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const invoices = await invoiceService.getInvoicesByRole(userId, role, parsedPage, parsedLimit);

    return res.status(200).json({
      success: true,
      data: invoices.rows,
      pagination: {
        totalItems: invoices.count,
        totalPages: Math.ceil(invoices.count / parsedLimit),
        currentPage: parsedPage,
      },
      message: "Invoices retrieved successfully",
    });

  }catch(error){
    res.status(500).json({ success: false, message: "Server error" });
  }

}




