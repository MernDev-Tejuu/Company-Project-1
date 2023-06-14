const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const blog_Schema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  authorId: { type: ObjectId, required: true, ref: "author" },
  tags: { type: [String] },
  category: { type: String, required: true },
  subcategory: { type: [String] },
  deletedAt: { type: Date },
  isDeleted: { type:Boolean, default: false },
  publishedAt: { type: Date },
  isPublished: {type: Boolean, default: false },
});

module.exports = mongoose.model("blogs", blog_Schema);
