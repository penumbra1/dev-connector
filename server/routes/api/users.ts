import express from "express";
import sanitize from "mongo-sanitize";
import jwt from "jsonwebtoken";
import UserModel from "../../models/User";
import { ClientError } from "../../errorHandler";
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
    return next(new ClientError("E-mail already registered.", 409));
  }

  const newUser = new UserModel({ name, email, avatar, password });
  try {
    await newUser.save();
    res.status(200).json({ name, email, avatar });
  } catch (e) {
    if (e.name !== "ValidationError") {
      next(e);
    }
    const errorKeys = Object.keys(e.errors);
    const requiredKeys = errorKeys.filter(
      key => e.errors[key].kind === "required"
    );
    if (requiredKeys.length > 0) {
      const message =
        "Please provide your " +
        requiredKeys.join(", ").replace(/, ([^,]*)$/, " and $1");
      return next(new ClientError(message, 422));
    }

    const invalidMessages = errorKeys
      .filter(key => e.errors[key].kind !== "required")
      .map(key => e.errors[key].message);
    if (invalidMessages) {
      const message = invalidMessages.join(" ");
      return next(new ClientError(message, 422));
    }
  }
});

// @route  GET api/users/login
// @desc Logs the user in, returns a JWT
// @access Public
router.post("/login", authenticator.local, async (req, res, next) => {
  const payload = { sub: req.user };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
  res.status(200).json({ token });
});

export default router;
