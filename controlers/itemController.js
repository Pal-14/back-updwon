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

  stockDocument(req, res, next) {
    const myArray = req.myArray;
    const fileName = req.nameOfUploadedFile;
    const fileUrl = `http://localhost:5000/get-public-pic/${fileName}`;
    console.log(myArray);
    if (!fileName || !fileUrl) {
      return res
        .status(400)
        .send({ success: false, message: "Champs néccessaires non indiqués" });
    }
    return UserModel.updateOne(
      { _id: req._id },
      {
        $push: {
          "documents.documentsUrl": myArray,
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
};

/* 
PRIVATE ROUTES  */

createFunding(req, res, next) {
  let {
    name,
    adress, 
    city, 
    postalCode, 
    description,
    type, 
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

  } = req.body;
  if (  !)
}













module.exports = ItemFundingController;
