const signin = (db, bcrypt) => async (req, res) => {
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
};

module.exports = { signin };
