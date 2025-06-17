import express from "express";
import { getAllStates } from "../controllers/stateController.js";
const router = express.Router();

router.get('/states', getAllStates);

export default router;
