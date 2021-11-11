const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
   
    itemInfos: {
        name: String, 
        adress:String,
        city:String,
        description:String,

        type:String,
        livingArea:String,
        rooms:String,
        bedrooms:String,


        terraceSurface:Number,
        garage:Number,
        parking:Number,
        swimmingPool:Boolean,
    },
    itemUserInfos:{
        userId:String, 
        userFirstName:String, 
        userLastName:String, 
        userEmail: String, 
        userVerifiedStatus:Boolean,
    },

    itemPicturesFromUser: [],

    itemDocumentsFromUser:[],

    itemFundingStatus :{
      itemUpForReviewByAdmin:Boolean,
      itemDateOfSubmitByUser:String,
      itemIsAcceptedForFunding:Boolean,
      itemIsRejectedForFunding:Boolean,
      iteam
    },

    
    itemFundingAdminOnly:{
        initialData:{
            priceInEuros:Number,
            initialTokenAmount:Number,
            initialTokenValueInEuros:Number,
            
            remainingAvailableToken:Number,

            fundingStartDate:String, 
            fundingEndDeadlineDate:String,
            fundingGoalReachedDate:String, 
        },
        itemPicturesSelectedByAdmin:[string,],
    }
})

const ItemModel = mongoose.model("users", itemSchema);
module.exports = UserModel;