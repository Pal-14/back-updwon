const express = require('express');
const indexRouter = express.Router();
let path = require('path')


/* ********************************************************************************** */
/* ********* ********** ***** *** INDEX ROUTER SUMMARY *** ***** ********** ********* */
/* ********************************************************************************** */

/* ** **** *** *** ** ** * PUBLIC ROUTES * ** ** *** *** **** ** */
/* ************************************************************* */

/* GET NON EXISTING HOME PAGE INDEX */
indexRouter.get('/', function(req, res, next) {
  res.render('index', { title: 'UDS-2021' });
});

/* GET PUBLIC DOCUMENT BY A USER */
indexRouter.get('/get-public-pic/:name', function (req, res, next) {
  let options = {
    root: path.join(__dirname, '../public/uploads'),
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


/* **** *** *** ** ** * PRIVATE ADMIN ROUTES * ** ** *** *** **** */
/* ************************************************************** */

/* GET PRIVATE DOCUMENTS BY AN ADMIN */
indexRouter.get('/get-private-doc/:name', /* Auth.isAdmin, */ function (req, res, next) {
  let options = {
    root: path.join(__dirname, '../private/uploads'),
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



module.exports = indexRouter;
