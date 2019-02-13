import express from "express";

// @route  GET api/posts/test
// @desc Tests the posts route
// @access Public
const router = express.Router();
router.get("/test", (req, res) => res.json({ msg: "Posts route works" }));

export default router;
