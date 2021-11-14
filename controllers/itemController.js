const ItemModel = require("../models/ItemModel");

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
  //getPublicFundingItemList


II.PRIVATE USER CONTROLLERS
  A. CREATE FUNDING ITEM BY USER
  //createFundingItemByUser
  //TODO : Put the very long req list and conditions in another file


III. PRIVATE ADMIN CONTROLLERS
  A. GET COMPLETE FUNDING ITEM LIST FOR ADMIN
  //getFundingItemListForAdmin
*/

/* ************************************************************************** */
/* ********* ********** PART I : PUBLIC USER CONTROLLERS ********** ********* */
/* ************************************************************************** */

/* I // ********* PUBLIC CONTROLLERS ********** */
/* A // GET PUBLIC FUNDING ITEM LIST ********** */

const ItemController = {
  getPublicItemList(req, res, next) {
    return ItemModel.find({ isPublic: true })
      .select("-itemPrivateData")
      .then((response) => {
        res.send(response);
      })
      .catch((err) => handleServerError(err, res));
  },

  
/* ************************************************************************** */
/* ********* ********* PART II : PRIVATE USER CONTROLLERS ********* ********* */
/* ************************************************************************** */

/* II // ******* PRIVATE USER CONTROLLERS **** */
/* A // CREATE FUNDING ITEM BY USER  ********* */

  createItemByUser(req, res, next) {
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

      /* NOUVELLES KEYS  */
      messageFromUser,
      isCurrentlyRented,
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
    return ItemModel.create({
          itemPrivateData :{
            status:{
            isPublic: false,
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
            priceInEuros:0,
            initialTokenAmount:0,
            initialSingleTokenValueInEuros:0,
            remainingAvailableToken:0,

            fundingStartDate:"", 
            fundingEndDeadlineDate:"",
            fundingGoalReachedDate:"", 
            },

            itemPicturesFromUser: [],
            itemPicturesSelectedByAdmin:[],
        },
    })
      .then((newItem) => {
        res.status(200).send({
          success: true,
          message: `Votre proposition, Monsieur ou Madame ${req.user.lastName} à bien été soumise à l'équipe d'UpDownStreet. Elle porte l'ID ${newItem._id}`,
          itemFundingId: `${newItem._id}`,
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
/* B // EDIT ITEM BY USER */
  editItemByUserAnyValue(req, res, next) {
    let { keyOfPropertyToChange, newValue, targetItemId } = req.body;
    if (!keyOfPropertyToChange || newValue === undefined || !targetItemId) {
      return res.status(400).send({
        success: false,
        message:
          "Les informations néccessaires à la bonne exécution de la requête n'ont pas été reçues.",
        logOfInputValue: `Log it . ${targetItemId}, ${keyOfPropertyToChange} ${newValue}`,
      });
    }
    return ItemModel.updateOne(
      { _id: targetItemId},
      {
        $set: {
          [keyOfPropertyToChange]: newValue,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: `Les modifications apportées au bien portant l'id : ${targetItemId}. Ont bien été prises en compte. ${keyOfPropertyToChange} is now ${newValue}`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: `Did not go well. Item ${keyOfPropertyToChange} status wasn't changed to ${newValue}. ${targetItemId} Err Log : ${err}`,
        });
      });
  },
  
  
  
  
  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* C // STOCK PUBLIC DOCUMENT OF FUNDING ITEM  */
  
  stockPublicDocumentOfItem(req, res, next) {
    const myArray = req.myArray;
    let { targetItemFundingId } = req.body;
    console.log(myArray);
    if (!myArray) {
      return res
      .status(400)
      .send({ success: false, message: "Champs néccessaires non indiqués" });
    }
    return ItemModel.updateOne(
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
    /* D // STOCK PRIVATE DOCUMENT OF FUNDING ITEM */
    
    stockPrivateDocumentOfItem(req, res, next) {
      const myArray = req.myArray;
      let { targetItemFundingId } = req.body;
      if (!myArray) {
        return res
        .status(400)
        .send({ success: false, message: "Champs néccessaires non indiqués" });
      }
      return ItemModel.updateOne(
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
    
/* III // ******* PRIVATE ADMIN CONTROLLERS */
/* A // GET FUNDING ITEM LIST FOR ADMIN *** */

    getItemListForAdmin(req, res, next) {
      return ItemModel.find({}).then((response) => {
      res.send(response);
    });
  },

/* III // ******* PRIVATE ADMIN CONTROLLERS ** */
/* B // CREATE FUNDING ITEM BY ADMIN ********* */
  
  createItemByAdmin(req, res, next) {
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
      
      /* NOUVELLES KEYS  */
      isCurrentlyRented,
      expectedYearlyIncome,
      priceSetByUpDownStreet,
      messageFromUser, /* ALSO COUNTS AS A NOTE FROM AN ADMIN */
      
      /* NEW KEYS FOR ADMIN ONLY */
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
      console.log(isPublic, typeof(isPublic));
      return ItemModel.create({
        itemPrivateData :{
          status:{
            isPublic: isPublic,
            fundingGoalHasBeenReached: false,
            fundingOfItemIsInProgress: false,
            submitedByUser:false,
            submitedByAdmin:true, 
            isUpForReviewByAdmin: true,
          },
          
          informations:{
            askedPriceByUser:askedPriceByUser,
            submitedByUserWithId:req._id,
            submitedByUserFirstAndLastName:`${req.user.firstName} ${req.user.lastName}`,
            dateOfSubmitByUser:Date.now(),
            messageFromUser: !messageFromUser ? "" : messageFromUser,
            priceSetByUpDownStreet:!priceSetByUpDownStreet ? 0 : priceSetByUpDownStreet,
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
            priceInEuros: !priceSetByUpDownStreet ? 0 : priceSetByUpDownStreet,
            initialTokenAmount:!initialTokenAmount ? 0 : initialTokenAmount,
            initialSingleTokenValueInEuros:!priceSetByUpDownStreet || !initialTokenAmount ? 0 : parseInt(priceInEuros) / parseInt(initialTokenAmount),
            remainingAvailableToken:!priceSetByUpDownStreet || !initialTokenAmount ? 0 : parseInt(priceInEuros) / parseInt(initialTokenAmount),
            
            fundingStartDate:!fundingStartDate ? "" : fundingStartDate, 
            fundingEndDeadlineDate:!fundingEndDeadlineDate ? "" : fundingEndDeadlineDate,
            fundingGoalReachedDate:"", 
          },
          
          itemPicturesFromUser: [""],
          itemPicturesSelectedByAdmin:[""],
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
    

    
/* III // ******* PRIVATE ADMIN CONTROLLERS ** */
/* C // EDIT ITEM BY ADMIN ANY VALUE ********* */

    editItemByAdminAnyValue(req, res, next) {
      let { keyOfPropertyToChange, newValue, targetItemId } = req.body;
      if (!keyOfPropertyToChange || newValue === undefined || !targetItemId) {
        return res.status(400).send({
          success: false,
          message:
            "Les informations néccessaires à la bonne exécution de la requête n'ont pas été reçues.",
          logOfInputValue: `Log it . ${targetItemId}, ${keyOfPropertyToChange} ${newValue}`,
        });
      }
      return ItemModel.updateOne(
        { _id: targetItemId},
        {
          $set: {
            [keyOfPropertyToChange]: newValue,
          },
        }
      )
        .then(() => {
          res.status(200).send({
            success: true,
            message: `Les modifications apportées au bien portant l'id : ${targetItemId}. Ont bien été prises en compte. ${keyOfPropertyToChange} is now ${newValue}`,
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: false,
            message: `Did not go well. Item ${keyOfPropertyToChange} status wasn't changed to ${newValue}. ${targetItemId} Err Log : ${err}`,
          });
        });
    },
  };

  module.exports = ItemController;
  