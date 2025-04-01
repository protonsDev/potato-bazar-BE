import { 
    createNegotiation, 
    getNegotiationsByQuote, 
    updateNegotiationStatus, 
    getPendingNegotiations, 
    updateNegotiatedPrice
  } from "../services/negotiationService";
  
  /**
   * ✅ Submit a new negotiation (Buyer or Seller can propose a new price)
   * 🔹 Expects: { quoteId, proposedAmount, proposerId (auto from user) }
   * 🔹 Returns: The created negotiation record
   */
  export const submitNegotiation = async (req, res) => {
    try {
      const data = req.body;
      data.proposerId = req.user.id; 
      
      const negotiation = await createNegotiation(data);
      
      res.status(201).json({ success: true, data: negotiation });
    } catch (err) {
      console.error(" Negotiation submission failed:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  /**
   * ✅ Fetch all negotiations for a specific Quote
   * 🔹 Used to track negotiation history on a particular Quote
   * 🔹 Returns: Array of negotiations for the given quoteId
   */
  export const fetchNegotiationsByQuote = async (req, res) => {
    try {
      const { quoteId } = req.params;
      const { page = 1, limit = 10 } = req.query; 
  
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
  
      const { negotiations, total } = await getNegotiationsByQuote(quoteId, pageNumber, pageSize);
  
      res.status(200).json({
        success: true,
        data: negotiations,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(total / pageSize),
          totalItems: total,
        },
      });
    } catch (err) {
      console.error("Error fetching negotiations:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  /**
   * ✅ Update the status of a negotiation (Accept/Reject)
   * 🔹 Used when Buyer/Seller agrees or disagrees with a proposed price
   * 🔹 Expects: { status: "accepted" or "rejected" }
   * 🔹 Returns: Success message after updating the status
   */
  export const modifyNegotiationStatus = async (req, res) => {
    try {
      const { negotiationId,status } = req.body;
      
      await updateNegotiationStatus(negotiationId, status);
      if (status === "accepted") {
        await updateNegotiatedPrice(negotiationId);
      }
      
      res.status(200).json({ success: true, message: " Negotiation status updated successfully" });
    } catch (err) {
      console.error(" Error updating negotiation status:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  /**
   * ✅ Fetch all pending negotiations for a specific user (Buyer/Seller)
   * 🔹 Helps users track negotiations that need their response
   * 🔹 Returns: List of negotiations where status is "pending"
   */
  export const fetchPendingNegotiations = async (req, res) => {
    try {
      const { proposerId } = req.params;
      const negotiations = await getPendingNegotiations(proposerId);
      
      res.status(200).json({ success: true, data: negotiations });
    } catch (err) {
      console.error(" Error fetching pending negotiations:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  