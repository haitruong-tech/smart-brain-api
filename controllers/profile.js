const getProfile = (db) => async (req, res) => {
  const { id } = req.params;
  const user = await db.select("*").from("users").where("id", id);
  if (user[0]) return res.json(user[0]);
  res.status(404).json("No such user");
};

module.exports = { getProfile };
