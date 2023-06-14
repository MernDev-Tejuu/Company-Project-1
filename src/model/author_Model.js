const mongoose = require("mongoose");

const author_Schema = new mongoose.Schema({
  fname: { required: true, type: String },
  lname: { required: true, type: String },
  title: { required: true, type: String, enum: ["Mr", "Mrs", "Miss"] },
  email: { required: true, type: String, unique: true },
  password: { required: true, type: String },
});

module.exports = mongoose.model('author',author_Schema)