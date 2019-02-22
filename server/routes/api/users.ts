/* eslint-disable security/detect-object-injection */
// See https://github.com/nodesecurity/eslint-plugin-security/issues/21

import express from "express";
import sanitize from "mongo-sanitize";
import jwt from "jsonwebtoken";
import UserModel from "../../models/User";
import { ClientError } from "../../errors";
import authenticator from "../../auth";

const router = express.Router();

// @route  GET api/users/test
// @desc Tests the users route
// @access Public
router.get("/test", (req, res) => res.json({ message: "Users route works" }));

// @route  GET api/users/register
// @desc Regsiters the user
// @access Public
router.post("/register", async (req, res, next) => {
  try {
    let { name, email, avatar, password } = req.body;
    ({ name, email, avatar, password } = sanitize({
      name,
      email,
      avatar,
      password
    }));

    const user = await UserModel.findOne({ email });
    if (user) {
      // 409 Conflict
      // Note: user enumeration vulnerability
      // https://stackoverflow.com/questions/9269040
      return next(
        new ClientError({ email: "E-mail already registered." }, 409)
      );
    }

    const newUser = new UserModel({ name, email, avatar, password });
    await newUser.save();
    res.status(200).json({ name, email, avatar });
  } catch (e) {
    next(e);
  }
});

// @route  GET api/users/login
// @desc Logs the user in, returns a JWT
// @access Public
router.post("/login", authenticator.local, async (req, res, next) => {
  const payload = { sub: req.user };
  const secret = process.env.JWT_SECRET;
  if (secret) {
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    res.status(200).json({ token });
  } else {
    next(new Error("JWT secret not found."));
  }
});

export default router;
