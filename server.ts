import express from "express";
const cors = require('cors');
import sequelize from "./src/database/models/db";
const app = express();
app.use(cors());

app.use(express.json());


app.use(cors({
    origin: '*',  
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
  }));
  const PORT = 5000;
  
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
  