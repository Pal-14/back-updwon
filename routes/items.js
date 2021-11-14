var express = require("express");
const ItemFundingController = require("../controlers/ItemFundingController.js");
var router = express.Router();
const UserModel = require("../models/userModel.js");
const Auth = require("../middlewares/authentification.js");
const UploadMiddleware = require('../middlewares/upload.js');
const ItemFundingModel = require("../models/itemFundingModel.js");
let path = require("path");
const { uploadItemPictures } = require("../middlewares/upload.js");

/* ********************************************************************************** */
/* ********* ********** ***** *** ITEMS ROUTER SUMMARY *** ***** ********** ********* */
/* ********************************************************************************** */

/* **** *** *** ** ** * PUBLIC ROUTES * ** ** *** *** **** */
/* ******************************************************* */

/* GET SHOW FUNDING PUBLIC */
// Route will show all fundingItems with key "isPublic" = true //
// TODO : Add Filter to add another param "isBeingCurrentlyFunded" && remaining tokens available > 0 //
router.get("/show-funding-public", ItemFundingController.getPublicFundingItemList); 



router.get("/show-funding-public-try", function (req, res, next) {
  ItemFundingModel.find({isPublic:true}).then((response) => {
    res.send(response);
  });
}); 

router.get("/show-funding-public-test", function (req, res, next) {
  ItemFundingModel.find({isPublic:true}, ).then((response) => {
    res.send(response);
  });
}); 




/* **** *** *** ** ** * PRIVATE USER ROUTES * ** ** *** *** **** */
/* ************************************************************* */

/* POST CREATE FUNDING PROPOSAL BY A USER : Allows the users to create a funding proposal which will be examined by UDS team */
/* TODO : Implement in Front. Currently only admins can post funding items */
router.post("/create-funding-by-user", Auth.isUser, ItemFundingController.createFundingItemByUser)

/* POST UPLOADS PICTURES FOR A FUNDING ITEM */
router.post("/upload-public-doc", Auth.isUser, UploadMiddleware.uploadItemPictures,  ItemFundingController.stockPublicDocumentOfFundingItem);
router.post("/upload-private-doc")  




/* **** *** *** ** ** * PRIVATE ADMIN ROUTES * ** ** *** *** **** */
/* ************************************************************** */

/* GET SHOW ALL FUNDING ITEMS */
router.get("/show-funding-for-admin", Auth.isUser, Auth.isAdmin, ItemFundingController.getCompleteFundingItemListForAdmin); 
router.post("/create-funding-by-admin", Auth.isUser, Auth.isAdmin, ItemFundingController.createFundingItemByAdmin)

module.exports = router;
