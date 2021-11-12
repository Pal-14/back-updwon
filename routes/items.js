var express = require("express");
const ItemController = require("../controlers/UserController.js");
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

router.post("/create-funding", Auth.isUser, ItemController.createFunding)

module.exports = router;
