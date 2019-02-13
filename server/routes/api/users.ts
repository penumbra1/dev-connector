import express from "express";

// @route  GET api/users/test
// @desc Tests the users route
// @access Public
const router = express.Router();
router.get("/test", (req, res) => res.json({ msg: "Users route works" }));

export default router;
