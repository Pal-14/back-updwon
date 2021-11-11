const { compare } = require("bcrypt");
const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    name: String, 
    itemInfos: {
        adress:String,
        city:String,
        type:String,
        livingArea:String,
        rooms:String,
        bedrooms:String,
        terraceSurface:Number,
        garage:Number,
        parking:Number,
    },
    itemPicturesFromUser: [],
    funding:{
        initialData:{
            priceInEuros:Number,
            initialTokenAmount:Number,
            initialTokenValueInEuros:Number,
            
            remainingAvailableToken:Number,

            fundingStartDate:String, 
            fundingEndDeadlineDate:String,
            fundingGoalReachedDate:String, 
        }
        itemPictures
    }

})

const ItemModel = mongoose.model("users", itemSchema);
module.exports = UserModel;