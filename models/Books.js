var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
  title: String,
  imgurl: String,
  desc: String,
  owner: String,
  tradeTo: [String]
});

mongoose.model("Book", ImageSchema);