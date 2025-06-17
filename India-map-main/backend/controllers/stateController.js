import stateModel from "../models/stateModel.js";
import Gsdp from "../models/gsdpModel.js";

//fetch all states
const getAllStates = async (req, res) => {
    try {
        const states = await stateModel.find();
        res.json(states);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { getAllStates }


