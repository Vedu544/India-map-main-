import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import tagRoutes from "./routes/tagRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import stateRoutes from "./routes/stateRoutes.js";

const app = express();

// Safe CORS setup
const allowedOrigins = process.env.CORS_ORIGIN.split(',');

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

app.use(cookieParser());

// Routes
app.use('/api/data', dataRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/states', stateRoutes);

app.use(express.static('public'));

export { app };
