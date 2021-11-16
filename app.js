let express = require('express');
const cors = require('cors')
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path')
require('dotenv').config();
require('./connectDb')

let indexRouter = require('./routes/index');
let userRouter = require('./routes/users');
let itemRouter = require('./routes/items');

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/items', itemRouter);


module.exports = app;
