import express from "express";
import authenticator from "../../auth";
import ProfileModel from "../../models/Profile";
import { ClientError } from "../../errors";

const router = express.Router();

// @route  GET api/profile/test
// @desc Tests the profile route
// @access Public
router.get("/test", (req, res) => res.json({ message: "Profile route works" }));

// @route  GET api/profile
// @desc Shows the current user profile
// @access Private
router.get("/", authenticator.jwt, (req, res, next) => {
  ProfileModel.findOne({ user: req.user.id }).then(profile => {
    if (!profile) {
      return next(new ClientError("Profile not found"));
    }
    console.log(profile);
    res.send(profile);
  });
});

export default router;
