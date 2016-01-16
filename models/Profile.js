var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema({
    username: String,
    country: String,
    fullname: String,
    state: String
});

mongoose.model("Profile", ProfileSchema);