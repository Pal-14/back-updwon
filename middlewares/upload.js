let path = require("path");
const multer = require("multer");

const publicFolderStorage = multer.diskStorage({
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

const privateFolderStorage = multer.diskStorage({
  destination: "./private/uploads",
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

function checkFileTypeForPicsAndDocs(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
}

const uploadToPrivateFolder = multer({
  storage: privateFolderStorage,
  limit: { fileSize: 100000 },
  fileFilter: function (req, file, cb) {
    checkFileTypeForPicsAndDocs(file, cb);
  },
}).any("file:");

const uploadToPublicFolder = multer({
  storage: publicFolderStorage,
  limit: { fileSize: 100000 },
  fileFilter: function (req, file, cb) {
    checkFileTypeForPicsAndDocs(file, cb);
  },
}).any("file:");

const uploadToYourChoiceFolder = multer({
  storage: publicFolderStorage,
  limit: { fileSize: 100000 },
  fileFilter: function (req, file, cb) {
    checkFileTypeForPicsAndDocs(file, cb);
  },
}).any("file:");


const UploadMiddleware = {

  uploadUserDocument(req, res, next) {
    uploadToPrivateFolder(req, res, next, (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Erreur sur le middleware UploadMiddleware.uploadUserDocument",
        });
      }
      res.status(200).send({
        success: true,
        message: `Upload du Fichier OK`,
      });
      next();
    });
  },

  uploadItemPictures(req, res, next) {
    uploadToPublicFolder(req, res, next, (err) => {
      if (err) {
        return res.status(400).send({
          success: false,
          message: "Erreur sur le middleware UploadMiddleware.uploadItemPictures",
        });
      }
      res.status(200).send({
        success: true,
        message: `Upload du Fichier OK`,
      });
      next();
    });
  },
};

module.exports = UploadMiddleware;
