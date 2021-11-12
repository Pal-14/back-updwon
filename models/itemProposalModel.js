const mongoose = require("mongoose");

const itemProposalSchema = mongoose.Schema({
    
    itemProposalStatus :{
      itemUpForReviewByAdmin:Boolean,
      itemDateOfSubmitByUser:String,
      itemIsAcceptedForFunding:Boolean,  
      itemIsRejectedForFunding:Boolean, 
      askedPriceByUser:Number,
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
        itemDocumentsFromUser:[], /* PAS NECCESSAIRE POUR LE MOMENT, REFERS TO PROPERTY AND OWNERSHIP DOCUMENTS FOR EXAMPLE*/
    },
    itemUserInfos:{
        userId:String, 
        userFirstName:String, 
        userLastName:String, 
        userEmail: String, 
        userVerifiedStatus:Boolean,
    },

     
    
})

const ItemProposalModel = mongoose.model("users", itemSchema);
module.exports = UserModel;