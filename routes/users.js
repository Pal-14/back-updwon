var express = require('express');
const UserControler = require('../controlers/userControler.js');
var router = express.Router();
const UserModel = require('../models/userModel.js')

/* GET USERS LISTING // DEV ROUTE SO FRONT END TEAM CAN RECEIVE DATA AND TRY STUFF // WILL BE REMOVED */
router.get('/', function(req, res, next) {
  UserModel
    .find({}).then((response)=>{
      res.send(response)
  });
});

router.get('/virgitest', UserControler.isUser, UserControler.testPrivateController)

router.get('/checkToken', UserControler.isUser, UserControler.getInfos)
router.post('/login', UserControler.login);
router.post('/signup', UserControler.signup);
router.put('/editUser', UserControler.isUser, UserControler.editUser);
router.put('/editUserCoin', UserControler.isUser, UserControler.editUserCoin);



module.exports = router;
