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
        plotArea:Number,
        
    },
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
    }

})


/* THIS ITEM MODEL IS BASED ON THE IDEA THAT :
WHEN AN ITEM IS UP FOR CROWDFUNDING, 
    A FINITE AMOUNT OF TOKENS ARE AVAILABLE FOR PURCHASE

    OPTION 1 :
    A TOKEN HAS THE SAME BASE VALUE eg 1 Token = 5k
    HOUSE IS WORTH 100k = 20 tokens AVAILABLE
    VILLA IS WORTH 30k = 6 tokens AVAILABLE


    OPTION 2 :
    A TOKEN HAS A BASE VALUE DEFINED BY THE PRICE OF ITEM BEING SOLD eg 1 token  = 1/100 ITEM PRICE
    HOUSE IS WORTH 100k = 100 tokens AVAILABLE each token worth 1k
    VILLA IS WORTH 30k = 100 tokens AVAILABLE each tkoen worth  0.3k 

PERSONNALY I LIKE OPTION ONE BETTER AS IT ALLOWS EASIER PERFORMANCE COMPARE AND TRADE
DOWNSIDE IS, THERE CAN BE A LOT OF TOKENS OR VERY LITTLE IF PRICE IS VERY HIGH OR VERY LOW.
 */