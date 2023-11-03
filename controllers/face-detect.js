const { calculateFaceBoundingBox } = require("../services/clarifai");

const faceDetect = (db) => async (req, res) => {
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
};

module.exports = { faceDetect };
