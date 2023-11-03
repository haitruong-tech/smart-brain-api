require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("knex")({
  client: "pg",
  connection: {
    // host: "127.0.0.1",
    // port: 5432,
    // user: "quyhaitruong",
    // database: "smart-brain",
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL,
    // password: config["DB_PASSWORD"],
    // ssl: config["DB_SSL"] ? { rejectUnauthorized: false } : false,
  },
});

const { signin } = require("./controllers/signin");
const { handleRegister } = require("./controllers/register");

const { getProfile } = require("./controllers/profile");
const { faceDetect } = require("./controllers/face-detect");

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.ORIGIN
};

app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  res.json(await db.select("*").from("users"));
});
app.post("/signin", signin(db, bcrypt));
app.post("/register", handleRegister(db, bcrypt));
app.get("/profile/:id", getProfile(db));
app.post("/image/face-detect", faceDetect(db));

app.listen(process.env.PORT || 3000, () => {
  console.log("App is running on port 3000");
});
