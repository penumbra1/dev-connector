import express from "express";

// @route  GET api/profile/test
// @desc Tests the profile route
// @access Public
const router = express.Router();
router.get("/test", (req, res) => res.json({ message: "Profile route works" }));

export default router;
