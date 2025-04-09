import User from "../database/models/user";
import { Op } from "sequelize";
import { UniqueConstraintError } from "sequelize";


export const createUserInDB = async (userModuleData: any) => {
  try {
    return await User.create(userModuleData);
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      const field = error.errors[0]?.path;
      let message = "Duplicate value";

      switch (field) {
        case "email":
          message = "Email already exists";
          break;
        case "phone":
          message = "Phone number already exists";
          break;
        case "gstin":
          message = "GSTIN already exists";
          break;
      }

      const customError = new Error(message);
      (customError as any).statusCode = 400;
      throw customError;
    }

    throw error;
  }
};

export const findUserInDB = async (object: any) => {
  try {
    return await User.findOne({ where: object });
  } catch (error) {
    throw error;
  }
};



export const findUserByPkInDB = async (id: number) => {
  try {
    const user = await User.findByPk(id);
    if (!user) throw new Error("User not found");
    return user;
  } catch (error) {
    throw new Error(`Error finding user by ID: ${error.message}`);
  }
};

export const updateUserInDB = async (user, user_data) => {
  try {
    await user.update(user_data);
    return user;
  } catch (error) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const findSellerList = async (page, limit, search) => {
  try {
    const offset = (page - 1) * limit; 

    const { rows: sellers, count: totalSellers } = await User.findAndCountAll({
      where: {
        role: "seller",
        companyName: {
          [Op.iLike]: `%${search}%`,
        },
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]], 
    });

    return {
      sellers,
      pagination: {
        total: totalSellers,
        page,
        limit,
        totalPages: Math.ceil(totalSellers / limit),
      },
    };
  } catch (error) {
    throw new Error(`Error fetching seller list: ${error.message}`);
  }
};




