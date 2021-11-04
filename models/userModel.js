const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName:String,
  email: String,
  password: String,
  stableCoins: Number,

  infos: {
    phoneNumber: String,
    //nationality:String,
    dateOfBirth:String,
    adress:String,
    //streetNumber:String,
    //streetName:String,
    city:String, 
    postalCode:String,
    country:String,
    isAdmin:Boolean,
    isVerified:String,
  },
  ownedItems: [{ itemId: String, tokenQuantity: Number, purchaseDate: String }],
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
