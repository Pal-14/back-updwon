var express = require('express');
const UserController = require('../controlers/UserController.js');
var router = express.Router();
const UserModel = require('../models/userModel.js')
const Auth = require('../middlewares/authentification.js')

const multer = require('multer')



const storage = multer.diskStorage({
  destination:'../public/uploads',
  filename: function (req, file, cb){
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage:storage,
}).single('file_upload');


/* GET USERS LISTING // DEV ROUTE SO FRONT END TEAM CAN RECEIVE DATA AND TRY STUFF // WILL BE REMOVED */
router.get('/', function(req, res, next) {
  UserModel
    .find({}).then((response)=>{
      res.send(response)
  });
});



/* PUBLIC ROUTES  */
router.post('/login', UserController.login);
router.post('/signup', UserController.signup);

/* PRIVATE ROUTES  */
router.get('/virgitest', Auth.isUser, UserController.testPrivateController)
router.get('/check-token', Auth.isUser, UserController.getInfos)
router.get('/admin-listing', Auth.isUser, Auth.isAdmin, UserController.testPrivateController, function(req, res, next){
  UserModel
    .find({}).then((response)=>{
      res.send(response)
    })
})



router.put('/edit-user', Auth.isUser, UserController.editUser);
router.put('/edit-user-coin', Auth.isUser, UserController.editUserCoin);
router.put('/edit-user-admin', Auth.isUser, Auth.isAdmin, UserController.editUserAdminStatus);

/* router.post('/files-proof', Auth.isUser, type, UserController.filesProof);
 */


/* ROUTE TRIES */
/* router.put('/edit-user-your-choice', Auth.isUser, UserController.editUserYourChoice ) */
router.post('/edit-user-try', Auth.isUser, UserController.editUserTry);
router.post('/upload-doc-rom', /* Auth.isUser, */ UserController.uploadDocument)



module.exports = router;
