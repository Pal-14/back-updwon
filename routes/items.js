var express = require("express");
const ItemFundingController = require("../controlers/ItemFundingController.js");
var router = express.Router();
const Auth = require("../middlewares/authentification.js");
const UploadMiddleware = require('../middlewares/upload.js');

/* ********************************************************************************** */
/* ********* ********** ***** *** ITEMS ROUTER SUMMARY *** ***** ********** ********* */
/* ********************************************************************************** */


/* ** **** *** *** ** ** * PUBLIC ROUTES * ** ** *** *** **** ** */
/* ************************************************************* */

/* GET SHOW FUNDING PUBLIC */
// Route will show all fundingItems with key "isPublic" = true //
// TODO : Add Filter to add another param "isBeingCurrentlyFunded" && remaining tokens available > 0 //
router.get("/show-funding-public", ItemFundingController.getPublicFundingItemList); 



/* **** *** *** ** ** * PRIVATE USER ROUTES * ** ** *** *** **** */
/* ************************************************************* */

/* POST CREATE FUNDING PROPOSAL BY A USER : Allows the users to create a funding proposal which will be examined by UDS team */
/* TODO : Implement in Front. Currently only admins can post funding items */
router.post("/create-funding-by-user", Auth.isUser, ItemFundingController.createFundingItemByUser)

/* POST UPLOADS PICTURES FOR A FUNDING ITEM */
router.post("/upload-public-doc", Auth.isUser, UploadMiddleware.uploadItemPictures, ItemFundingController.stockPublicDocumentOfFundingItem);

/* POST UPLOAD A LEGAL DOC IN PRIVATE FOLDER AND LOGS IT IN LEGAL DOC OF ITEM */
router.post("/upload-legal-doc", Auth.isUser, UploadMiddleware.uploadItemLegalDocument, ItemFundingController.stockPrivateDocumentOfFundingItem)  

/* PUT USER CAN EDIT AN ITEM HE HAS CREATED BUT NOT SUBMITED FOR REVIEW FOR EXAMPLE */
router.put("/edit-item-by-user", Auth.isUser, ItemFundingController.editItemByUserAnyValue)



/* **** *** *** ** ** * PRIVATE ADMIN ROUTES * ** ** *** *** **** */
/* ************************************************************** */

/* GET SHOW COMPLETE LIST OF ALL FUNDING ITEMS */
router.get("/admin-listing", Auth.isUser, Auth.isAdmin, ItemFundingController.getFundingItemListForAdmin); 

/* POST ADMIN CAN CREATE AN ITEM AND SPECIFY ANY VALUE */
router.post("/create-item-by-admin", Auth.isUser, Auth.isAdmin, ItemFundingController.createFundingItemByAdmin)

/* PUT ADMIN CAN EDIT AN ITEM AT HIS CONVENIENCE. JUST ONE VALUE AND KEY AT A TIME */
router.put("/edit-item-by-admin", Auth.isUser, Auth.isAdmin, ItemFundingController.editItemByAdminAnyValue)

module.exports = router;

