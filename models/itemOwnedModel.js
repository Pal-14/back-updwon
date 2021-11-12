const mongoose = require("mongoose");

const itemOwnedSchema = mongoose.Schema({
    
    itemOwnedStatus :{
      itemIsPublished:Boolean, /* STARTS WITH FALSE THEN ADMIN CAN SET TO TRUE  */
      tokenOwnerList:[],
      
    },

    itemCurrentYearPerformance :{
        expenses:Number,
        income:Number
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
        garage:Number,
        parking:Boolean,
        parking:Number,
        swimmingPool:Boolean,
        otherSpecialPerks:String,

        itemPicturesFromUser: [],/*  PICTURES THAT WERE ORIGINALLY UPLOADED BY USER WHO MADE THE PROPOSAL */
        itemPicturesSelectedByAdmin:[],

        itemProposalId:String,
        itemFundingId:String
    },
})

const ItemOwnedModel = mongoose.model("users", itemOwnedSchema);
module.exports = UserModel;