import { createRFQDB, getRFQsDB, getRFQByIdDB, addSuppliersToRFQ , getSupplierRFQsService, getRFQDetails, getMyRFQsService, updateRFQDB, updateDeliverySchedulesDB, updateSuppliersForRFQ, getSupplierRFQsServiceV2, getRFQDetailsV2, getBuyerRFQDetailsV2} from "../services/rfqService";

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
      status,
      category,
      isTpod,
      isUc,
      isTpodPercent,
      isUcPercent,
      otherStandards
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
      status,
      category,
      isTpod,
      isUc,
      isTpodPercent,
      isUcPercent,
      otherStandards
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
    const variety = (req.query.variety as string) || "";



    const result = await getSupplierRFQsService(
      supplierId,
      page,
      limit,
      search,
      variety
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
     const userId = req.user.id;

    if (isNaN(rfqId)) {
      return res.status(400).json({ success: false, message: "Invalid rfqId." });
    }

    const result = await getRFQDetails(rfqId,userId);

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
    const status = (req.query.status as string) || ""

    const data = await getMyRFQsService(buyerId,page,limit,search,status);
    return res.json({
      success: true,
      data: data.rfqs,
      pagination: data.pagination,
      totalRFQs: data.totalRFQs,
      activeRFQs: data.activeRFQs,
      totalQuotesReceived:data.totalQuotesReceived,
      averageQuotesPerRFQ:data.averageQuotesPerRFQ
    });

  }catch(error){
    return res.status(500).json({
      success: false,
      message: "Server error fetching  RFQs.",
    });
  }
}

export const updateRFQ = async (req, res) => {
  try {
    const { rfqId } = req.query;

    if (req.user.role !== "buyer") {
      return res.status(403).json({
        success: false,
        message: "Only buyers are allowed to update RFQs",
      });
    }

    const updateData = {
      title: req.body.title,
      quantity: req.body.quantity,
      unitType: req.body.unitType,
      targetPrice: req.body.targetPrice,
      potatoVariety: req.body.potatoVariety,
      grade: req.body.grade,
      size: req.body.size,
      packagingType: req.body.packagingType,
      quantityPerBag: req.body.quantityPerBag,
      paymentTerms: req.body.paymentTerms,
      customPaymentTerms: req.body.customPaymentTerms,
      remarks: req.body.remarks,
      submissionDeadline: req.body.submissionDeadline,
      status: req.body.status,
    };

    const updatedRFQ = await updateRFQDB(rfqId, updateData);

    if (!updatedRFQ) {
      console.log(updatedRFQ)
      return res.status(404).json({
        success: false,
        message: "RFQ not found or update failed",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedRFQ,
      message: "RFQ updated successfully",
    });
  } catch (error) {
    console.log("error",error)
    return res.status(500).json({
      success: false,
      message: "Error updating RFQ",
      error: error.message,
    });
  }
};

export const updateDeliverySchedules = async (req, res) => {
  try {
    const { deliverySchedules } = req.body;

    if (!deliverySchedules || !Array.isArray(deliverySchedules)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. deliverySchedules must be an array.",
      });
    }

    const updatedSchedules = await updateDeliverySchedulesDB(deliverySchedules);

    return res.status(200).json({
      success: true,
      data: updatedSchedules,
      message: "Delivery schedules updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating delivery schedules",
      error: error.message,
    });
  }
};

export const updateSuppliers = async (req, res) => {
  try {
    const { supplierIds, rfqId } = req.body;

    if (!Array.isArray(supplierIds) || supplierIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "supplierIds must be an array of supplier IDs.",
      });
    }

    const updatedSuppliers = await updateSuppliersForRFQ(parseInt(rfqId, 10), supplierIds);

    return res.status(200).json({
      success: true,
      message: "Suppliers updated successfully.",
      data: updatedSuppliers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating suppliers.",
      error: error.message,
    });
  }
};

export const getSupplierRFQsDetailsBuyerSide = async (req, res) => {
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

export const getSupplierRFQsControllerV2 = async (req, res) => {
  try {
    const supplierId = Number(req.user.id);
    const search = (req.query.search as string) || "";


    const result = await getSupplierRFQsServiceV2(
      supplierId,
      search,
    );

    return res.json({
      success: true,
      data: result.rfqs,
    });
  } catch (error) {
    console.error("Error fetching supplier RFQs:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching supplier RFQs.",
    });
  }
};

export const getBuyerRFQsDetails = async (req, res) => {
  try {
     const rfqId = req.query.rfqId;
     const userId = req.user.id;

    if (isNaN(rfqId)) {
      return res.status(400).json({ success: false, message: "Invalid rfqId." });
    }

    const result = await getBuyerRFQDetailsV2(rfqId);

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

