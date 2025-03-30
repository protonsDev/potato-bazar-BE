import { createQuote, createDeliveryScheduleQuotes } from "../services/quoteService";

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