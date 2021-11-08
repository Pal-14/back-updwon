let express = require('express');
const cors = require('cors')
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path')
require('dotenv').config();
require('./connectDb')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

const multer = require ('multer');
const storage = multer.diskStorage({
  destination:'./public/uploads',
  filename: function (req, file, cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
    storage:storage,
  }).single('file_upload');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res)=>{
    upload(req, res, (err)=> {
        if (err){
            res.render('index', {
                msg : err
            });
        } else {
            console.log(req.file);
            res.send({success:true,
                 message:`Envoi du fichier : OK`,
                log:`file log ${req.file}`});
        }
    }) 
})

app.get('/mescouillesLeLien/:name', function (req, res, next) {
  let options = {
    root: path.join(__dirname, 'public/uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  let fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})


app.get('/jambonLeLien/:name', function (req, res, next) {
  let options = {
    root: path.join(__dirname, 'private/normando'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }

  let fileName = req.params.name
  res.sendFile(fileName, options, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
})

app.use('/', indexRouter);
app.use('/users', usersRouter);













module.exports = app;
