const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({});

const User = mongoose.modal("User", userSchema);
module.exports(User);
