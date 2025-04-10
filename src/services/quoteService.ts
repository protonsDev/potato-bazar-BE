import DeliveryScheduleQuote from "../database/models/delivery_schedule_quote";
import Quote from "../database/models/quote";
import RFQ from "../database/models/rfqs";
import User from "../database/models/user";
import { Op } from "sequelize";


export const createQuote = async (data) => {
  try {
    const quote = await Quote.create(data);
    return quote;
  } catch (error) {
    throw error;
  }
};

export const createDeliveryScheduleQuotes = async (quoteId: number,
  scheduleQuotes: any, totalValue:any) => {
  try {
    await Quote.update(
      { totalCost: totalValue },  
      { where: { id: quoteId } } 
    );
     
    const quoteRecords = scheduleQuotes.map((item) => ({
      quoteId,
      deliveryScheduleId: item.deliveryScheduleId,
      pricePerQuintal: item.pricePerQuintal,
    }));

    const created = await DeliveryScheduleQuote.bulkCreate(quoteRecords);
    return created;
  } catch (error) {
    throw error;
  }
};

export const updateQuoteStatus = async (quoteId: number, status: "accepted" | "rejected") => {
  try {
    const quote = await Quote.findByPk(quoteId);
    if (!quote) {
      throw new Error("Quote not found");
    }

    if (status === "accepted") {
      const existingAcceptedQuote = await Quote.findOne({
        where: { rfqId: quote.rfqId, buyerStatus: "accepted" },
      });

      if (existingAcceptedQuote) {
        return null; 
      }
      
      return await quote.update({ buyerStatus: "accepted", negotiatedPrice: quote.totalCost });
    } else {
      return await quote.update({ buyerStatus: "rejected" });
    }
  } catch (error) {
    throw error;
  }
};

export const getQuoteListDb = async (
  supplierId,
  page,
  limit,
  status,
  search = ""
) => {
  try {
    const offset = (page - 1) * limit;

    const whereClause: any = { supplierId };

    if (status === "accepted") {
      whereClause.buyerStatus = "accepted";
    }

    const rfqWhere: any = {};
    if (search) {
      rfqWhere.title = { [Op.iLike]: `%${search}%` };
    }

    const { count, rows } = await Quote.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: RFQ,
          as: "rfq",
          where: rfqWhere,
        },
        {
          model: User,
          as: "supplier",
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      quote: rows,
      totalRFQs: count,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching Quotes: ${error.message}`);
  }
};


export const getQoutesDetailsById = async (quoteId) => {
try{
  return await Quote.findByPk(quoteId,{
    include:[
      {
        model:RFQ,
        as: "rfq",
      },
      {
        model: User,
        as:"supplier"
      }
    ]
  })
}catch(err){
  throw err;
}
}

export const getQuotesListByRfqDB = async (rfqId,page, limit) => {
  try{
    const offset = (page - 1) * limit;
    const { count, rows } = await Quote.findAndCountAll({
      where: { rfqId:rfqId },
      include:[
        {
          model:RFQ,
          as: "rfq",
        },
        {
          model: User,
          as:"supplier"
        }
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    return {
      quote: rows,
      totalRFQs: count,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
      },
    };

  }catch(error){
    throw error;
  }
}

