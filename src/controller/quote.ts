import { createQuote, createDeliveryScheduleQuotes , updateQuoteStatus} from "../services/quoteService";

export const submitQuote = async (req, res) => {
    try {
      const data = req.body;
      data.supplierId=req.user.id;
      const quote = await createQuote(req.body);
      res.status(201).json({ success: true, data: quote });
    } catch (err) {
      console.error("Quote submission failed:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const submitDeliveryScheduleQuotes = async (req, res) => {
    try {
      const { quoteId, deliveryQuotes } = req.body;
      const result = await createDeliveryScheduleQuotes(quoteId, deliveryQuotes);
      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      console.error("Error in submitDeliveryScheduleQuotes:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  };

  export const modifyQuoteStatus = async (req, res) => {
    try {
      const { quoteId, status } = req.body;
  
      if (!["accepted", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
  
      const updatedQuote = await updateQuoteStatus(quoteId, status);
  
      if (!updatedQuote) {
        return res.status(400).json({ success: false, message: "Another quote has already been accepted for this RFQ" });
      }
  
      res.status(200).json({ success: true, message: `Quote ${status} successfully`, data: updatedQuote });
    } catch (err) {
      console.error("Error updating quote status:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };