import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import tagRoutes from "./routes/tagRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import stateRoutes from "./routes/stateRoutes.js";

const app = express();

// Safe CORS setup without credentials
app.use(cors({
  origin: function (origin, callback) {
    // Allow localhost by default for development
    if (!origin || 
        origin === 'http://localhost:5173' || 
        origin === 'http://127.0.0.1:5173' ||
        // Also allow the Render deployment URL
        origin === 'https://india-map-main.onrender.com') {
      callback(null, true);
    } else {
      // For production, check against allowedOrigins
      const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // Explicitly disable credentials
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Routes
app.use('/api/data', dataRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/states', stateRoutes);

app.use(express.static('public'));

export { app };
