import { createUserInDB ,findUserInDB, findUserByPkInDB} from "../services/userService";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { error } from "console";
import User from "../database/models/user";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signup = async (req, res) => {
    try {
      const email = req.body.email;
      const role = req.body.role;
  
      const userData = req.body;
  
      const existingUser = await findUserInDB({ email: email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: "Email already exists" });
      }
  
      // Create new user
      const newUser = await createUserInDB(userData);
  
      // Generate JWT Token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      res
        .status(201)
        .json({ success: true, message: "User created successfully", token, user: newUser });
    } catch (error) {
      res.status(500).json({success: false, message: "Error creating user", error });
    }
  };

  export const login = async (req , res) => {
    try {
      const { email, password,role } = req.body;
      console.log("Login attempt:", email);
  
      const user = await User.findOne({ where: { email } });
      if(role!=user.role){
        return res.status(400).json({ success: false, message: "Role is not allowed" });

      }
  
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ success: false, message: "Invalid email or password" });
      }
  
      console.log("Stored password hash:", user.passwordHash);
      console.log("Entered password:", password);
  
      const isMatch = await user.validPassword(password);
      console.log("Password match result:", isMatch);
  
      if (!isMatch) {
        return res.status(400).json({success: false, message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      res.status(200).json({success: true, message: "Login successful", token, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ success: false, message: "Error logging in", error });
    }
  };
  
  export const getUserProfile = async (req, res) => {
    try {
      const { role, id } = req.user; 
      const { userId } = req.query;  
  
      if (userId) {
      
        const user = await findUserByPkInDB(userId); 
        return res.status(200).json({ user });
      } 
  
      const user = await findUserByPkInDB(id);
      return res.status(200).json({ success: true, message:"Profile fetched successfully", user });
  
    } catch (error) {
      console.error(error); 
      return res.status(500).json({ success: false, message: "Error fetching user profile", error });
    }
  };
  