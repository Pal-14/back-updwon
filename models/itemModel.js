const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({

    itemPrivateData :{
        status:{
        isPublic:Boolean,
        fundingGoalHasBeenReached: Boolean,
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
        historyOfActiveTokenBuyOrders:[],
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
        
        fundingOfItemIsInProgress: Boolean,
        fundingStartDate:String, 
        fundingEndDeadlineDate:String,
        fundingGoalReachedDate:String, 
    },
    
    tokenData:{
        activeTokenBuyOrders:[],
        activeTokenSellOffers:[],
    },

    itemPicturesFromUser: [],
    itemPicturesSelectedByAdmin:[],
    },
})

const ItemModel = mongoose.model("funding-items", itemSchema);
module.exports = ItemModel;