const User = require("../models/user");
const Music = require("../models/music");

const getUserWithFavMusic = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).populate("favMusic");
    const { favMusic } = user;
    res.json(favMusic); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve user with favMusic" });
  }
};

const likeMusic = async (req, res, next) => {
  const id = req.params.id;
  const musicId = req.params.musicId;
  try {
    const user = await User.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const music = await Music.findById(musicId);

    if (!music) {
      throw new Error("Music not found");
    }

    user.favMusic.push(musicId);

    await user.save();

    return res.status(200).json({ message: "Music added to favorites" });
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ message: "Failed to add music to favorites" });
  }
};

const dislikeMusic = async (req, res, next) => {
  const id = req.params.id;
  const musicId = req.params.musicId;
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    // Find the index of the disliked music ID in the favMusic array
    const index = user.favMusic.indexOf(musicId);
    if (index !== -1) {
      user.favMusic.splice(index, 1);

      await user.save();
    }

    return res.status(200).json({ message: "Music removed from favorites" });
  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .json({ message: "Failed to dislike music" });
  }
};

module.exports = { getUserWithFavMusic, likeMusic, dislikeMusic };
