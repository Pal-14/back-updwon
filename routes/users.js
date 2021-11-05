var express = require('express');
const UserControler = require('../controlers/userControler.js');
var router = express.Router();
const UserModel = require('../models/userModel.js')
const Auth = require('../middlewares/authentification.js')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

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
router.get('/admin-listing', Auth.isUser, Auth.isAdmin, UserControler.testPrivateController)

router.put('/edit-user', Auth.isUser, UserControler.editUser);
router.put('/edit-user-coin', Auth.isUser, UserControler.editUserCoin);

router.post('/files-proof', Auth.isUser, upload.array("files", 3), UserControler.filesProof);



/* ROUTE TRIES */
router.put('/edit-user-your-choice', Auth.isUser, UserControler.editUserYourChoice )


module.exports = router;
