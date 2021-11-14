const mongoose = require("mongoose");

const itemFundingSchema = mongoose.Schema({
    isPublic:Boolean,
    
    itemPrivateData :{
        isUpForReviewByAdmin:Boolean,
        isPublished:Boolean,
        isCurrentlyBeingFunded:Boolean,
        hasReachedFundingGoal:Boolean,

        submitedByUserWithId:String,
        submitedByUserFirstAndLastName:String,

        dateOfSubmitByUser:String,


        initialData:{
            priceInEuros:Number,
            initialTokenAmount:Number,
            initialSingleTokenValueInEuros: Number,
            
            fundingStartDate:String, 
            fundingEndDeadlineDate:String,
            fundingGoalReachedDate:String, 
        },

        fundingProgressData:{
            remainingAvailableToken:Number,
            tokenBuyOrders:[/* {userID:String, tokenAmount:Number, transactionId:String} */],
            remainingTime:String,
        },

        legalDocuments:[]
    },
    

    itemPublicData: {
        name: String, 
        adress:String,
        city:String,
        postalCode:String,
        description:String,/*  TXT AREA IF POSS */

        typeOfItem:String,
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
    },
})

const ItemFundingModel = mongoose.model("funding-items", itemFundingSchema);
module.exports = ItemFundingModel;