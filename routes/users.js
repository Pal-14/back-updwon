var express = require('express');
const UserControler = require('../controlers/userControler.js');
var router = express.Router();
const UserModel = require('../models/userModel.js')
const Auth = require('../middlewares/authentification.js')

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



module.exports = router;
