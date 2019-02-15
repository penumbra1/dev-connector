import express from "express";
import UserModel from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorWithStatus } from "../../errorHandler";

const router = express.Router();

// @route  GET api/users/test
// @desc Tests the users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users route works" }));

// @route  GET api/users/register
// @desc Regsiters the user
// @access Public
router.post("/register", async (req, res, next) => {
  let { name, email, avatar, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    // 409 Conflict
    // Note: user enumeration vulnerability
    // https://stackoverflow.com/questions/9269040
    return next(new ErrorWithStatus("E-mail already registered", 409));
  }

  try {
    const newUser = new UserModel({ name, email, avatar, password });
    ({ name, email, avatar } = await newUser.save());
  } catch (e) {
    return next(new ErrorWithStatus(e.message, 400));
  }

  res.status(200).json({ name, email, avatar });
});

// @route  GET api/users/login
// @desc Logs the user in, returns a JWT
// @access Public
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return next(new ErrorWithStatus("E-mail not registered", 404));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.set("WWW-Authenticate", "Bearer realm=Authentication Required");
    return next(new ErrorWithStatus("Incorrect credentials", 401));
  }

  const { id, name } = user;
  const payload = { id, name };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  res.status(200).json({ token });
});

export default router;
