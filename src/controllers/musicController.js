const Music = require("../models/music");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

const getAllMusic = async (req, res, next) => {
  try {
    const musics = await Music.find();

    if (!musics) {
      return res.status(404).json({ message: "No music found" });
    }
    return res.status(200).json({ musics });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching music" });
  }
};

const getMusic = async (req, res, next) => {
  const id = req.params.id;

  try {
    const music = await Music.findById(id);

    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }
    return res.status(200).json({ music });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching music" });
  }
};

const addMusic = async (req, res, next) => {
  const { title, artist, album, duration, genre } = req.body;
  const files = req.files;

  const image = files["image"][0];
  const audio = files["audio"][0];

  try {
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        image.path,
        {
          timeout: 60000,
          folder: "image",
        },
        (error, result) => {
          if (error) {
            // Handle the error and reject the promise
            reject(new Error("Failed to upload image"));
          } else {
            // The upload was successful, resolve the promise with the result
            resolve(result);
          }
        }
      );
    });

    const audioResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        audio.path,
        {
          timeout: 60000,
          folder: "Musics",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            // Handle the error and reject the promise
            reject(new Error("Failed to upload music file"));
          } else {
            // The upload was successful, resolve the promise with the result
            resolve(result);
          }
        }
      );
    });

    const music = new Music({
      title,
      artist,
      album,
      duration,
      genre,
      image: imageResult.secure_url,
      image_cloudinary_id: imageResult.public_id,
      audio: audioResult.secure_url,
      audio_cloudinary_id: audioResult.public_id,
    });

    await music.save();

    fs.unlinkSync(image.path);
    fs.unlinkSync(audio.path);

    if (!music) {
      return res.status(500).json({ message: "Music could not be added" });
    }
    return res.status(201).json({ message: "Music info successfully added" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the music" });
  }
};

const updateMusic = async (req, res, next) => {
  const { title, artist, album, duration, genre } = req.body;
  const files = req.files;

  const image = files["image"][0];
  const audio = files["audio"][0];

  try {
    const music = await Music.findById(req.params.id);

    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    // Delete the previous image and audio from Cloudinary
    await cloudinary.uploader.destroy(music.image_cloudinary_id);
    await cloudinary.uploader.destroy(music.audio_cloudinary_id, {
      type: "upload",
      resource_type: "raw",
    });

    // Upload the new image and audio to Cloudinary
    const imageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        image.path,
        {
          timeout: 60000,
          folder: "image",
        },
        (error, result) => {
          if (error) {
            reject(new Error("Failed to upload image"));
          } else {
            resolve(result);
          }
        }
      );
    });

    const audioResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        audio.path,
        {
          timeout: 60000,
          folder: "Musics",
          resource_type: "raw",
        },
        (error, result) => {
          if (error) {
            reject(new Error("Failed to upload music file"));
          } else {
            resolve(result);
          }
        }
      );
    });

    // Update the music object with the new data
    music.title = title;
    music.artist = artist;
    music.album = album;
    music.duration = duration;
    music.genre = genre;
    music.image = imageResult.secure_url;
    music.image_cloudinary_id = imageResult.public_id;
    music.audio = audioResult.secure_url;
    music.audio_cloudinary_id = audioResult.public_id;

    await music.save();

    fs.unlinkSync(image.path);
    fs.unlinkSync(audio.path);

    return res.status(200).json({ message: "Music info successfully updated" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the music" });
  }
};

const deleteMusic = async (req, res, next) => {
  try {
    const music = await Music.findById(req.params.id);

    if (!music) {
      return res.status(404).json({ message: "Music not found" });
    }

    // Delete the image and audio from Cloudinary
    await cloudinary.uploader.destroy(music.image_cloudinary_id);
    await cloudinary.uploader.destroy(music.audio_cloudinary_id, {
      type: "upload",
      resource_type: "raw",
    });

    // Delete the music entry from the database
    await Music.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Music deleted successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the music" });
  }
};

exports.getAllMusic = getAllMusic;
exports.getMusic = getMusic;
exports.addMusic = addMusic;
exports.updateMusic = updateMusic;
exports.deleteMusic = deleteMusic;
