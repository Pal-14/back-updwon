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

router.get('/virgitest', Auth.isUser, UserControler.testPrivateController)

router.get('/checkToken', Auth.isUser, UserControler.getInfos)
router.post('/login', UserControler.login);
router.post('/signup', UserControler.signup);
router.put('/editUser', Auth.isUser, UserControler.editUser);
router.put('/editUserCoin', Auth.isUser, UserControler.editUserCoin);
router.post('/filesProof', Auth.isUser, upload.array("files", 3), UserControler.filesProof);



module.exports = router;
