import Gsdp from "../models/gsdpModel.js";

// GET /api/data/gsdp/:year
export const getGSDPByYear = async (req, res) => {
  const { year } = req.params;
  try {
    const data = await Gsdp.find({ year });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//get gsdp by state year and code
const getGsdpByStateYearAndCode = async (req, res) => {
  const { stateCode, year } = req.params;
  try {
      const gsdp = await Gsdp.findOne({ state_code: stateCode, year });
      res.json(gsdp);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

export { getGsdpByStateYearAndCode }
