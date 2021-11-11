var express = require("express");
const UserController = require("../controlers/UserController.js");
var router = express.Router();
const UserModel = require("../models/userModel.js");
const Auth = require("../middlewares/authentification.js");
let path = require("path");

const multer = require("multer");
let myFileName = "";
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    myFileName =
      file.fieldname +
      "$" +
      req.user._id +
      "$" +
      Date.now() +
      path.extname(file.originalname);
    if (!req.myArray) {
      req.myArray = [myFileName];
    } else {
      req.myArray.push(myFileName);
    }
    /* req.myArray = myArray, */
    (req.nameOfUploadedFile = myFileName), cb(null, myFileName);
  },
});
const upload = multer({
  storage: storage,
  limit: { fileSize: 100000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).any("file:");

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
}

/* GET USERS LISTING // DEV ROUTE SO FRONT END TEAM CAN RECEIVE DATA AND TRY STUFF // WILL BE REMOVED */
router.get("/", function (req, res, next) {
  UserModel.find({}).then((response) => {
    res.send(response);
  });
});

/* PUBLIC ROUTES  */
router.post("/login", UserController.login);
router.post("/signup", UserController.signup);

/* PRIVATE ROUTES  */
router.get("/virgitest", Auth.isUser, UserController.testPrivateController);
router.get("/check-token", Auth.isUser, UserController.getInfos);
router.get(
  "/admin-listing",
  Auth.isUser,
  Auth.isAdmin,
  UserController.testPrivateController,
  function (req, res, next) {
    UserModel.find({}).then((response) => {
      res.send(response);
    });
  }
);

router.put("/edit-user", Auth.isUser, UserController.editUser);
router.put("/edit-user-coin", Auth.isUser, UserController.editUserCoin);
router.put("/edit-user-status",Auth.isUser,Auth.isAdmin,UserController.editUserAdminStatus);

/* ROUTE TRIES */

router.post("/edit-user-try", Auth.isUser, UserController.editUserTry);
router.post(
  "/upload",
  Auth.isUser,
  (req, res, next) => {
    upload(req, res, next, (err) => {
      if (err) {
        res.render("index", {
          msg: err,
        });
      }
      res
        .status(200)
        .send({
          success: true,
          message: `Envoi du fichier : OK`,
          log: `file log ${req.file}`,
        });
      next();
    });
  },
  UserController.stockDocument
);

module.exports = router;
