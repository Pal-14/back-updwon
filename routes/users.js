var express = require('express');
const UserControler = require('../controlers/userControler.js');
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
router.post('/login', UserControler.login);
router.post('/signup', UserControler.signup);

/* PRIVATE ROUTES  */
router.get('/virgitest', Auth.isUser, UserControler.testPrivateController)
router.get('/check-token', Auth.isUser, UserControler.getInfos)
router.get('/admin-listing', Auth.isUser, Auth.isAdmin, UserControler.testPrivateController, function(req, res, next){
  UserModel
    .find({}).then((response)=>{
      res.send(response)
    })
})



router.put('/edit-user', Auth.isUser, UserControler.editUser);
router.put('/edit-user-coin', Auth.isUser, UserControler.editUserCoin);
router.put('/edit-user-admin', Auth.isUser, Auth.isAdmin, UserControler.editUserAdminStatus);

/* router.post('/files-proof', Auth.isUser, type, UserControler.filesProof);
 */


/* ROUTE TRIES */
/* router.put('/edit-user-your-choice', Auth.isUser, UserControler.editUserYourChoice ) */
router.post('/edit-user-try', Auth.isUser, UserControler.editUserTry);



module.exports = router;
