import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import users from "./routes/api/users";
import profile from "./routes/api/profile";
import posts from "./routes/api/posts";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
