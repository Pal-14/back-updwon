const mongoose = require("mongoose");

const itemFundingSchema = mongoose.Schema({
    
    itemFundingStatus :{
        isUpForReviewByAdmin:Boolean,
        isPublished:Boolean,
        isCurrentlyBeingFunded:Boolean,
        hasReachedFundingGoal:Boolean,

        initialData:{
            priceInEuros:Number,
            initialTokenAmount:Number,
            initialSingleTokenValueInEuros:Number,
            
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
        garageNumber:Number,
        parking:Boolean,
        parkingNumber:Number,
        swimmingPool:Boolean,

        otherSpecialPerks:String,

        itemPicturesFromUser: [],
        itemPicturesSelectedByAdmin:[],

        itemProposalId:String,
    },
})

const ItemFundingModel = mongoose.model("users", itemFundingSchema);
module.exports = UserModel;