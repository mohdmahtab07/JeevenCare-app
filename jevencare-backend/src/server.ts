import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import app from "./app";
import { connectDatabase } from "./config/db";

const PORT = process.env.PORT || 5000;

// Connect to database
connectDatabase();

// Start server
app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});
