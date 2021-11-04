let express = require('express');
const cors = require('cors')
let cookieParser = require('cookie-parser');
let logger = require('morgan');

require('dotenv').config();
require('./connectDb')

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();

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
/* app.use(express.static(path.join(__dirname, 'public'))); */

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
