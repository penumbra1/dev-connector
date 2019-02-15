import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import errorHandler from "./errorHandler";
import users from "./routes/api/users";
import profile from "./routes/api/profile";
import posts from "./routes/api/posts";

const db = process.env.MONGO_URI;
if (db) {
  mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(console.error);
} else console.error("Database URI not found");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hey there!");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.use(errorHandler);

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
