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
        return res.status(400).json({ message: "Email already exists" });
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
        .json({ message: "User created successfully", token, user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error });
    }
  };

  export const login = async (req , res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", email);
  
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        console.log("User not found");
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      console.log("Stored password hash:", user.passwordHash);
      console.log("Entered password:", password);
  
      const isMatch = await user.validPassword(password);
      console.log("Password match result:", isMatch);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
  
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      res.status(200).json({ message: "Login successful", token, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in", error });
    }
  };
  
  export const getUserProfile = async (req, res) => {
    try {
      const { role, id } = req.user; 
      const { userId } = req.query;  
  
      if (userId) {
        if (role !== "Admin") {
          return res.status(403).json({ message: "Only admins are allowed to access other users' profiles" });
        }
        const user = await findUserByPkInDB(userId); 
        return res.status(200).json({ user });
      } 
  
      const user = await findUserByPkInDB(id);
      return res.status(200).json({ user });
  
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ message: "Error fetching user profile", error });
    }
  };
  