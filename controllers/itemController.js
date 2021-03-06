const ItemModel = require("../models/itemModel.js");
const UserModel = require("../models/userModel.js");

function handleServerError(err, res) {
  console.log(err);
  return res.sendStatus(500);
}

/* *********************************************************************************** */
/* ********* ********** ***** * ITEMS CONTROLLERS SUMMARY * ***** ********** ********* */
/* *********************************************************************************** */

/*
I.PUBLIC CONTROLLERS
  A. GET PUBLIC ITEM LIST
  //getPublicItemList


II.PRIVATE USER CONTROLLERS
  A. CREATE ITEM BY USER
  //createItemByUser
  //TODO : Put the very long req list and conditions in another file. 
  Decide which fields are mandatory.

  B. EDIT ITEM BY USER
  //editItemByUserAnyValue
  // TODO : Restrict values that can be edited by a user

  C. STOCK PUBLIC DOCUMENT OF ITEM
  //stockPublicDocumentOfItem

  D. STOCK PRIVATE DOCUMENT OF ITEM 
  //stockPrivateDocumentOfItem

  E. BUY TOKEN OF ITEMS IN FUNDING STAGE
  //buyTokenOfCurrentlyFundingItem


III. PRIVATE ADMIN CONTROLLERS
  A. GET ITEM LIST FOR ADMIN
  //getItemListForAdmin

  B. CREATE ITEM BY ADMIN 
  //createItemByAdmin

  C. EDIT ITEM BY ADMIN ANY VALUE
  //editItemByAdminAnyValue 
  // TODO : 
*/


/* ************************************************************************** */
/* ********* ********** PART I : PUBLIC USER CONTROLLERS ********** ********* */
/* ************************************************************************** */

