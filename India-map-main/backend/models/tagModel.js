// models/tagModel.js
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  state_code: String,
  tag_name: String,
  upvotes: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Tag', tagSchema);
