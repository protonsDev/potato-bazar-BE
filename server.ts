import express from "express";
const cors = require('cors');
import sequelize from "./src/database/models/db";
const app = express();
import userRoutes from "./src/routes/userRoutes";
import rfqRoutes from "./src/routes/rfqRoutes";

app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/rfq", rfqRoutes);



app.use(cors({
    origin: '*',  
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));
  const PORT = 8000;
  
  const startServer = async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connected!");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  };
  
  startServer();
  