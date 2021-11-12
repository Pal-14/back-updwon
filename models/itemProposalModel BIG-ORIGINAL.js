const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    
    itemFundingStatus :{
      itemUpForReviewByAdmin:Boolean,
      itemDateOfSubmitByUser:String,
      itemIsAcceptedForFunding:Boolean,
      itemIsRejectedForFunding:Boolean,
      
    },

    itemProposalByUser : {
    itemInfos: {
        name: String, 
        adress:String,
        city:String,
        postalCode:String,
        description:String,/*  TXT AREA IF POSS */

        type:String,
        livingArea:Number,
        rooms:String,
        bedrooms:String,

        terrace:Boolean,
        terraceSurface:Number,
        garage:Boolean,
        garage:Number,
        parking:Boolean,
        parking:Number,
        swimmingPool:Boolean,
        
        otherSpecialPerks:String,
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
    },

    
    itemIsGoForFunding:{
        itemDescription:{
            itemPicturesSelectedByAdmin:[String],
            itemDescriptionByAdmin:[String],
        },
        
        funding:{
            initialData:{
                priceInEuros:Number,
                initialTokenAmount:Number,
                initialTokenValueInEuros:Number,
                
                fundingStartDate:String, 
                fundingEndDeadlineDate:String,
                fundingGoalReachedDate:String, 
            },
            fundingProgessData:{
                remainingAvailableToken:Number,
                tokenBuyOrders:[/* {userID:String, tokenAmount:Number, transactionId:String} */],
                remainingTime:Number,
            },
        },
    },

    itemHasBeenSuccessfullyFunded:{
        tokenOwnerList:[],
        
    }

})

const ItemModel = mongoose.model("users", itemSchema);
module.exports = UserModel;