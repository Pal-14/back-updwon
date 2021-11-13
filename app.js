let express = require('express');
const cors = require('cors')
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let path = require('path')
require('dotenv').config();
require('./connectDb')

let indexRouter = require('./routes/index');
let UserRouter = require('./routes/users');
let itemsRouter = require('./routes/items');

let app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', UserRouter);
app.use('/items', itemsRouter);


module.exports = app;
