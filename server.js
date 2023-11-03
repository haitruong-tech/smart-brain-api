require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "quyhaitruong",
    database: "smart-brain",
    // connectionString: config.DATABASE_URL,
    // password: config["DB_PASSWORD"],
    // ssl: config["DB_SSL"] ? { rejectUnauthorized: false } : false,
  },
});

const { calculateFaceBoundingBox } = require("./services/clarifai");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  res.json(await db.select("*").from("users"));
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.select("*").from("users").where("email", email);
  if (user[0] == null) {
    return res.status(400).json("Error Logging In");
  }
  const hash = await db.select("hash").from("login").where("email", email);
  const validPassword = await bcrypt.compare(password, hash[0]?.hash ?? "");
  if (validPassword) {
    res.json(user[0]);
  } else {
    res.status(400).json("Error Logging In");
  }
});

app.post("/register", async (req, res) => {
  db.transaction(async (trx) => {
    try {
      const { name, email, password } = req.body;
      await trx
        .insert({
          hash: await bcrypt.hash(password, 10),
          email,
        })
        .into("login");
      const newUser = await trx
        .returning("*")
        .insert({
          name,
          email,
        })
        .into("users");
      res.json(newUser[0]);
    } catch (error) {
      console.error(error);
      res.status(400).json("Unable to register");
    }
  });
});

app.get("/profile/:id", async (req, res) => {
  const { id } = req.params;
  const user = await db.select("*").from("users").where("id", id);
  if (user[0]) return res.json(user[0]);
  res.status(404).json("No such user");
});

app.post("/image/face-detect", async (req, res) => {
  try {
    const { userID, imageURL } = req.body;
    const result = await db
      .where("id", userID)
      .increment({ entries: 1 })
      .into("users")
      .returning("entries");
    const boundingBoxes = await calculateFaceBoundingBox(imageURL);
    res.json({ entries: result[0].entries, boundingBoxes });
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});

/*
/ --> res
/signin --> email + password --> POST = success/fail
/register --> name + email + password -> POST = user
/profile/:userID --> GET = user
/image/face-detect --> PUT = user
*/
