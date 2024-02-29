const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  image_cloudinary_id: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
  audio_cloudinary_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Music', musicSchema);
