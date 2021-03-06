/*eslint-disable no-console*/
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import {
  logger,
  validationErrorHandler,
  clientErrorHandler,
  serverErrorHandler
} from "./errors";
import authenticator from "./auth";
import users from "./routes/api/users";
import profile from "./routes/api/profile";
import posts from "./routes/api/posts";

const db = process.env.MONGO_URI;
if (db) {
  mongoose
    .connect(db, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch(console.error);
} else console.error("Database URI not found");

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authenticator.initialize());

app.get("/", (req, res) => {
  res.send("Hey there!");
});

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

app.use(validationErrorHandler);
app.use(clientErrorHandler);
app.use(logger);
app.use(serverErrorHandler);

const { PORT, IS_NOW } = process.env;

if (!IS_NOW) {
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

export default app;
