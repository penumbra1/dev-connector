import express from "express";
import authenticator from "../../auth";
import sanitize from "mongo-sanitize";
import ProfileModel from "../../models/Profile";
import { ClientError } from "../../errors";

const router = express.Router();

// @route GET api/profile/test
// @desc Tests the profile route
// @access Public
router.get("/test", (req, res) => res.json({ message: "Profile route works" }));

// @route GET api/profile
// @desc Shows the current user profile
// @access Private
router.get("/", authenticator.jwt, (req, res, next) => {
  ProfileModel.findOne({ user: req.user }).then(profile => {
    if (!profile) {
      return next(new ClientError("Profile not found"));
    }
    console.log(profile);
    res.send(profile);
  });
});

// @route POST api/profile/test
// @desc Creates or updates a profile for current user
// @access Private
router.post("/", authenticator.jwt, async (req, res, next) => {
  try {
    const profileData = sanitize(req.body);
    profileData.user = req.user;
    // const {
    //   bio,
    //   company,
    //   github,
    //   handle,
    //   location,
    //   skills,
    //   social,
    //   status,
    //   website
    // } = sanitize(req.body);

    let profile = await ProfileModel.findOne({ user: req.user });
    if (profile) {
      console.log("Updating");
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = new ProfileModel(profileData);
    }
    res.json(profile);
  } catch (e) {
    next(e);
  }
});

export default router;
