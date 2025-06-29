const mongoose = require("mongoose");
const lectureSchema = new mongoose.Schema({
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: { type: String },
    publicId: { type: String },
    isPreviewFree: { type: Boolean },
  },{timestamps:true});

const LectureModel = mongoose.model("lecture", lectureSchema);
module.exports = UserModel;
