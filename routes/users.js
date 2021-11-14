const express = require("express");
const router = express.Router();
const UserController = require("../controlers/UserController.js");
const Auth = require("../middlewares/authentification.js");
const UploadMiddleware = require("../middlewares/upload.js");
const UserModel = require("../models/userModel.js");

/* ********************************************************************************** */
/* ********* ********** ***** *** USERS ROUTER SUMMARY *** ***** ********** ********* */
/* ********************************************************************************** */

/* I // ********* PUBLIC ROUTES ***************************************************** */
/* ********************************************************************************** */

/* A // GET ******** */
router.get("/", function (req, res, next) {
  UserModel.find({}).then((response) => {
    res.send(response);
  });
});

/* B // POST ******** */
router.post("/login", UserController.login);
router.post("/signup", UserController.signup);



/* II // ******** PRIVATE USER ROUTES *********************************************** */
/* ********************************************************************************** */

/* A // GET ******** */
router.get("/virgitest", Auth.isUser, UserController.testPrivateController);
router.get("/check-token", Auth.isUser, UserController.getInfos);

/* B // POST ******** */

router.post(
  "/upload",
  Auth.isUser,
  UploadMiddleware.uploadUserDocument,
  UserController.stockUserDocument
  );
  
router.post(
  "/upload-private-document",
  Auth.isUser,
  UploadMiddleware.uploadUserDocument,
  UserController.stockUserDocument
  );
  
  /* C // PUT ******** */
  router.put("/edit-user", Auth.isUser, UserController.requestVerifiedStatus); /* WILL BE REMOVED AND REPLACED BY THE ONE BELOW */
  router.put("/request-verified-status", Auth.isUser, UserController.requestVerifiedStatus)


  router.put("/edit-user-coin", Auth.isUser, UserController.editUserCoin);
  router.put("/buy-coin-by-card", Auth.isUser, UserController.editUserCoin);
  router.put("/buy-coin-by-transfer",);
  router.put("/convert-coin-to-euro",);

  /* This Route allows a user to edit its own informations. It cant edit his admin status or stablecoin balance */
  router.put(
    "/edit-user-by-user",
    Auth.isUser,
    UserController.editUserByUserAnyValue
  );
  
  
  
  /* III // ******* PRIVATE ADMIN ROUTES ********************************************** */
  /* ********************************************************************************** */
  
  /* A // GET ******** */
  router.get(
    "/admin-listing",
    Auth.isUser,
    Auth.isAdmin,
    UserController.getCompleteUserList
    );
    
    /* B // POST ******** */
    
    /* C // PUT ******** */
    router.put(
      "/edit-user-status",
      Auth.isUser,
      Auth.isAdmin,
      UserController.editUserByAdminAnyValue
      );
      
    router.put(
      "/edit-user-by-admin",
      Auth.isUser,
      Auth.isAdmin,
      UserController.editUserByAdminAnyValue
      );
      

module.exports = router;