/* I // ********* PUBLIC CONTROLLERS ********** */
/* A // GET PUBLIC ITEM LIST ********** */

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
/* A // CREATE ITEM BY USER  ********* */

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
      messageFromUser,
      isCurrentlyRented,
      expectedYearlyIncome,
    } = req.body;
    if (
      !name ||
      !adress ||
      !city ||
      !postalCode ||
      !description ||
      !typeOfItem  ||
      !askedPriceByUser
      
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
            historyOfActiveTokenBuyOrders:[],
            historyOfActiveTokenSellOffers:[],
            historyOfCompletedTokenTransactions:[],
            },
            
            management:{
            numberOfDecisionsPendingApproval:0,
            currentYearBalance:0,
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

            fundingOfItemIsInProgress:false,
            fundingStartDate:"", 
            fundingEndDeadlineDate:"",
            fundingGoalReachedDate:"", 
            },

            tokenData:{
              activeTokenBuyOrders:[],
              activeTokenSellOffers:[],
            },

            itemPicturesFromUser: [],
            itemPicturesSelectedByAdmin:[],
        },
    })
      .then((newItem) => {
        res.status(200).send({
          success: true,
          message: `Votre proposition, Monsieur ou Madame ${req.user.lastName} ?? bien ??t?? soumise ?? l'??quipe d'UpDownStreet. Elle porte l'ID ${newItem._id}`,
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
          "Les informations n??ccessaires ?? la bonne ex??cution de la requ??te n'ont pas ??t?? re??ues.",
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
          message: `Les modifications apport??es au bien portant l'id : ${targetItemId}. Ont bien ??t?? prises en compte. ${keyOfPropertyToChange} is now ${newValue}`,
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
  /* C // STOCK PUBLIC DOCUMENT OF ITEM  */
  
  stockPublicDocumentOfItem(req, res, next) {
    const myArray = req.myArray;
    let { targetItemFundingId } = req.body;
    if (!myArray) {
      return res
      .status(400)
      .send({ success: false, message: "Champs n??ccessaires non indiqu??s" });
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
          "Ok vos documents ont bien ??t?? envoy??s. L'??quipe d'UpDownStreet v??rifiera vos documents sous 48h.",
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
    /* D // STOCK PRIVATE DOCUMENT OF ITEM */
    
    stockPrivateDocumentOfItem(req, res, next) {
      const myArray = req.myArray;
      let { targetItemFundingId } = req.body;
      if (!myArray) {
        return res
        .status(400)
        .send({ success: false, message: "Champs n??ccessaires non indiqu??s" });
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
            "Ok vos documents ont bien ??t?? envoy??s. L'??quipe d'UpDownStreet v??rifiera vos documents sous 48h.",
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
      /* E // BUY TOKENS OF ITEM CURRENTLY FUNDING */
      
      
      buyTokenOfCurrentlyFundingItem(req, res, next ){
        let { targetItemId, tokenQuantityOrdered, priceInStableCoin } = req.body;
        if (!targetItemId || !tokenQuantityOrdered){
          return res
          .status(400)
          .send({
            success: false,
            message: "Erreur",
          })
        }
        return ItemModel.findOne({_id:targetItemId})
        .then((targetedItem) => {
          if (targetedItem === null) {
            return res
            .status(400)
            .send({
              success:false,
              message:"Aucun bien ne correspond ?? l'ID fourni"
            });
          }
          let remainingTokenAfterBuy = parseInt(targetedItem.itemPublicData.funding.remainingAvailableToken) - parseInt(tokenQuantityOrdered)
          return ItemModel.findOneAndUpdate(
            {_id:targetItemId},
            {$set : {
              ["itemPublicData.funding.remainingAvailableToken"] : remainingTokenAfterBuy,
            },
          }
          )
          .then(()=> {
            let shareOfItem = 100 * (parseInt(tokenQuantityOrdered) / parseInt(targetedItem.itemPublicData.funding.initialTokenAmount))
            let priceOfOrderInStableCoin = parseInt(targetedItem.itemPublicData.funding.initialSingleTokenValueInEuros) * parseInt(tokenQuantityOrdered) 
            let logOfTokenPurchaseForItem = {
              itemId:targetItemId,
              idOfOwner:req._id,
              userName: `${req.user.firstName} ${req.user.lastName}`,
              globalTokenIdOfItem: `UDS-${targetItemId}-BCF2021-TK`,
              tokenQuantityOrdered:tokenQuantityOrdered,
              priceOfOrderInStableCoin:priceOfOrderInStableCoin,
              globalTokenAmountForThisItem:targetedItem.itemPublicData.funding.initialTokenAmount,
              initialTokenValue:targetedItem.itemPublicData.funding.initialSingleTokenValueInEuros,
              fundingDeadlineForItem: targetedItem.itemPublicData.funding.fundingEndDeadlineDate,
              dateOfPurchase: Date.now(),
              shareOfItem: shareOfItem,
              prettyPrintCurrentlyInFundingStage : `L'utilisateur ${req.user.firstName} ${req.user.lastName} ?? r??alis?? un pledge de ${tokenQuantityOrdered} token UDS-${targetItemId._id}-BCF2021-TK. Pour un montant total de ${priceOfOrderInStableCoin} stable coins.
              Cela repr??sente une part de ${shareOfItem} % du total de ${targetedItem.itemPublicData.funding.initialTokenAmount} tokens existants pour le bien portant l'ID ${targetItemId._id}.
              - Si l'ensemble des token n'est pas acquis avant la cloture de la phase de financement :
              L'utilisateur ${req.user.firstName} ${req.user.lastName} devra ??tre recr??dit?? de ${priceOfOrderInStableCoin} stable coins.
              - Si l'ensemble des token est acquis avant la cloture de la phase de financement :
              Les tokens poss??d??s pourront ??tre vendus et ??chang??s sur le marche UpDownStreet.
              `,
              tokenType:"Pledge"
            }
            if (!logOfTokenPurchaseForItem){
              return res.sendStatus(400)
            }
            return ItemModel.updateOne(
              {_id:targetItemId},
              {$push : {
                ["itemPrivateData.tokenData.tokenBuyOrdersDuringFunding"] : logOfTokenPurchaseForItem,
              },
            }
            )
            .then(()=> {
              let logOfTokenPurchaseForUser = {
                itemId:targetedItem._id,
                idOfOwner:req._id,
                userName: `${req.user.firstName} ${req.user.lastName}`,
                globalTokenIdOfItem: `UDS-${targetItemId}-BCF2021-TK`,
                tokenQuantityOrdered:tokenQuantityOrdered,
                priceOfOrderInStableCoin:priceOfOrderInStableCoin,
                globalTokenAmountForThisItem:targetedItem.itemPublicData.funding.initialTokenAmount,
                initialTokenValue:targetedItem.itemPublicData.funding.initialSingleTokenValueInEuros,
                fundingDeadlineForItem: targetedItem.itemPublicData.funding.fundingEndDeadlineDate,
                dateOfPurchase: Date.now(),
                shareOfItem: shareOfItem,
                prettyPrintCurrentlyInFundingStage : ` Monsieur ou Madame ${req.user.firstName} ${req.user.lastName} ?? r??alis?? un pledge de ${tokenQuantityOrdered} token UDS-${targetItemId._id}-BCF2021-TK. Pour un montant total de ${priceOfOrderInStableCoin} stable coins.
                Cela repr??sente une part de ${shareOfItem} % du total de ${targetedItem.itemPublicData.funding.initialTokenAmount} tokens existants pour le bien portant l'ID ${targetItemId._id}.
                - Si l'ensemble des token n'est pas acquis avant la cloture de la phase de financement :
                L'utilisateur ${req.user.firstName} ${req.user.lastName} devra ??tre recr??dit?? de ${priceOfOrderInStableCoin} stable coins.
                - Si l'ensemble des token est acquis avant la cloture de la phase de financement :
                Les tokens poss??d??s pourront ??tre vendus et ??chang??s sur le marche UpDownStreet.
                `,
              }
              return UserModel.updateOne(
                {_id:req._id},
                {$push : {
                  ["stableCoinLog"] : logOfTokenPurchaseForUser,
                },
              }
              )
              .then(()=> {
                let newStableCoinBalanceOfUser = parseInt(req.user.stableCoin) - parseInt(priceOfOrderInStableCoin)

                return UserModel.updateOne(
                  {_id:req._id},
                  {$set : {
                    ["stableCoin"] : newStableCoinBalanceOfUser,
                  },
                }
                )
                .then(()=> {
                  return res 
                    .status(200)
                    .send(
                      {
                        success:true,
                        message:`Votre achat de token s'est bien d??roul??.`
                      }
                    )
                })
                .catch((err) => handleServerError(err, res))
              })
              .catch((err) => handleServerError(err, res))
            })
            .catch((err) => handleServerError(err, res))
          })
          .catch((err) => handleServerError(err, res))
        })
        .catch((err) => handleServerError(err, res))
      },
      
      /* II // ******* PRIVATE USER CONTROLLERS **** */
      /* F // BUY TOKENS OF ITEM CURRENTLY FUNDING */

      stableCoinUserPayment(req, res, next){

      },
      
      
      /* ************************************************************************** */
      /* ********* ******** PART III : PRIVATE ADMIN CONTROLLERS ******** ********* */
      /* ************************************************************************** */
      
      /* III // ******* PRIVATE ADMIN CONTROLLERS */
      /* A // GET ITEM LIST FOR ADMIN *** */
      
      getItemListForAdmin(req, res, next) {
        return ItemModel.find({}).then((response) => {
          res.send(response);
        });
      },
      
/* III // ******* PRIVATE ADMIN CONTROLLERS ** */
/* B // CREATE ITEM BY ADMIN ********* */
  
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
      initialSingleTokenValueInEuros,
      fundingStartDate,
      fundingEndDeadlineDate /*  RAJOUTER EN FRONT */,
      
      /* NOUVELLES KEYS  */
      isCurrentlyRented,
      expectedYearlyIncome,
      priceInEuros,
      priceSetByUpDownStreet,
      messageFromUser, /* ALSO COUNTS AS A NOTE FROM AN ADMIN */
      
      /* NEW KEYS FOR ADMIN ONLY */
      isPublic,
      
    } = req.body;
    if (!name ) {
        return res.status(400).send({
          success: false,
          message: "Les champs obligatoires ne sont pas tous remplis",
        });
      }
      return ItemModel.create({
        itemPrivateData :{
          status:{
            isPublic: isPublic,
            submitedByUser:false,
            submitedByAdmin: true, 
            isUpForReviewByAdmin: false,
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
            historyOfActiveTokenBuyOrders:[],
            historyOfActiveTokenSellOffers:[],
            historyOfCompletedTokenTransactions:[],
          },
          
          management:{
            numberOfDecisionsPendingApproval:0,
            currentYearBalance:0,
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
            remainingAvailableToken:initialTokenAmount,
            
            fundingOfItemIsInProgress:false,
            fundingStartDate:!fundingStartDate ? "" : fundingStartDate, 
            fundingEndDeadlineDate:!fundingEndDeadlineDate ? "" : fundingEndDeadlineDate,
            fundingGoalHasBeenReached:false,
            fundingGoalReachedDate:"", 
          },
          
          itemPicturesFromUser: [],
          itemPicturesSelectedByAdmin:[],
        },
      })
      .then((newFundingItem) => {
        res.status(200).send({
          success: true,
          message: `Votre proposition, Monsieur ou Madame ${req.user.lastName} ?? bien ??t?? soumise ?? l'??quipe d'UpDownStreet. Elle porte l'ID ${newFundingItem._id}`,
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
            "Les informations n??ccessaires ?? la bonne ex??cution de la requ??te n'ont pas ??t?? re??ues.",
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
            message: `Les modifications apport??es au bien portant l'id : ${targetItemId}. Ont bien ??t?? prises en compte. ${keyOfPropertyToChange} is now ${newValue}`,
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
  