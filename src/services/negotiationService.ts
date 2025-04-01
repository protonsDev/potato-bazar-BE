import Negotiation from "../database/models/negotiations";
import Quote from "../database/models/quote";

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
  try{
    const negotiation = await Negotiation.findByPk(negotiationId);

    return await Quote.update(
      { negotiatedPrice: negotiation.proposedCost , buyerStatus:"accepted"}, 
      { where: { id: negotiation.quoteId } }
    );
  }catch(error){
    throw error;

  }
}

