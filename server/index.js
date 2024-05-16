import express from "express";
import router from "./src/routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import db from "./db.js";
import morgan from "morgan";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";
import passportConfig from "./src/passport/index.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
passportConfig();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
if (process.env.NODE_ENV === "production") {
  app.use(helmet({ contentSecurityPolicy: false }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://alsdnr122014:${process.env.MONGO_PASSWORD}@cluster0.pgdn31n.mongodb.net/project`,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Express server is listening on port ${process.env.SERVER_PORT}`);
});
