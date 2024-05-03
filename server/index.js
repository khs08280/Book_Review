import express from "express";
import router from "./src/routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import db from "./db.js";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// saveScrapedData();
app.use("/api", router);

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
