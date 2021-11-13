const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const ItemFundingModel = require('../models/itemFundingModel')
const bcrypt = require("bcrypt");
const SALTS = 10;
const path = require("path");

function handleServerError(err, res) {
  console.log(err);
  return res.sendStatus(500);
}

const JWT_SECRET = process.env.JWT_SECRET;

const ItemFundingController = {
  /* BONUS MIDDLEWARES IF NEED TO LOG BODY OR WANT TO TRY ADMIN SYSTEM */
  logBody(req, res, next) {
    console.log(req.body);
    next();
  },

  /* MIDDLEWARE TO CHECK IF USER CAN ACCESS PRIVATE ROUTES */

  getInfos(req, res, next) {
    return res
      .status(200)
      .send({ success: true, message: "Info utilisateur", data: req.user });
  },

  testPrivateController(req, res, next) {
    console.log(`USER FIRST NAME IS : ${req.user.firstName}`);
    console.log(`NEW FILE NAME IS :${req.nameOfUploadedFile} `);
    return res.send({ success: true, message: "allgood with controller" });
  },

  /* ************* PUBLIC ROUTES **************** */

  uploadDocument(res, req, next) {
    upload(req, res, (err) => {
      if (err) {
        res.sendStatus(400);
      } else {
        console.log(req.file);
        res.send({
          success: true,
          message: `Envoi du fichier : OK`,
          log: `file log ${req.file}`,
        });
      }
    });
  },

  stockDocumentItems(req, res, next) {
    const myArray = req.myArray;
    let {targetItemFundingId} = req.body;
    console.log(myArray);
    if (!myArray) {
      return res
        .status(400)
        .send({ success: false, message: "Champs néccessaires non indiqués" });
    }
    return ItemFundingModel.updateOne(
      { _id: targetItemFundingId },
      {
        $push: {
          "itemInfos.itemPicturesFromUser": myArray,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message:
            "Ok vos documents ont bien été envoyés. L'équipe d'UpDownStreet vérifiera vos documents sous 48h.",
        });
      })
      .catch(() => {
        res.status(400).send({
          success: false,
          message: "Erreur",
          debug: `${req.user._id}`,
        });
      });
  },


/* 
PRIVATE ROUTES  */

createFunding(req, res, next) {
  let {
    name,
    adress, 
    city, 
    postalCode, 
    description,
    typeOfItem, 
    livingArea, 
    rooms, 
    bedrooms, 
    terrace, 
    terraceSurface, 
    garage, 
    garageNumber,
    parking, 
    parkingNumber,
    swimmingPool, 
    otherSpecialPerks,
    itemPicturesFromUser,

    askedPriceByUser,
    initialTokenAmount,
    fundingStartDate,
    fundingEndDeadlineDate,/*  RAJOUTER EN FRONT */

    /* KEYS FOR DEV, WILL BE REMOVED */
    isPublic,

  } = req.body;
  if (
    !name ||
    !adress ||
    !city ||
    !postalCode ||
    !description ||
    !typeOfItem /* ||
    !livingArea ||
    !rooms ||
    !bedrooms ||
    !terrace ||
    !terraceSurface ||
    !garage ||
    !garageNumber ||
    !parking ||
    !parkingNumber ||
    !swimmingPool ||
    !otherSpecialPerks ||
    !itemPicturesFromUser ||
    !askedPriceByUser ||
    !initialTokenAmount  */
    ){
    return res.status(400).send({
      success:false,
      message:"Les champs obligatoires ne sont pas tous remplis"
    });
  }
    return ItemFundingModel.create({
      isPublic: !isPublic ? false : isPublic,
      itemFundingStatus : {
        isUpForReviewByAdmin:true,
        isPublished:false,
        isCurrentlyBeingFunded:false,
        hasReachedFundingGoal:false,

        initialData:{
            priceInEuros:askedPriceByUser,
            initialTokenAmount:1000,
            initialSingleTokenValueInEuros: 25/* arseInt(askedPriceByUser/initialTokenAmount) */,
            
            fundingStartDate:!fundingStartDate ? "12/01/2021": fundingStartDate,
            fundingEndDeadlineDate:!fundingEndDeadlineDate ? "12/03/2021": fundingEndDeadlineDate,
            fundingGoalReachedDate:"", 
        },
        fundingProgressData:{
            remainingAvailableToken:1000,
            numberOfTokenSold:0,
            tokenBuyOrders:[/* {userID:String, tokenAmount:Number, transactionId:String} */],
            remainingTime:"",
        },
      },

    itemInfos: {
        name:name, 
        adress:adress,
        city:city,
        postalCode:postalCode,
        description:description,

        typeOfItem:typeOfItem,
        livingArea:livingArea,
        rooms:rooms,
        bedrooms:bedrooms,

        terrace:terrace,
        terraceSurface:terraceSurface,
        garage:garage,
        garageNumber:!garageNumber ? 0 : garageNumber,
        parking:parking,
        parkingNumber:!parkingNumber ? 0 : parkingNumber,
        swimmingPool:swimmingPool,

        otherSpecialPerks:!otherSpecialPerks ? "": otherSpecialPerks,

        itemPicturesFromUser: [],
        itemPicturesSelectedByAdmin:[],

        itemProposalId:"",
    }

  })
  .then((newFundingItem) => {
    res
      .status(200)
      .send({
        success: true,
        message: `Votre proposition, Monsieur ou Madame ${req.user.lastName} à bien été soumise à l'équipe d'UpDownStreet. Elle porte l'ID ${newFundingItem._id}`,
        itemFundingId:`${newFundingItem._id}`
      });
  })
  .catch((err)=>{
    res
      .status(400)
      .send({
        success: false,
        message: "Erreur lors de la soumission de votre proposition.",
        log:`LOG ERR : ${err}`
      })
  })

}
};


module.exports = ItemFundingController;
