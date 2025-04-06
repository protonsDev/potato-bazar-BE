import {
    createDispatchService,
    getDispatchByIdService,
    getAllDispatchesService,
    updateDispatchService,
    deleteDispatchService,
    createStatusLogService,
    getLogsByDispatchIdService,
    deleteStatusLogService,
    getQuoteDetails,
    getQuoteWithFullDetails,
    getQuoteDeliverySchedule,
    deliverySchedulePaginatedList
  } from "../services/deliveryService";
  
  // ------------------ DISPATCH CONTROLLERS ------------------ //
  
  // 👉 Create a new Dispatch entry
  export const createDispatch = async (req, res) => {
    try {
      const data = req.body;
      const quote = await getQuoteDetails(data.quoteId);
      if (!quote) {
        return res.status(404).json({ success: false, message: "Quote not found." });
      }
      if (
        !quote.totalCost &&
        !quote.negotiatedPrice &&
        quote.buyerStatus !== "accepted"
      ) {
        return res.status(400).json({ success: false, message: "Quote not accepted yet!" });
      }
      
      const dispatch = await createDispatchService(data);
      res.status(201).json({ success: true, data: dispatch });
    } catch (err) {
      console.error("Create Dispatch Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // 👉 Get a single Dispatch by ID
  export const getDispatchById = async (req, res) => {
    try {
      const dispatch = await getDispatchByIdService(req.params.id);
      if (!dispatch) {
        return res.status(404).json({ success: false, message: "Dispatch not found" });
      }
      res.json({ success: true, data: dispatch });
    } catch (err) {
      console.error("Fetch Dispatch Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // 👉 Get all Dispatches
  export const getAllDispatches = async (_req, res) => {
    try {
      const dispatches = await getAllDispatchesService();
      res.json({ success: true, data: dispatches });
    } catch (err) {
      console.error("List Dispatches Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // 👉 Update a Dispatch by ID
  export const updateDispatch = async (req, res) => {
    try {
      const updated = await updateDispatchService(req.params.id, req.body);
      res.json({ success: true, data: updated });
    } catch (err) {
      console.error("Update Dispatch Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // 👉 Delete a Dispatch by ID
  export const deleteDispatch = async (req, res) => {
    try {
      await deleteDispatchService(req.params.id);
      res.json({ success: true, message: "Dispatch deleted" });
    } catch (err) {
      console.error("Delete Dispatch Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // ------------------ STATUS LOG CONTROLLERS ------------------ //
  
  // 👉 Add a new status log to a Dispatch
  export const createStatusLog = async (req, res) => {
    try {
      const log = await createStatusLogService(req.body);
      res.status(201).json({ success: true, data: log });
    } catch (err) {
      console.error("Create Status Log Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // 👉 Get all logs for a given Dispatch ID
  export const getLogsByDispatchId = async (req, res) => {
    try {
      const logs = await getLogsByDispatchIdService(req.params.dispatchId);
      res.json({ success: true, data: logs });
    } catch (err) {
      console.error("Fetch Status Logs Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
  // 👉 Delete a status log entry
  export const deleteStatusLog = async (req, res) => {
    try {
      await deleteStatusLogService(req.params.id);
      res.json({ success: true, message: "Status log deleted" });
    } catch (err) {
      console.error("Delete Status Log Error:", err);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  

// Get Quote + Delivery Schedules + Dispatch + Dispatch Logs
export const getQuoteAggregateDetails = async (req, res) => {
  try {
    const { dispatchId } = req.query;

    if (!dispatchId) {
      return res.status(400).json({
        success: false,
        message: "dispatchId is required",
      });
    }

    const data = await getQuoteWithFullDetails({ dispatchId });

    // if (!data || data.length === 0) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "No data found for the provided quoteId",
    //   });
    // }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Error fetching aggregate quote data:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getDeliveryScheduleQuoteforRfq = async (req, res) => {
  try{

    const {rfqId } = req.query;
     const userId = req.user.id;
    const deliveryScheduleQuote = await getQuoteDeliverySchedule(rfqId,userId);

    res.status(200).json({ success: true, deliveryScheduleQuote });
  }catch(error){
    console.log(error)
    res.status(500).json({ success: false, message: "Server error" });
  }
}


export const supplierDeliveryList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = "" } = req.query;

    const data = await deliverySchedulePaginatedList(userId, Number(page), Number(limit), search);

    res.status(200).json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
