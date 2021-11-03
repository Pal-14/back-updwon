const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  info: {
    telephone: String,
    stableCoins: Number,
    adresse: String,
    ville: String,
    codePostal: String,
    dateOfBirth: String,
    finaliser: Boolean,
    admin: Boolean,
  },
  biens: [{ idBien: String, quantitieBien: Number, dateAchat: String }],
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
