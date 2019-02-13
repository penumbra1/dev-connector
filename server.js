const express = require("express");
const mongoose = require("mongoose");

const app = express();
const db = process.env.MONGO_URI;

app.get("/", (req, res) => {
  res.send("Hi there!");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
