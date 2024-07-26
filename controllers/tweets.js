const path = require("path");
const sharp = require("sharp");
const {
  createTweet,
  getAllTweets,
  getSingleTweet,
  deleteTweetById,
} = require("../db/tweets");
const { generateError, createPathIfNotExists } = require("../helpers");

const getTweetsController = async (req, res, next) => {
  try {
    const tweets = await getAllTweets();

    res.send({
      status: "ok",
      data: tweets,
    });
  } catch (error) {
    next(error);
  }
};

const newTweetController = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.length > 280) {
      throw generateError("Invalid tweet", 400);
    }

    let imageFileName;
    if (req.files && req.files.image) {
      const uploadsDir = path.join(__dirname, "../uploads");
      await createPathIfNotExists(uploadsDir);
      const image = sharp(req.files.image.data);
      image.resize(1000);
      const { nanoid } = await import("nanoid");
      imageFileName = `${nanoid()}.jpg`;
      image.toFile(path.join(uploadsDir, imageFileName));
    }
    const id = await createTweet(req.userId, text, imageFileName);
    res.send({
      status: "ok",
      message: `Tweet created with id: ${id} created successfully`,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleTweetController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await getSingleTweet(id);

    res.send({
      status: "ok",
      data: tweet,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTweetController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tweet = await getSingleTweet(id);
    if (tweet.user_id !== req.userId) {
      throw generateError("You can't delete this tweet", 401);
    } else {
      await deleteTweetById(id);
    }

    res.send({
      status: "ok",
      message: "Tweet deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTweetsController,
  newTweetController,
  getSingleTweetController,
  deleteTweetController,
};
