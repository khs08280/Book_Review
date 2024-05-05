import express from "express";
import router from "./src/routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import db from "./db.js";
import compression from "compression";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();
const app = express();
const port = process.env.SERVER_PORT;

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
app.use(cookieParser());
app.use(compression());
// saveScrapedData();
app.use("/api", router);

app.listen(port, () => {
  console.log(`Express server is listening on port ${port}`);
});
