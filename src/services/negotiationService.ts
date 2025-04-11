import Negotiation from "../database/models/negotiations";
import Quote from "../database/models/quote";
import RFQ from "../database/models/rfqs";

export const createNegotiation = async (data) => {
  try {
    const negotiation = await Negotiation.create(data);
    return negotiation;
  } catch (error) {
    throw error;
  }
};

export const getNegotiationsByQuote = async (quoteId, page, limit) => {
  try {
    const offset = (page - 1) * limit;

    const { rows, count } = await Negotiation.findAndCountAll({
      where: { quoteId },
      include: ["quote", "proposer"],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return { negotiations: rows, total: count };
  } catch (error) {
    throw error;
  }
};

export const updateNegotiationStatus = async (id, status) => {
  try {
    return await Negotiation.update({ status }, { where: { id } });
  } catch (error) {
    throw error;
  }
};

export const getPendingNegotiations = async (proposerId) => {
  try {
    return await Negotiation.findAll({
      where: { proposerId, status: "pending" },
      include: ["quote", "proposer"],
    });
  } catch (error) {
    throw error;
  }
};

export const updateNegotiatedPrice = async (negotiationId) => {
  try {
    const negotiation = await Negotiation.findByPk(negotiationId);
    if (!negotiation) {
      throw new Error("Negotiation not found");
    }

    const quote = await Quote.findByPk(negotiation.quoteId);
    if (!quote) {
      throw new Error("Quote not found");
    }

    // Update the quote
    await quote.update({
      negotiatedPrice: negotiation.proposedCost,
      buyerStatus: "accepted",
      status: "awarded", // If you are tracking quote's internal status too
    });

    // Update the related RFQ to awarded
    await RFQ.update(
      { status: "awarded" },
      { where: { id: quote.rfqId } }
    );

    return quote;
  } catch (error) {
    throw error;
  }
};
