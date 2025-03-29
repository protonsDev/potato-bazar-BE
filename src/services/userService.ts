import User from "../database/models/user";
import { Op } from "sequelize";

export const createUserInDB = async (userModuleData: any) => {
  try{
    return await User.create(userModuleData);
  }catch(error){
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

