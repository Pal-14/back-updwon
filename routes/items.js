var express = require("express");
const ItemFundingController = require("../controlers/ItemFundingController.js");
var router = express.Router();
const UserModel = require("../models/userModel.js");
const Auth = require("../middlewares/authentification.js");
const ItemFundingModel = require("../models/itemFundingModel.js");
let path = require("path");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
  let myFileName =
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
    cb(null, myFileName);
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

/* GET ROUTES  */
router.get("/show-funding", function (req, res, next) {
  ItemFundingModel.find({}).then((response) => {
    res.send(response);
  });
}); 

router.get("/", function (req, res, next) {
  UserModel.find({}).then((response) => {
    res.send(response);
  });
});

/* PUT ROUTES  */

/* POST ROUTES  */
router.post("/create-funding", Auth.isUser, ItemFundingController.createFunding)
router.post("/upload",Auth.isUser,
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
  },  ItemFundingController.stockDocumentItems);

module.exports = router;
