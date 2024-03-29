const mongoose = require("mongoose");
const ImageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      default: "",
      trim: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const movieModel = mongoose.model("images", ImageSchema);
module.exports = movieModel;
