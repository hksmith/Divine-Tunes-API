const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roles: {
    User: {
      type: String,
      default: 'user',
    },
    Admin:{
        type: String,
    },
  },
  password: {
    type: String,
    required: true,
  },
  favMusic: [
    {
      type: Schema.Types.ObjectId,
      ref: "Music",
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
