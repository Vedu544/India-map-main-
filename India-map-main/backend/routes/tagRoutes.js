// routes/tagsRoutes.js
import express from "express";
const router = express.Router();
import { addTag, getTags, upvoteTag } from "../controllers/tagsController.js";

router.post('/', addTag);
router.get('/:stateCode', getTags);
router.put('/upvote/:tagId', upvoteTag);

export default router
