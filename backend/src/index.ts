import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeStock, searchCompanies } from "./controllers/stockController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5055;

// Middleware
app.use(cors({
  origin: "*", // Allow any frontend port during local pair programming
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.get("/api/analyze", analyzeStock);
app.get("/api/search", searchCompanies);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[Server] Stock Analyzer AI backend running on port ${PORT}`);
});
