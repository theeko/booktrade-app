var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
  purposer: String,
  purposedTo: String,
  purposerBookId: String,
  purposedBookId: String,
  purposerBook: String,
  purposedBook: String,
  messageTxt: String
});

mongoose.model("Messages", MessageSchema);