const handleRegister = (db, bcrypt) => async (req, res) => {
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
};

module.exports = {
  handleRegister,
};
