import express from "express";
import mongoose from "mongoose";
import users from "./routes/api/users";
import profile from "./routes/api/profile";
import posts from "./routes/api/posts";

import UserModel from "./models/User";

const app = express();
const db = process.env.MONGO_URI;

if (db) {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(e => console.error(e));
} else throw Error("No database URI in process.env!");

app.get("/", (req, res) => {
  res.send("Hey there!");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening on port ${port}`));

// (async () => {
//   const u = new UserModel({
//     name: "O",
//     email: "e",
//     avatar: "a",
//     password: "p"
//   });
//   u.save();
//   console.log(await UserModel.findOne());
// })();
