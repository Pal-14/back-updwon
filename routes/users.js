var express = require('express');
const UserControler = require ('../controlers/userController')
var router = express.Router();
const UserModel = require('../models/userModel.js')
const Auth = require('../middlewares/authentification.js')
let path = require('path')
const multer  = require('multer');
const { response } = require('../app.js');
const { userInfo } = require('os');



/* GET USERS LISTING // DEV ROUTE SO FRONT END TEAM CAN RECEIVE DATA AND TRY STUFF // WILL BE REMOVED */
router.get('/', function(req, res, next) {
  UserModel
    .find({}).then((response)=>{
      res.send(response)
  });
});

/////////////////////////////////set storage
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename :function  (req, file, cb){
    console.log(path.extname)
    cb(null,/*  file.fieldname + '-'+   */req.user._id  /* + path.extname(file.originalname ) */ + '-' + Date.now() + '-' + file.originalname );
  }
});
  

/////init upload

const upload = multer({
  storage: storage,
  limit : {fileSize : 100000 },
  fileFilter: function (req, file, cb) {
    checkFileType (file, cb);
  }
}).array('file_upload');

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|pdf/;
  const mimetype = filetypes.test(file.mimetype)
  
  if(mimetype){
    return cb (null,true)
  }
  else {
    cb(null,false)
  }
}


///public folder
router.use(express.static('/public'))//////////////


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

/* router.post('/files-proof', Auth.isUser, UserControler.filesProof); */

router.post('/files-proof',Auth.isUser, (req, res)=>{
  upload(req, res, (err)=> {
      if (err){
          res.send('index', {
              msg : err
          });
      } else {
          console.log(req.file);
          res.send(`Vos fichiers sont sont en traitement dans notre base de donnés.
          Vous pouvez continuer de visiter notre site en attendant
           qu'un administrateur valide votre compte`);
      }
  }) 
})


/* ROUTE TRIES */
router.put('/edit-user-your-choice', Auth.isUser, UserControler.editUserYourChoice )


module.exports = router;
