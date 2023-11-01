require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { calculateFaceBoundingBox } = require("./services/clarifai");

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.json(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (
    email === database.users[0].email &&
    password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error Logging in");
  }
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    id: "125",
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  };
  database.users.push(newUser);
  res.json({
    id: newUser.id,
    name,
    email,
    entries: newUser.entries,
    joined: newUser.joined,
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.find((user) => user.id === id);
  if (user) return res.json(user);
  res.status(404).json("No such user");
});

app.post("/image/face-detect", async (req, res) => {
  const { userID, imageURL } = req.body;
  const user = database.users.find((user) => user.id === userID);
  const boundingBoxes = await calculateFaceBoundingBox(imageURL);
  if (user) {
    user.entries++;
    return res.json({ entries: user.entries, boundingBoxes });
  }
  res.status(404).json("No such user");
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
