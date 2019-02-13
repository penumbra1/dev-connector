import express from "express";
import mongoose from "mongoose";

const app = express();
const db = process.env.MONGO_URI;

mongoose.connect(db);

app.get("/", (req, res) => {
  res.send("Hey there!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
