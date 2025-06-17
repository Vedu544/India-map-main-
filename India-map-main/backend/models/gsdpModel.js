import mongoose from "mongoose";

const gsdpSchema = new mongoose.Schema({
    state_code: String,
    year: String,
    gsdp: Number
})

export default mongoose.model('GSDP', gsdpSchema)

