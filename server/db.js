import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://alsdnr122014:${password}@cluster0.pgdn31n.mongodb.net/project`;

mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to MongoDB");
});

export default db;
