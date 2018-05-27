var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email:String,
  username: {type: String, unique: true},
  password: {type: String},
  postalCode: String,
  lat: Number,
  lng: Number,
  breed: String
});

var User = mongoose.model ("users", userSchema);
module.exports = User;
