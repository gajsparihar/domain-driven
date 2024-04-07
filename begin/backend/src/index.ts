// src/app.ts

import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware for parsing JSON request body
app.use(express.json());

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};


// Register user routes
app.use("/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
