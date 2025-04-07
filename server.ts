import express from "express";
const cors = require('cors');
import sequelize from "./src/database/models/db";
const app = express();
import userRoutes from "./src/routes/userRoutes";
import rfqRoutes from "./src/routes/rfqRoutes";
import quoteRoutes from "./src/routes/quoteRoutes";
import negotiationRoutes from "./src/routes/negotiationRoutes";
import deliveryRoutes from "./src/routes/deliveryRoutes";
import invoiceRoutes from './src/routes/invoiceRoutes';


app.use(cors());

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/rfq", rfqRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/negotiation", negotiationRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/invoice", invoiceRoutes);






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
  