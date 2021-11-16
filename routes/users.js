const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/userController.js");
const Auth = require("../middlewares/authentification.js");
const UploadMiddleware = require("../middlewares/upload.js");
const UserModel = require("../models/userModel.js");

/* ********************************************************************************** */
/* ********* ********** ***** *** USERS ROUTER SUMMARY *** ***** ********** ********* */
/* ********************************************************************************** */

/* I // ********* PUBLIC ROUTES ***************************************************** */
/* ********************************************************************************** */

/* A // GET ******** */
userRouter.get("/", function (req, res, next) {
  UserModel.find({}).then((response) => {
    res.send(response);
  });
});

/* B // POST ******** */
userRouter.post("/login", UserController.login);
userRouter.post("/signup", UserController.signup);



/* II // ******** PRIVATE USER ROUTES *********************************************** */
/* ********************************************************************************** */

/* A // GET ******** */
userRouter.get("/check-token", Auth.isUser, UserController.getInfos);

/* B // POST ******** */

userRouter.post(
  "/upload",
  Auth.isUser,
  UploadMiddleware.uploadUserDocument,
  UserController.stockUserDocument
  );
  
  userRouter.post(
  "/upload-private-document",
  Auth.isUser,
  UploadMiddleware.uploadUserDocument,
  UserController.stockUserDocument
  );
  
  /* C // PUT ******** */
  userRouter.put("/edit-user", Auth.isUser, UserController.requestVerifiedStatus); /* WILL BE REMOVED AND REPLACED BY THE ONE BELOW */
  userRouter.put("/request-verified-status", Auth.isUser, UserController.requestVerifiedStatus)


  userRouter.put("/edit-user-coin", Auth.isUser, UserController.editUserCoin);
  userRouter.put("/buy-coin-by-card", Auth.isUser, UserController.editUserCoin);
  userRouter.put("/buy-coin-by-transfer",);
  userRouter.put("/convert-coin-to-euro",);

  /* This Route allows a user to edit its own informations. It cant edit his admin status or stablecoin balance */
  userRouter.put(
    "/edit-user-by-user",
    Auth.isUser,
    UserController.editUserByUserAnyValue
  );
  
  
  
  /* III // ******* PRIVATE ADMIN ROUTES ********************************************** */
  /* ********************************************************************************** */
  
  /* A // GET ******** */
  userRouter.get(
    "/admin-listing",
    Auth.isUser,
    Auth.isAdmin,
    UserController.getCompleteUserList
    );
    
    /* B // POST ******** */
    
    /* C // PUT ******** */
    userRouter.put(
      "/edit-user-status",
      Auth.isUser,
      Auth.isAdmin,
      UserController.editUserByAdminAnyValue
      );
      
      userRouter.put(
      "/edit-user-by-admin",
      Auth.isUser,
      Auth.isAdmin,
      UserController.editUserByAdminAnyValue
      );
      

module.exports = userRouter;
