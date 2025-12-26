import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { sequelize, User, Aset, Riwayat } from "./models/index.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import asetRoutes from "./routes/aset.routes.js";
import petaRoutes from "./routes/peta.routes.js";
import riwayatRoutes from "./routes/riwayat.routes.js";
import backupRoutes from "./routes/backup.routes.js";
import notifikasiRoutes from "./routes/notifikasi.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://sinkrona.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Static files
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/aset", asetRoutes);
app.use("/api/peta", petaRoutes);
app.use("/api/riwayat", riwayatRoutes);
app.use("/api/backup", backupRoutes);
app.use("/api/notifikasi", notifikasiRoutes);
app.use("/api/users", userRoutes);

// Landing page - serve from HTML file
app.get("/", async (req, res) => {
  const uptime = process.uptime();
  const uptimeFormatted = `${Math.floor(uptime / 3600)}h ${Math.floor(
    (uptime % 3600) / 60
  )}m ${Math.floor(uptime % 60)}s`;

  try {
    let html = await fs.readFile(
      path.join(__dirname, "views/landing.html"),
      "utf8"
    );

    // Replace placeholders
    html = html
      .replace("{{UPTIME}}", uptimeFormatted)
      .replace("{{SERVER_TIME}}", new Date().toLocaleTimeString("id-ID"))
      .replace("{{ENV}}", process.env.NODE_ENV || "development")
      .replace("{{YEAR}}", new Date().getFullYear());

    res.send(html);
  } catch (error) {
    res.status(500).send("Error loading landing page");
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server running", timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

// Initialize database and start server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(
        `🌐 Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  });

export default app;
