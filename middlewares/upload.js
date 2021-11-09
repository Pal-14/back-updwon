let path = require('path')
const multer  = require('multer');
const JWT_SECRET = process.env.JWT_SECRET;



const storage = multer.diskStorage({
    destination:  './public/uploads',
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



  const upload1 = {
      newUp(req, res) {
          upping(req, res, (err) =>{
              if(err) {res.send(err) }
              else {
                  if(req.file == undefined) {res.send(err)}
                  else(res.send(`http://localhost:5000/users/files-proof/${req.file.filename}`))
              }
          })
      }
   
}
module.exports = upload1
