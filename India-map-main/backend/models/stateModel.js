import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    state_code: String,
    state_name: String,
})

export default mongoose.model('State', stateSchema)
