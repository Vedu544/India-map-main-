// controllers/tagsController.js
import Tag from "../models/tagModel.js";

// POST /api/tags
const addTag = async (req, res) => {
  const { state_code, tag_name } = req.body;
  try {
    const newTag = await Tag.create({ state_code, tag_name });
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tags/:stateCode
const getTags = async (req, res) => {
  const { stateCode } = req.params;
  try {
    const tags = await Tag.find({ state_code: stateCode }).sort({ upvotes: -1 });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/tags/upvote/:tagId
const upvoteTag = async (req, res) => {
  const { tagId } = req.params;
  try {
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    res.json(updatedTag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { addTag, getTags, upvoteTag };
