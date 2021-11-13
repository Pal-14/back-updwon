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
  "/edit-user-try",
  Auth.isUser,
  UserController.editUserByUserAnyValue
);
router.post(
  "/upload",
  Auth.isUser,
  UploadMiddleware.uploadUserDocument,
  UserController.stockUserDocument
);

/* C // PUT ******** */
router.put("/edit-user", Auth.isUser, UserController.editUser);
router.put("/edit-user-coin", Auth.isUser, UserController.editUserCoin);



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

module.exports = router;
