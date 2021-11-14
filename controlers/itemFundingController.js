const ItemFundingModel = require("../models/itemFundingModel");

function handleServerError(err, res) {
  console.log(err);
  return res.sendStatus(500);
}
/* *********************************************************************************** */
/* ********* ********** ***** * ITEMS CONTROLLERS SUMMARY * ***** ********** ********* */
/* *********************************************************************************** */

/* 
I.PUBLIC CONTROLLERS
  A. GET PUBLIC FUNDING ITEM LIST

II.PRIVATE USER CONTROLLERS
  A. CREATE FUNDING ITEM BY USER


III. PRIVATE ADMIN CONTROLLERS
*/

/* ************************************************************************** */
/* ********* ********** PART I : PUBLIC USER CONTROLLERS ********** ********* */
/* ************************************************************************** */

/* I // ********* PUBLIC CONTROLLERS ********** */
/* A // GET PUBLIC FUNDING ITEM LIST ********** */

const ItemFundingController = {
  getPublicFundingItemList(req, res, next) {
    return ItemFundingModel.find({ isPublic: true })
      .select("-itemPrivateData")
      .then((response) => {
        res.send(response);
      });
  },

  /* ************************************************************************** */
  /* ********* ********* PART II : PRIVATE USER CONTROLLERS ********* ********* */
  /* ************************************************************************** */

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* A // CREATE FUNDING ITEM BY USER  ********* */

  createFundingItemByUser(req, res, next) {
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

      askedPriceByUser,
      initialTokenAmount,
      fundingStartDate,
      fundingEndDeadlineDate /*  RAJOUTER EN FRONT */,


      messageFromUser,
      isCurrentlyRented, /* BOOLEAN */
      expectedYearlyIncome,

      
      /* KEYS FOR DEV, WILL BE REMOVED */
      isPublic,
    } = req.body;
    if (
      !name /* ||
      !adress ||
      !city ||
      !postalCode ||
      !description ||
      !typeOfItem  ||
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
    ) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis",
      });
    }
    return ItemFundingModel.create({
          itemPrivateData :{
            status:{
            isPublic: !isPublic ? false : isPublic,
            fundingGoalHasBeenReached: false,
            fundingOfItemIsInProgress: false,
            submitedByUser:true,
            submitedByAdmin:false, 
            isUpForReviewByAdmin: true,
            },
            
            informations:{
            askedPriceByUser:askedPriceByUser,
            submitedByUserWithId:req._id,
            submitedByUserFirstAndLastName:`${req.user.firstName} ${req.user.lastName}`,
            dateOfSubmitByUser:Date.now(),
            messageFromUser: !messageFromUser ? "" : messageFromUser,
            priceSetByUpDownStreet:0,
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
            numberOfDecisionsPendingApproval:0,
            currentYearBalance:0,
            isCurrentlyRented: !isCurrentlyRented ? false : isCurrentlyRented,
            }
        },    

        itemPublicData: {
            description:{
            name: name, 
            adress:adress,
            city:city,
            postalCode:postalCode,
            prettyPrint:description,

            typeOfItem:typeOfItem,
            livingArea:livingArea,
            rooms:rooms,
            bedrooms:bedrooms,

            terrace:terrace,
            terraceSurface:terraceSurface,
            garage:garage,
            garageNumber:garageNumber,
            parking:parking,
            parkingNumber:parkingNumber,
            swimmingPool:swimmingPool,

            otherSpecialPerks:otherSpecialPerks,
            isCurrentlyRented: !isCurrentlyRented ? false : isCurrentlyRented,
            expectedYearlyIncome: !expectedYearlyIncome ? 0 : expectedYearlyIncome,
            },

            funding:{
            initialTokenAmount:0,
            initialSingleTokenValueInEuros:0,
            remainingAvailableToken:0,

            priceInEuros:0,
            fundingStartDate:"",
            fundingEndDeadlineDate:"",

            fundingStartDate:"", 
            fundingEndDeadlineDate:"",
            remainingTimeBeforeDeadline:"",
            fundingGoalReachedDate:"", 
            },

            itemPicturesFromUser: [],
            itemPicturesSelectedByAdmin:[],
        },
    })
      .then((newFundingItem) => {
        res.status(200).send({
          success: true,
          message: `Votre proposition, Monsieur ou Madame ${req.user.lastName} à bien été soumise à l'équipe d'UpDownStreet. Elle porte l'ID ${newFundingItem._id}`,
          itemFundingId: `${newFundingItem._id}`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur lors de la soumission de votre proposition.",
          log: `LOG ERR : ${err}`,
        });
      });
  },



  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* B // STOCK PUBLIC DOCUMENT OF FUNDING ITEM  */

  stockPublicDocumentOfFundingItem(req, res, next) {
    const myArray = req.myArray;
    let { targetItemFundingId } = req.body;
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
          "itemPublicData.itemPicturesFromUser": myArray,
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

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* C // STOCK PRIVATE DOCUMENT OF FUNDING ITEM */

  stockPrivateDocumentOfFundingItem(req, res, next) {
    const myArray = req.myArray;
    let { targetItemFundingId } = req.body;
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
          "itemPrivateData.informations.legalDocuments": myArray,
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

  /* ************************************************************************** */
  /* ********* ******** PART III : PRIVATE ADMIN CONTROLLERS ******** ********* */
  /* ************************************************************************** */

  /* III // ******* PRIVATE ADMIN CONTROLLERS ** */
  /* A // GET COMPLETE FUNDING ITEM BY ADMIN *** */
  getCompleteFundingItemListForAdmin(req, res, next) {
    return ItemFundingModel.find({}).then((response) => {
      res.send(response);
    });
  },

  /* III // ******* PRIVATE ADMIN CONTROLLERS ** */
  /* B // CREATE FUNDING ITEM BY ADMIN ********* */

  createFundingItemByAdmin(req, res, next) {
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

      askedPriceByUser,
      initialTokenAmount,
      fundingStartDate,
      fundingEndDeadlineDate,

      isPublic,
    } = req.body;
    if (
      !name /* ||
        !adress ||
        !city ||
        !postalCode ||
        !description ||
        !typeOfItem  ||
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
    ) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis",
      });
    }
    return ItemFundingModel.create({
      isPublic: !isPublic ? false : isPublic,
      itemFundingStatus: {
        isUpForReviewByAdmin: true,
        isPublished: false,
        isCurrentlyBeingFunded: false,
        hasReachedFundingGoal: false,

        initialData: {
          priceInEuros: askedPriceByUser,
          initialTokenAmount: initialTokenAmount,
          initialSingleTokenValueInEuros:
            parseInt(askedPriceByUser) / parseInt(initialTokenAmount),

          fundingStartDate: !fundingStartDate ? "12/01/2021" : fundingStartDate,
          fundingEndDeadlineDate: !fundingEndDeadlineDate
            ? "12/03/2021"
            : fundingEndDeadlineDate,
          fundingGoalReachedDate: "",
        },
        fundingProgressData: {
          remainingAvailableToken: 1000,
          numberOfTokenSold: 0,
          tokenBuyOrders: [
            /* {userID:String, tokenAmount:Number, transactionId:String} */
          ],
          remainingTime: "",
        },
      },

      itemInfos: {
        name: name,
        adress: adress,
        city: city,
        postalCode: postalCode,
        description: description,

        typeOfItem: typeOfItem,
        livingArea: livingArea,
        rooms: rooms,
        bedrooms: bedrooms,

        terrace: terrace,
        terraceSurface: terraceSurface,
        garage: garage,
        garageNumber: !garageNumber ? 0 : garageNumber,
        parking: parking,
        parkingNumber: !parkingNumber ? 0 : parkingNumber,
        swimmingPool: swimmingPool,

        otherSpecialPerks: !otherSpecialPerks ? "" : otherSpecialPerks,

        itemPicturesFromUser: [],
        itemPicturesSelectedByAdmin: [],
      },
    })
      .then((newFundingItem) => {
        res.status(200).send({
          success: true,
          message: `Votre proposition, Monsieur ou Madame ${req.user.lastName} à bien été soumise à l'équipe d'UpDownStreet. Elle porte l'ID ${newFundingItem._id}`,
          itemFundingId: `${newFundingItem._id}`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: "Erreur lors de la soumission de votre proposition.",
          log: `LOG ERR : ${err}`,
        });
      });
  },
};

module.exports = ItemFundingController;
