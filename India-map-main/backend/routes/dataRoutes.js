import express from "express";

const router = express.Router();

import { getGSDPByYear, getGsdpByStateYearAndCode } from "../controllers/dataController.js";

router.get('/gsdp/:year', getGSDPByYear);
router.get('/gsdp/:stateCode/:year', getGsdpByStateYearAndCode);


export default router;