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
    cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
    storage:storage,
  }).single('file_upload');



app.use(cors());
app.use(logger('dev'));

/* app.use(function(req, res, next) {
    console.log(req.body);
    req.cacahuette=true
    next()
 } ) */

app.use(express.json());

/* app.use(function(req, res, next) {
    console.log(req.body);
    console.log(req.cacahuette);
    next()
 } ) */
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
            res.send(`Vos fichiers sont sont en traitement dans notre base de donnés.
            Vous pouvez continuer de visiter notre site en attendant
             qu'un administrateur valide votre compte`);
        }
    }) 
})


app.use('/', indexRouter);
app.use('/users', usersRouter);













module.exports = app;
