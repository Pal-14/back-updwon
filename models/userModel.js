const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: String,
  email: String,
  password: String,
  stableCoin: Number,

  infos: {
    isVerifiedByAdmin: Boolean,
    hasProvidedAllDocuments: Boolean,
    isAdmin:Boolean,
    isVerified:String,
    phoneNumber: String,
    dateOfBirth:String,

    adress:String,
    city:String, 
    postalCode:String,
    country:String,
    //nationality:String,
    //streetNumber:String,
    //streetName:String,
  },
  ownedItems: [{ itemId: String, tokenQuantity: Number, purchaseDate: String }],
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
