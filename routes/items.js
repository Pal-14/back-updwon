var express = require("express");
const ItemController = require("../controllers/itemController.js");
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
router.get("/public-listing", ItemController.getPublicItemList); 



/* **** *** *** ** ** * PRIVATE USER ROUTES * ** ** *** *** **** */
/* ************************************************************* */

/* POST CREATE FUNDING PROPOSAL BY A USER : Allows the users to create a funding proposal which will be examined by UDS team */
/* TODO : Implement in Front. Currently only admins can post funding items */
router.post("/create-by-user", Auth.isUser, ItemController.createItemByUser)

/* POST UPLOADS PICTURES FOR A FUNDING ITEM */
router.post("/upload-public-doc", Auth.isUser, UploadMiddleware.uploadItemPictures, ItemController.stockPublicDocumentOfItem);

/* POST UPLOAD A LEGAL DOC IN PRIVATE FOLDER AND LOGS IT IN LEGAL DOC OF ITEM */
router.post("/upload-legal-doc", Auth.isUser, UploadMiddleware.uploadItemLegalDocument, ItemController.stockPrivateDocumentOfItem)  

/* PUT USER CAN EDIT AN ITEM HE HAS CREATED BUT NOT SUBMITED FOR REVIEW FOR EXAMPLE */
router.put("/edit-item-by-user", Auth.isUser, ItemController.editItemByUserAnyValue)

/* SHITTY DEV ROUTE TO BE ABLE TO DEMO */
router.post("/buy-initial-token", Auth.isUser, Auth.stableCoinUserPayment, ItemController.buyTokenOfCurrentlyFundingItem)


router.put("/buy-initial-token", Auth.isUser, /* Auth.stableCoinUserPayment, */ ItemController.buyTokenOfCurrentlyFundingItem)


/* **** *** *** ** ** * PRIVATE ADMIN ROUTES * ** ** *** *** **** */
/* ************************************************************** */

/* GET SHOW COMPLETE LIST OF ALL FUNDING ITEMS */
router.get("/admin-listing", Auth.isUser, Auth.isAdmin, ItemController.getItemListForAdmin); 

/* POST ADMIN CAN CREATE AN ITEM AND SPECIFY ANY VALUE */
router.post("/create-by-admin", Auth.isUser, Auth.isAdmin, ItemController.createItemByAdmin)

/* PUT ADMIN CAN EDIT AN ITEM AT HIS CONVENIENCE. JUST ONE VALUE AND KEY AT A TIME */
router.put("/edit-by-admin", Auth.isUser, Auth.isAdmin, ItemController.editItemByAdminAnyValue)

module.exports = router;

