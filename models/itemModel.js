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
        plotArea:Number,
        
    },
    funding:{
        initialStableData:{
        priceInEuros:Number,
        initialTokenAmount:Number,
        initialTokenValueInEuros:Number,
        
        remainingAvailableToken:Number,

        fundingStartDate:String, 
        fundingEndDeadlineDate:String,
        fundingGoalReachedDate:String, 
        }
    }

})