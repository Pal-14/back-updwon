const mongoose = require("mongoose");

const itemFundingSchema = mongoose.Schema({
    
    itemPrivateData :{
        status:{
        isPublic:Boolean,
        fundingGoalHasBeenReached: Boolean,
        fundingOfItemIsInProgress: Boolean,
        submitedByUser:Boolean,
        submitedByAdmin:Boolean, 
        isUpForReviewByAdmin: Boolean,
        },
        
        informations:{
        askedPriceByUser:Number,
        submitedByUserWithId:String,
        submitedByUserFirstAndLastName:String,
        dateOfSubmitByUser:String,
        priceSetByUpDownStreet:Number,
        legalDocuments:[],
        },

        tokenData:{
        tokenBuyOrdersDuringFunding:[],
        historyOfTokenBuyOrdersDuringFunding:[],
        activeTokenBuyOrders:[],
        historyOfActiveTokenBuyOrders:[],
        activeTokenSellOffers:[],
        historyOfActiveTokenSellOffers:[],
        historyOfCompletedTokenTransactions:[],
        },
        
        management:{
        numberOfDecisionsPendingApproval:Number,
        currentYearBalance:Number,
        isRented: Boolean,
        }
    },    

    itemPublicData: {
        description:{
        name: String, 
        adress:String,
        city:String,
        postalCode:String,
        prettyPrint:String,

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
        isCurrentlyRented:Boolean,
        expectedYearlyIncome:Number,
        },

        funding:{
        priceInEuros:Number,
        initialTokenAmount:Number,
        initialSingleTokenValueInEuros:Number,
        remainingAvailableToken:Number,

        fundingStartDate:String, 
        fundingEndDeadlineDate:String,
        fundingGoalReachedDate:String, 
        },

        itemPicturesFromUser: [],
        itemPicturesSelectedByAdmin:[],
    },
})

const ItemFundingModel = mongoose.model("funding-items", itemFundingSchema);
module.exports = ItemFundingModel;