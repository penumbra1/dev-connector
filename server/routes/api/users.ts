import express from "express";
import UserModel from "../../models/User";

const router = express.Router();

// @route  GET api/users/test
// @desc Tests the users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users route works" }));

// @route  GET api/users/register
// @desc Regsiters the user
// @access Public
router.post("/register", (req, res, next) => {
  UserModel.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // 409 Conflict
      // Note: user enumeration vulnerability
      // https://stackoverflow.com/questions/9269040
      return res.status(409).json({ message: "E-mail already registered" });
    } else {
      const { name, email, password } = req.body;
      const newUser = new UserModel({ name, email, password });
      newUser
        .save()
        .then(({ name, email, avatar }) =>
          res.status(200).json({ name, email, avatar })
        )
        .catch(e => next(e));
    }
  });
});

export default router;
