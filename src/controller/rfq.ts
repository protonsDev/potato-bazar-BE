import { createRFQDB, getRFQsDB, getRFQByIdDB, addSuppliersToRFQ , getSupplierRFQsService, getRFQDetails, getMyRFQsService} from "../services/rfqService";

export const createRFQ = async (req, res) => {
  try {
    const {
      title,
      quantity,
      unitType,
      targetPrice,
      potatoVariety,
      grade,
      size,
      packagingType,
      quantityPerBag,
      paymentTerms,
      customPaymentTerms,
      remarks,
      submissionDeadline,
      deliverySchedules,
      status
    } = req.body;
    if (req.user.role != "buyer") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only buyers are allowed to create RFQs",
        });
    }
    // Call service to create RFQ
    const rfq = await createRFQDB({
      buyerId: req.user.id,
      title,
      quantity,
      unitType,
      targetPrice,
      potatoVariety,
      grade,
      size,
      packagingType,
      quantityPerBag,
      paymentTerms,
      customPaymentTerms,
      remarks,
      submissionDeadline,
      deliverySchedules,
      status
    });

    return res.status(201).json({
      success: true,
      data: rfq,
      message: "RFQ created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating RFQ",
      error: error.message,
    });
  }
};

export const getRFQs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const rfqs = await getRFQsDB(parsedPage, parsedLimit);

    return res.status(200).json({
      success: true,
      data: rfqs.rfqs,
      totalRecords: rfqs.totalRecords,
      totalPages: rfqs.totalPages,
      currentPage: parsedPage,
      message: "RFQs retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching RFQs",
      error: error.message,
    });
  }
};

export const getRFQById = async (req, res) => {
  try {
    const { id } = req.params;
    const rfq = await getRFQByIdDB(id);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: "RFQ not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rfq,
      message: "RFQ retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching RFQ",
      error: error.message,
    });
  }
};

export const addSuppliers = async (req, res) => {
  try {
    const { supplierIds , rfqId} = req.body;
    

    if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "supplierIds must be an array of supplier IDs.",
      });
    }

    const suppliers = await addSuppliersToRFQ(parseInt(rfqId, 10), supplierIds);

    return res.status(201).json({
      success: true,
      message: "Suppliers added successfully.",
      data: suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding suppliers.",
      error: error.message,
    });
  }
};

export const getSupplierRFQsController = async (req, res) => {
  try {
    const supplierId = Number(req.user.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";


    const result = await getSupplierRFQsService(
      supplierId,
      page,
      limit,
      search,
    );

    return res.json({
      success: true,
      data: result.rfqs,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching supplier RFQs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching supplier RFQs.",
    });
  }
};

export const getSupplierRFQsDetails = async (req, res) => {
  try {
     const rfqId = req.query.rfqId;

    if (isNaN(rfqId)) {
      return res.status(400).json({ success: false, message: "Invalid rfqId." });
    }

    const result = await getRFQDetails(rfqId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching  RFQs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching  RFQs.",
    });
  }
};


export const getMyRFQsController = async (req, res) => {
  try{
    const buyerId = Number(req.user.id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";

    const data = await getMyRFQsService(buyerId,page,limit,search);
    return res.json({
      success: true,
      data: data.rfqs,
      pagination: data.pagination,
    });

  }catch(error){
    return res.status(500).json({
      success: false,
      message: "Server error fetching  RFQs.",
    });
  }
}

